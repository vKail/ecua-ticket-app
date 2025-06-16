import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTicketSaleStore } from "../stores/ticket-sale-store";
import { citiesService } from "@/features/cities/api/cities.service";
import { routeSheetsService } from "../api/route-sheets.service";
import { ticketSalesService } from "../api/ticket-sales.service";
import {
  transformSearchRequest,
  transformRouteSheetToOption,
  transformPhysicalSeatToSeat,
} from "../api/transformers";
import type { RouteSearchData } from "../components/route-selector";
import type { RouteOption } from "../components/route-list";
import type { Seat } from "../components/seat-selector";
import type { ConfirmationData } from "../components/confirmation";
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import { PassengerType } from "@/core/enums/PassengerType.enum";

export function useTicketSaleFlow() {
  const store = useTicketSaleStore();

  // Load cities on component mount
  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = useCallback(async () => {
    try {
      store.setCitiesLoading(true);
      const response = await citiesService.getCities();
      if (response.success && response.data) {
        store.setCities(response.data);
      }
    } catch (error) {
      console.error("Error loading cities:", error);
      toast.error("Error al cargar las ciudades");
    } finally {
      store.setCitiesLoading(false);
    }
  }, []);

  const handleRouteSearch = useCallback(
    async (searchData: RouteSearchData) => {
      try {
        // Find cities by name
        const originCity = store.cities.find(
          (city) => city.name.toLowerCase() === searchData.origin.toLowerCase()
        );
        const destinationCity = store.cities.find(
          (city) =>
            city.name.toLowerCase() === searchData.destination.toLowerCase()
        );

        if (!originCity || !destinationCity) {
          toast.error("Una de las ciudades seleccionadas no es válida");
          return;
        }

        store.setOriginCity(originCity);
        store.setDestinationCity(destinationCity);
        store.setRouteSearch(searchData);
        store.setRoutesLoading(true);
        store.setRoutesError(null);

        const searchRequest = transformSearchRequest(
          searchData,
          originCity,
          destinationCity
        );
        const response = await routeSheetsService.searchRoutes(searchRequest);

        if (response.success && response.data) {
          const transformedRoutes = response.data.map(
            transformRouteSheetToOption
          );
          store.setAvailableRoutes(transformedRoutes);
          store.nextStep();
        } else {
          throw new Error(
            String(response.message) || "Error en la búsqueda de rutas"
          );
        }
      } catch (error: any) {
        console.error("Error searching routes:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al buscar rutas";
        store.setRoutesError(errorMessage);
        toast.error(errorMessage);
      } finally {
        store.setRoutesLoading(false);
      }
    },
    [store.cities]
  );

  const handleRouteSelect = useCallback(async (route: RouteOption) => {
    try {
      store.setSelectedRoute(route);
      store.setSeatsLoading(true);
      store.setSeatsError(null);

      const routeSheetId = parseInt(route.id);
      const response = await routeSheetsService.getAvailableSeats(routeSheetId);

      if (response.success && response.data) {
        const transformedSeats = response.data.map(transformPhysicalSeatToSeat);
        store.setAvailableSeats(transformedSeats);
        store.nextStep();
      } else {
        throw new Error(
          String(response.message) || "Error al cargar los asientos"
        );
      }
    } catch (error: any) {
      console.error("Error loading seats:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al cargar los asientos";
      store.setSeatsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      store.setSeatsLoading(false);
    }
  }, []);

  const handleSeatSelect = useCallback((selectedSeats: Seat[]) => {
    store.setSelectedSeats(selectedSeats);
    store.initializePassengers();
    store.nextStep();
  }, []);

  const handlePassengerSubmit = useCallback(() => {
    // Validate passenger data
    let isValid = true;
    const errors: string[] = [];

    store.passengers.forEach((passenger, index) => {
      if (!passenger.firstName.trim()) {
        errors.push(`Pasajero ${index + 1}: Nombre requerido`);
        isValid = false;
      }
      if (!passenger.lastName.trim()) {
        errors.push(`Pasajero ${index + 1}: Apellido requerido`);
        isValid = false;
      }
      if (!passenger.documentNumber.trim()) {
        errors.push(`Pasajero ${index + 1}: Documento requerido`);
        isValid = false;
      }
      if (index === 0 && !passenger.email?.trim()) {
        errors.push("Pasajero principal: Email requerido");
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error(errors.join("\n"));
      return;
    }

    store.nextStep();
  }, [store.passengers]);

  const handlePaymentSubmit = useCallback(
    async (paymentMethod: string) => {
      try {
        store.setPaymentLoading(true);
        store.setPaymentError(null);

        if (
          !store.selectedRoute ||
          !store.routeSearch ||
          !store.originCity ||
          !store.destinationCity
        ) {
          throw new Error("Datos de la venta incompletos");
        }

        // Map payment method string to enum
        let paymentMethodEnum: PaymentMethod;
        switch (paymentMethod) {
          case "cash":
            paymentMethodEnum = PaymentMethod.CASH;
            break;
          case "credit-card":
          case "card":
            paymentMethodEnum = PaymentMethod.CASH; // Use CASH as there's no CARD option
            break;
          case "bank-transfer":
          case "transfer":
            paymentMethodEnum = PaymentMethod.TRANSFER;
            break;
          default:
            paymentMethodEnum = PaymentMethod.CASH;
        }

        // Prepare sale data
        const saleData = {
          paymentMethod: paymentMethodEnum,
          paymentStatus: "PENDING",
          bankReference:
            paymentMethodEnum !== PaymentMethod.CASH ? `REF-${Date.now()}` : "",
          userId: 1, // Ajustar según el usuario autenticado
          tickets: store.passengers.map((passenger, index) => ({
            frecuencySegmentPriceId: 1, // Ajustar según lógica de precios
            date: new Date().toISOString(), // O la fecha real del viaje
            physicalSeatId: parseInt(store.selectedSeats[index].id),
            passengerType: PassengerType.NORMAL,
            passengerId: index + 1, // O el ID real del pasajero si lo tienes
            passsengerDni: passenger.documentNumber,
            passengerName: passenger.firstName,
            passengerSurname: passenger.lastName,
            passengerEmail: passenger.email || "",
            passengerBirthDate: passenger.birthDate, // Usa la fecha real extraída o ingresada
          })),
        };

        const response = await ticketSalesService.createCounterSale(saleData);

        if (response.success && response.data) {
          // Generate QR for the first ticket
          const firstTicket = response.data.payment.tickets[0];
          let qrCode = "";

          try {
            const qrResponse = await routeSheetsService.generateQR(
              firstTicket.accessCode
            );
            if (qrResponse.success && qrResponse.data) {
              qrCode = qrResponse.data.qrCode;
            }
          } catch (qrError) {
            console.warn("Error generating QR code:", qrError);
          }

          // Create confirmation data
          const confirmationData: ConfirmationData = {
            reservationId: `RES-${response.data.payment.id}`,
            route: {
              origin: store.selectedRoute.origin,
              destination: store.selectedRoute.destination,
              departureTime: store.selectedRoute.departureTime,
              departureDate: store.routeSearch.date?.toLocaleDateString() || "",
              arrivalTime: store.selectedRoute.arrivalTime,
              busCompany: store.selectedRoute.busCompany,
              busType: store.selectedRoute.busType,
            },
            seats: store.selectedSeats.map((seat) => ({
              number: seat.number,
              price: seat.price,
            })),
            passengers: store.passengers.map((passenger) => ({
              name: `${passenger.firstName} ${passenger.lastName}`,
              documentNumber: passenger.documentNumber,
            })),
            contactInfo: {
              email: store.passengers[0].email || "",
              phone: store.passengers[0].phone || "",
            },
            paymentInfo: {
              method: paymentMethod,
              total: response.data.payment.amount,
              date: new Date().toLocaleDateString(),
            },
            qrCode,
          };

          store.setConfirmationData(confirmationData);
          store.nextStep();
          toast.success("¡Venta procesada exitosamente!");
        } else {
          throw new Error(response.message || "Error al procesar el pago");
        }
      } catch (error: any) {
        console.error("Error processing payment:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al procesar el pago";
        store.setPaymentError(errorMessage);
        toast.error(errorMessage);
      } finally {
        store.setPaymentLoading(false);
      }
    },
    [
      store.selectedRoute,
      store.routeSearch,
      store.originCity,
      store.destinationCity,
      store.passengers,
      store.selectedSeats,
    ]
  );

  const handleFinish = useCallback(() => {
    store.resetFlow();
    toast.success("Proceso completado. Listo para una nueva venta.");
  }, []);

  return {
    // State
    ...store,

    // Actions
    handleRouteSearch,
    handleRouteSelect,
    handleSeatSelect,
    handlePassengerSubmit,
    handlePaymentSubmit,
    handleFinish,

    // Utilities
    getCityByName: useCallback(
      (name: string) => {
        return store.cities.find(
          (city) => city.name.toLowerCase() === name.toLowerCase()
        );
      },
      [store.cities]
    ),
  };
}
