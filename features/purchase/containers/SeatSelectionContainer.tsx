"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RouteOption } from "../components/RouteListMobile";
import { SeatSelector, Seat } from "@/features/ticket-sales/components/seat-selector";
import { useAvailableSeats } from "@/features/ticket-sales/hooks/useQueries/useAvailableSeats";
import { transformPhysicalSeatToSeat } from "@/features/ticket-sales/api/transformers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SeatSelectionContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Obtener datos de la ruta seleccionada
  useEffect(() => {
    const routeData = searchParams.get("route");
    if (routeData) {
      try {
        const parsedRoute = JSON.parse(decodeURIComponent(routeData));
        setSelectedRoute(parsedRoute);
      } catch (error) {
        console.error("Error parsing route data:", error);
      }
    }
  }, [searchParams]);

  // Obtener asientos disponibles
  const {
    data: seatsData,
    isLoading: seatsLoading,
    error: seatsError,
  } = useAvailableSeats(
    selectedRoute ? parseInt(selectedRoute.id) : 0,
    !!selectedRoute
  );

  // Transformar datos de asientos
  const seats = seatsData?.success && seatsData.data && selectedRoute
    ? seatsData.data.map((seat) =>
        transformPhysicalSeatToSeat(seat, selectedRoute.price)
      )
    : [];

  const handleSeatSelect = (seats: Seat[]) => {
    console.log("Asientos seleccionados:", seats); // Para debugging
    setSelectedSeats(seats);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0 || !selectedRoute) {
      console.log("No se puede continuar: no hay asientos seleccionados o ruta");
      return;
    }
    
    console.log("Continuando con:", { route: selectedRoute, seats: selectedSeats });
    
    // Preparar datos para la página de pasajeros
    const data = {
      route: selectedRoute,
      seats: selectedSeats,
    };
    const encodedData = encodeURIComponent(JSON.stringify(data));
    router.push(`/dashboard/purchase/passengers?data=${encodedData}`);
  };

  if (!selectedRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando información de la ruta...</p>
      </div>
    );
  }

  // Asegurarnos de que maxSeats sea un número válido
  const maxSeats = selectedRoute.availableSeats || 1;
  console.log("maxSeats:", maxSeats); // Debug

  return (
    <div className="min-h-screen bg-white px-4 pt-4 pb-24">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">Selección de Asientos</h1>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ruta</p>
              <p className="font-medium">
                {selectedRoute.origin} → {selectedRoute.destination}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha y Hora</p>
              <p className="font-medium">{selectedRoute.departureTime}</p>
            </div>
          </div>
        </div>
      </div>

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
            <p className="text-red-500 mb-4">Error al cargar los asientos</p>
            <Button
              variant="link"
              onClick={() => router.back()}
              className="text-primary"
            >
              Volver a seleccionar ruta
            </Button>
          </CardContent>
        </Card>
      )}

      {!seatsLoading && !seatsError && (
        <>
          <SeatSelector
            seats={seats}
            maxSeats={maxSeats}
            onSeatSelect={handleSeatSelect}
            className="mb-6"
            routeData={selectedRoute}
          />

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <Button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              size="lg"
              className="w-full"
            >
              Continuar ({selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''} seleccionado{selectedSeats.length !== 1 ? 's' : ''})
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 