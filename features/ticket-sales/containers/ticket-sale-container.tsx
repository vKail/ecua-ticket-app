"use client";

import { useState, useMemo } from "react";
import {
  Bus,
  CreditCard,
  MapPin,
  User,
  Check,
  Loader2,
  Shield,
} from "lucide-react";
import { Steps } from "@/components/ui/steps";
import { CheckoutSummary } from "../components/checkout-summary";
import { Confirmation } from "../components/confirmation";
import { PassengerForm } from "../components/passenger-form";
import { RouteList } from "../components/route-list";
import { RouteSelector } from "../components/route-selector";
import { SeatSelector } from "../components/seat-selector";
import { PaymentValidation } from "../components/payment-validation";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// React Query hooks
import { useCities } from "@/features/cities/hooks/useQueries/useCities";

// Types
import type { RouteSearchData } from "../components/route-selector";
import type { RouteOption } from "../components/route-list";
import type { Seat } from "../components/seat-selector";
import type { PassengerData } from "../components/passenger-form";
import type { ConfirmationData } from "../components/confirmation";
import type { City } from "@/core/models/City";

// Transformers
import {
  transformSearchRequest,
  transformRouteSheetToOption,
  transformPhysicalSeatToSeat,
} from "../api/transformers";

// Enums
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import { PassengerType } from "@/core/enums/PassengerType.enum";
import { useRouteSearch } from "../hooks/useQueries/useRouteSearch";
import { useAvailableSeats } from "../hooks/useQueries/useAvailableSeats";
import { useCreateCounterSale } from "../hooks/useMutations/useCreateCounterSale";
import { useValidatePayment } from "../hooks/useMutations/useValidatePayment";
import { useRejectPayment } from "../hooks/useMutations/useRejectPayment";

export function TicketSalesContainer() {
  // Step management
  const [currentStep, setCurrentStep] = useState(0);

  // Form data state
  const [routeSearch, setRouteSearch] = useState<RouteSearchData | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [passengers, setPassengers] = useState<PassengerData[]>([]);
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentTotal, setPaymentTotal] = useState<number>(0);

  // Selected cities for search
  const [originCity, setOriginCity] = useState<City | null>(null);
  const [destinationCity, setDestinationCity] = useState<City | null>(null);

  // React Query hooks
  const { data: citiesData, isLoading: citiesLoading } = useCities();

  const searchParams = useMemo(() => {
    if (!routeSearch || !originCity || !destinationCity) {
      return { originId: 0, destinationId: 0, date: "" };
    }
    return transformSearchRequest(routeSearch, originCity, destinationCity);
  }, [routeSearch, originCity, destinationCity]);

  const {
    data: routesData,
    isLoading: routesLoading,
    error: routesError,
  } = useRouteSearch(searchParams, currentStep === 1);

  const {
    data: seatsData,
    isLoading: seatsLoading,
    error: seatsError,
  } = useAvailableSeats(
    selectedRoute ? parseInt(selectedRoute.id) : 0,
    currentStep === 2 && !!selectedRoute
  );

  const createSaleMutation = useCreateCounterSale();
  const validatePaymentMutation = useValidatePayment();
  const rejectPaymentMutation = useRejectPayment();

  // Transform data for UI
  const cities = citiesData?.data.records || [];
  const routes =
    routesData?.success && routesData.data
      ? routesData.data.map(transformRouteSheetToOption)
      : [];
  const seats =
    seatsData?.success && seatsData.data && selectedRoute
      ? seatsData.data.map((seat) =>
          transformPhysicalSeatToSeat(seat, selectedRoute.price)
        )
      : [];

  const steps = [
    { title: "Ruta", icon: <MapPin className="h-5 w-5" /> },
    { title: "Horario", icon: <Bus className="h-5 w-5" /> },
    { title: "Asientos", icon: <Bus className="h-5 w-5" /> },
    { title: "Pasajeros", icon: <User className="h-5 w-5" /> },
    { title: "Pago", icon: <CreditCard className="h-5 w-5" /> },
    { title: "Validación", icon: <Shield className="h-5 w-5" /> },
    { title: "Confirmación", icon: <Check className="h-5 w-5" /> },
  ];

  // Event handlers
  const handleRouteSearch = (searchData: RouteSearchData) => {
    const origin = cities.find(
      (city: City) =>
        city.name.toLowerCase() === searchData.origin.toLowerCase()
    );
    const destination = cities.find(
      (city: City) =>
        city.name.toLowerCase() === searchData.destination.toLowerCase()
    );

    if (!origin || !destination) {
      toast.error("Una de las ciudades seleccionadas no es válida");
      return;
    }

    setOriginCity(origin);
    setDestinationCity(destination);
    setRouteSearch(searchData);
    setCurrentStep(1);
  };

  const handleRouteSelect = (route: RouteOption) => {
    setSelectedRoute(route);
    setCurrentStep(2);
  };

  const handleSeatSelect = (seats: Seat[]) => {
    setSelectedSeats(seats);

    const initialPassengers = seats.map((seat, index) => ({
      id: `passenger-${index}`,
      firstName: "",
      lastName: "",
      documentType: "",
      documentNumber: "",
      email: "",
      phone: "",
      seatNumber: seat.number,
      birthDate: "",
    }));

    setPassengers(initialPassengers);
    setCurrentStep(3);
  };

  const handleUpdatePassenger = (
    index: number,
    data: Partial<PassengerData>
  ) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
  };

  const handlePassengerSubmit = () => {
    setCurrentStep(4);
  };

  const handlePaymentSubmit = async (paymentMethod: string) => {
    if (!selectedRoute || !routeSearch || !originCity || !destinationCity) {
      toast.error("Datos de la venta incompletos");
      return;
    }

    // Validar fechas de nacimiento
    const missingBirthDate = passengers.some((p) => !p.birthDate);
    if (missingBirthDate) {
      toast.error(
        "Todos los pasajeros deben tener fecha de nacimiento (sube la cédula o ingrésala manualmente)."
      );
      return;
    }

    // Map payment method to enum
    let paymentMethodEnum: PaymentMethod;
    switch (paymentMethod) {
      case "cash":
        paymentMethodEnum = PaymentMethod.CASH;
        break;
      case "credit-card":
      case "card":
        paymentMethodEnum = PaymentMethod.CASH; // Use CASH as fallback
        break;
      case "bank-transfer":
      case "transfer":
        paymentMethodEnum = PaymentMethod.TRANSFER;
        break;
      case "paypal":
        paymentMethodEnum = PaymentMethod.PAYPAL;
        break;
      default:
        paymentMethodEnum = PaymentMethod.CASH;
    }

    // Guardar método de pago para usar en validación
    setPaymentMethod(paymentMethod);

    // Prepare sale data
    const saleData = {
      paymentMethod: paymentMethodEnum,
      paymentStatus: "PENDING",
      bankReference:
        paymentMethodEnum !== PaymentMethod.CASH ? `REF-${Date.now()}` : "",
      userId: 1, // Ajustar según el usuario autenticado
      tickets: passengers.map((passenger, index) => ({
        frecuencySegmentPriceId: 1, // Debes obtener el ID real según la lógica de precios
        date: new Date().toISOString(), // O la fecha real del viaje
        physicalSeatId: parseInt(selectedSeats[index].id),
        passengerType: PassengerType.NORMAL,
        passengerId: index + 1, // O el ID real del pasajero si lo tienes
        passsengerDni: passenger.documentNumber,
        passengerName: passenger.firstName,
        passengerSurname: passenger.lastName,
        passengerEmail: passenger.email || "",
        passengerBirthDate: passenger.birthDate, // Usa la fecha real extraída o ingresada
      })),
    };

    createSaleMutation.mutate(saleData, {
      onSuccess: (response) => {
        console.log(response);
        if (response && response.success && response.data) {
          // Guardar datos para validación
          setPaymentId(response.data.paymentId);
          const total = response.data.tickets.reduce(
            (sum: number, t: any) => sum + (t.price || 0),
            0
          );
          setPaymentTotal(total);

          // Ir al paso de validación
          setCurrentStep(5);
        } else {
          toast.error("Error al procesar la venta");
        }
      },
    });
  };

  const handleValidatePayment = (paypalOrderId?: string) => {
    if (!paymentId) {
      toast.error("No hay un pago pendiente para validar");
      return;
    }

    validatePaymentMutation.mutate(
      { paymentId, paypalOrderId },
      {
        onSuccess: () => {
          // Construir datos de confirmación después de validar
          if (selectedRoute && routeSearch) {
            const confirmation: ConfirmationData = {
              reservationId: `RES-${paymentId}`,
              route: {
                origin: selectedRoute.origin,
                destination: selectedRoute.destination,
                departureTime: selectedRoute.departureTime,
                departureDate:
                  routeSearch.date?.toLocaleDateString() ||
                  new Date().toLocaleDateString(),
                arrivalTime: selectedRoute.arrivalTime,
                busCompany: selectedRoute.busCompany,
                busType: selectedRoute.busType,
              },
              seats: selectedSeats.map((seat) => ({
                number: seat.number,
                price: seat.price,
              })),
              passengers: passengers.map((passenger) => ({
                name: `${passenger.firstName} ${passenger.lastName}`,
                documentNumber: passenger.documentNumber,
              })),
              contactInfo: {
                email: passengers[0].email || "",
                phone: passengers[0].phone || "",
              },
              paymentInfo: {
                method: paymentMethod,
                total: paymentTotal,
                date: new Date().toLocaleDateString(),
              },
            };
            setConfirmationData(confirmation);
          }
          setCurrentStep(6);
        },
      }
    );
  };

  const handleRejectPayment = () => {
    if (!paymentId) {
      toast.error("No hay un pago pendiente para rechazar");
      return;
    }

    rejectPaymentMutation.mutate(paymentId, {
      onSuccess: () => {
        // Volver al paso de pago
        setCurrentStep(4);
        setPaymentId(null);
        setPaymentMethod("");
        setPaymentTotal(0);
      },
    });
  };

  const handleFinish = () => {
    // Reset flow
    setCurrentStep(0);
    setRouteSearch(null);
    setSelectedRoute(null);
    setSelectedSeats([]);
    setPassengers([]);
    setConfirmationData(null);
    setOriginCity(null);
    setDestinationCity(null);
    setPaymentId(null);
    setPaymentMethod("");
    setPaymentTotal(0);
  };

  // Loading states
  if (citiesLoading && cities.length === 0) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Cargando información inicial...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Steps currentStep={currentStep} steps={steps} />

      <div className="mt-8">
        {/* Step 0: Route Search */}
        {currentStep === 0 && <RouteSelector onSearch={handleRouteSearch} />}

        {/* Step 1: Route Selection */}
        {currentStep === 1 && routeSearch && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              Rutas disponibles: {routeSearch.origin} a{" "}
              {routeSearch.destination}
            </h2>
            <p className="text-muted-foreground">
              {routeSearch.date?.toLocaleDateString()} ·{" "}
              {routeSearch.passengers} pasajero
              {routeSearch.passengers !== 1 ? "s" : ""}
            </p>

            {routesLoading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>Buscando rutas disponibles...</p>
                </CardContent>
              </Card>
            )}

            {routesError && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-red-500 mb-4">Error al cargar las rutas</p>
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="text-blue-500 hover:underline"
                  >
                    Volver a buscar
                  </button>
                </CardContent>
              </Card>
            )}

            {!routesLoading && !routesError && (
              <RouteList routes={routes} onSelectRoute={handleRouteSelect} />
            )}
          </div>
        )}

        {/* Step 2: Seat Selection */}
        {currentStep === 2 && selectedRoute && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Selección de Asientos</h2>
            <p className="text-muted-foreground">
              {selectedRoute.busCompany} · {selectedRoute.busType} ·{" "}
              {selectedRoute.departureTime}
            </p>

            {seatsLoading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>Cargando asientos disponibles...</p>
                </CardContent>
              </Card>
            )}

            {seatsError && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-red-500 mb-4">
                    Error al cargar los asientos
                  </p>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-500 hover:underline"
                  >
                    Volver a seleccionar ruta
                  </button>
                </CardContent>
              </Card>
            )}

            {!seatsLoading && !seatsError && (
              <SeatSelector
                seats={seats}
                maxSeats={routeSearch?.passengers || 1}
                onSeatSelect={handleSeatSelect}
              />
            )}
          </div>
        )}

        {/* Step 3: Passenger Form */}
        {currentStep === 3 && passengers.length > 0 && (
          <PassengerForm
            passengers={passengers}
            onUpdatePassenger={handleUpdatePassenger}
            onSubmit={handlePassengerSubmit}
          />
        )}

        {/* Step 4: Checkout */}
        {currentStep === 4 && selectedRoute && routeSearch && (
          <div className="space-y-4">
            {createSaleMutation.isPending ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>Procesando pago...</p>
                </CardContent>
              </Card>
            ) : (
              <CheckoutSummary
                checkoutData={{
                  route: {
                    origin: selectedRoute.origin,
                    destination: selectedRoute.destination,
                    departureTime: selectedRoute.departureTime,
                    departureDate:
                      routeSearch.date?.toLocaleDateString() ||
                      new Date().toLocaleDateString(),
                    arrivalTime: selectedRoute.arrivalTime,
                    busCompany: selectedRoute.busCompany,
                    busType: selectedRoute.busType,
                  },
                  seats: selectedSeats.map((seat) => ({
                    number: seat.number,
                    price: seat.price,
                  })),
                  passengers: passengers.map((passenger) => ({
                    name: `${passenger.firstName} ${passenger.lastName}`,
                    documentNumber: passenger.documentNumber,
                  })),
                  contactInfo: {
                    email: passengers[0].email || "",
                    phone: passengers[0].phone || "",
                  },
                }}
                onPaymentSubmit={handlePaymentSubmit}
              />
            )}
          </div>
        )}

        {/* Step 5: Payment Validation */}
        {currentStep === 5 && paymentId && (
          <PaymentValidation
            paymentId={paymentId}
            paymentMethod={paymentMethod}
            totalAmount={paymentTotal}
            onValidate={handleValidatePayment}
            onReject={handleRejectPayment}
            isValidating={validatePaymentMutation.isPending}
            isRejecting={rejectPaymentMutation.isPending}
          />
        )}

        {/* Step 6: Confirmation */}
        {currentStep === 6 && confirmationData && (
          <Confirmation
            confirmationData={confirmationData}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}
