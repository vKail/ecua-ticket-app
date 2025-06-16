"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PassengerForm,
  PassengerData,
} from "@/features/ticket-sales/components/passenger-form";
import { Seat } from "@/features/ticket-sales/components/seat-selector";
import { RouteOption } from "@/features/ticket-sales/components/route-list";
import { toast } from "sonner";

interface RouteAndSeatsData {
  route: RouteOption;
  seats: Seat[];
}

export function PassengerFormContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [routeData, setRouteData] = useState<RouteAndSeatsData | null>(null);
  const [passengers, setPassengers] = useState<PassengerData[]>([]);

  // Obtener datos de la ruta y asientos seleccionados
  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        console.log("Datos recibidos:", parsedData); // Debug
        setRouteData(parsedData);

        // Inicializar el array de pasajeros basado en los asientos seleccionados
        const initialPassengers = parsedData.seats.map((seat: Seat) => ({
          id: crypto.randomUUID(),
          firstName: "",
          lastName: "",
          documentType: "cedula",
          documentNumber: "",
          email: "",
          phone: "",
          seatNumber: seat.number,
          birthDate: "",
        }));
        setPassengers(initialPassengers);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [searchParams]);

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

  const handleSubmit = () => {
    if (!routeData) return;

    // Validar que todos los pasajeros tengan datos completos
    const arePassengersComplete = passengers.every(
      (passenger) =>
        passenger.firstName.trim() &&
        passenger.lastName.trim() &&
        passenger.documentNumber.trim() &&
        passenger.email.trim() &&
        passenger.phone.trim() &&
        passenger.birthDate.trim()
    );

    if (!arePassengersComplete) {
      toast.info("Por favor, completa todos los datos de los pasajeros");
      return;
    }

    // Preparar datos para la siguiente página (checkout)
    const data = {
      route: routeData.route,
      seats: routeData.seats,
      passengers: passengers,
    };
    const encodedData = encodeURIComponent(JSON.stringify(data));
    router.push(`/dashboard/purchase/checkout?data=${encodedData}`);
  };

  if (!routeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-4 pb-24">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">Información de Pasajeros</h1>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ruta</p>
              <p className="font-medium">
                {routeData.route.origin} → {routeData.route.destination}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha y Hora</p>
              <p className="font-medium">{routeData.route.departureTime}</p>
            </div>
          </div>
        </div>
      </div>

      <PassengerForm
        passengers={passengers}
        onUpdatePassenger={handleUpdatePassenger}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
