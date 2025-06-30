"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RouteOption } from "../components/RouteListMobile";
import {
  SeatSelector,
  Seat,
} from "@/features/ticket-sales/components/seat-selector";
import { useAvailableSeats } from "@/features/ticket-sales/hooks/useQueries/useAvailableSeats";
import { transformPhysicalSeatToSeat } from "@/features/ticket-sales/api/transformers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InteractiveBusLayoutSelector } from "@/features/ticket-sales/components/interactive-bus-layout-selector";
import { RouteSearchData } from "@/features/ticket-sales/components/route-selector";

export function SeatSelectionContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [routeSearch, setRouteSearch] = useState<RouteSearchData | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [passengers, setPassengers] = useState<number>(1);

  // Obtener datos de la ruta seleccionada y búsqueda
  useEffect(() => {
    const routeData = searchParams.get("route");
    const routeSearchData = searchParams.get("routeSearch");

    if (routeData) {
      try {
        const parsedRoute = JSON.parse(decodeURIComponent(routeData));
        setSelectedRoute(parsedRoute);
      } catch (error) {
        console.error("Error parsing route data:", error);
      }
    }

    if (routeSearchData) {
      try {
        const parsedSearch = JSON.parse(decodeURIComponent(routeSearchData));
        setRouteSearch(parsedSearch);
        setPassengers(parsedSearch.passengers || 1);
      } catch (error) {
        console.error("Error parsing route search data:", error);
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

  const handleSeatSelect = (seats: any[]) => {
    console.log("Asientos seleccionados (raw):", seats); // Para debugging

    // Transform the new seat structure to the old one for compatibility
    const transformedSeats: Seat[] = seats.map((seat) => ({
      id: seat.id.toString(),
      number: seat.number,
      position: { row: 0, col: 0 }, // These aren't used in the rest of the flow
      status: "selected" as const,
      price: seat.price,
      type: "window" as const, // Default type, not critical for the flow
    }));

    console.log("Asientos transformados:", transformedSeats); // Para debugging
    setSelectedSeats(transformedSeats);

    // Redirigir automáticamente después de seleccionar asientos
    if (transformedSeats.length > 0 && selectedRoute) {
      console.log("Continuando automáticamente con:", {
        route: selectedRoute,
        seats: transformedSeats,
      });

      // Preparar datos para la página de pasajeros
      const data = {
        route: selectedRoute,
        seats: transformedSeats,
      };
      const encodedData = encodeURIComponent(JSON.stringify(data));
      router.push(`/dashboard/purchase/passengers?data=${encodedData}`);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0 || !selectedRoute) {
      console.log(
        "No se puede continuar: no hay asientos seleccionados o ruta"
      );
      return;
    }

    console.log("Continuando con:", {
      route: selectedRoute,
      seats: selectedSeats,
    });

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

  // Transformar datos de asientos para InteractiveBusLayoutSelector
  const busSeatsData =
    seatsData?.success && seatsData.data && selectedRoute
      ? {
          busId: parseInt(selectedRoute.id),
          totalSeats: seatsData.data.length,
          floors: 1, // Asumiendo un piso por defecto
          seatsByFloor: {
            "1": seatsData.data.map((seat) => ({
              id: seat.id,
              seatNumber: seat.seatNumber,
              row: seat.row,
              column: seat.column,
              floor: seat.floor,
              isAvailable: !seat.isTaken,
              isTaken: seat.isTaken,
              seatType: seat.seatType?.name || "Standard",
              price: seat.seatType?.valueToApply || selectedRoute.price,
              seatValue: seat.seatType?.valueToApply || selectedRoute.price,
            })),
          },
        }
      : null;
  const basePrice = selectedRoute?.price || 0;

  // Asegurarnos de que maxSeats sea un número válido
  const maxSeats = passengers || selectedRoute?.passengers || 1;
  console.log("maxSeats:", maxSeats, "passengers:", passengers); // Debug

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
          {!seatsLoading && !seatsError && busSeatsData && (
            <InteractiveBusLayoutSelector
              seats={busSeatsData}
              maxSeats={maxSeats}
              basePrice={basePrice}
              onSeatSelect={handleSeatSelect}
            />
          )}
        </>
      )}
    </div>
  );
}
