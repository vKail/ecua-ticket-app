"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export interface Seat {
  id: string;
  number: string;
  position: {
    row: number;
    col: number;
  };
  status: "available" | "selected" | "occupied" | "disabled";
  price: number;
  type: "window" | "aisle" | "middle";
}

interface SeatSelectorProps {
  seats: Seat[];
  maxSeats: number;
  onSeatSelect: (selectedSeats: Seat[]) => void;
  className?: string;
  routeData?: any;
}

export function SeatSelector({
  seats,
  maxSeats,
  onSeatSelect,
  className,
  routeData,
}: SeatSelectorProps) {
  const router = useRouter();
  console.log("SeatSelector renderizado con seats:", seats); // Debug inicial
  console.log("maxSeats recibido:", maxSeats); // Debug de maxSeats

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Actualizar el estado cuando cambian los asientos disponibles
  useEffect(() => {
    // Filtrar los asientos seleccionados que ya no están disponibles
    const availableSelectedSeats = selectedSeats.filter(selectedSeat =>
      seats.some(seat => seat.id === selectedSeat.id && seat.status === "available")
    );
    
    if (availableSelectedSeats.length !== selectedSeats.length) {
      setSelectedSeats(availableSelectedSeats);
      onSeatSelect(availableSelectedSeats);
    }
  }, [seats, onSeatSelect]);

  const handleSeatClick = (seat: Seat) => {
    console.log("handleSeatClick llamado con asiento:", seat); // Debug del clic
    console.log("Asientos actualmente seleccionados:", selectedSeats.length); // Debug de selección actual

    if (seat.status === "occupied" || seat.status === "disabled") {
      console.log("Asiento no disponible:", seat.status); // Debug de estado
      return;
    }

    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    console.log("¿Asiento ya seleccionado?:", isSelected); // Debug de selección

    let updatedSeats: Seat[];

    if (isSelected) {
      updatedSeats = selectedSeats.filter((s) => s.id !== seat.id);
      console.log("Deseleccionando asiento"); // Debug de deselección
    } else {
      if (selectedSeats.length >= maxSeats) {
        console.log("Límite de asientos alcanzado:", selectedSeats.length, "de", maxSeats); // Debug de límite
        return;
      }
      updatedSeats = [...selectedSeats, seat];
      console.log("Seleccionando asiento"); // Debug de selección
    }

    console.log("Nuevos asientos seleccionados:", updatedSeats); // Debug final
    setSelectedSeats(updatedSeats);
    onSeatSelect(updatedSeats);
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0 || !routeData) {
      console.log("No se puede continuar: no hay asientos seleccionados o ruta");
      return;
    }

    console.log("Continuando con:", { route: routeData, seats: selectedSeats });
    
    // Preparar datos para la página de pasajeros
    const data = {
      route: routeData,
      seats: selectedSeats,
    };
    const encodedData = encodeURIComponent(JSON.stringify(data));
    const url = `/dashboard/purchase/passengers?data=${encodedData}`;
    console.log("Navegando a:", url);
    router.push(url);
  };

  const rows = Math.max(...seats.map((seat) => seat.position.row)) + 1;
  const cols = Math.max(...seats.map((seat) => seat.position.col)) + 1;

  const seatGrid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));

  seats.forEach((seat) => {
    seatGrid[seat.position.row][seat.position.col] = {
      ...seat,
      status: selectedSeats.some((s) => s.id === seat.id)
        ? "selected"
        : seat.status,
    };
  });

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Selección de Asientos</CardTitle>
        <CardDescription>
          Selecciona hasta {maxSeats} asiento{maxSeats !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-500 mr-2"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-primary mr-2"></div>
                <span>Seleccionado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-gray-300 mr-2"></div>
                <span>Ocupado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-gray-100 border border-dashed border-gray-400 mr-2"></div>
                <span>No disponible</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-3/4 h-12 mb-6 bg-gray-200 rounded-t-3xl flex items-center justify-center">
              <span className="font-medium">Frente del Bus</span>
            </div>

            <TooltipProvider>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
              >
                {seatGrid.map((row, rowIndex) =>
                  row.map((seat, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`} className="p-1">
                      {seat ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "w-10 h-10 rounded-sm flex items-center justify-center text-xs font-medium transition-colors",
                                seat.status === "available" &&
                                  "bg-green-100 border border-green-500 hover:bg-green-200 cursor-pointer",
                                seat.status === "selected" &&
                                  "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer",
                                seat.status === "occupied" &&
                                  "bg-gray-300 cursor-not-allowed",
                                seat.status === "disabled" &&
                                  "bg-gray-100 border border-dashed border-gray-400 cursor-not-allowed"
                              )}
                              onClick={() => {
                                console.log("Click en asiento:", seat); // Debug del clic en el botón
                                handleSeatClick(seat);
                              }}
                              disabled={
                                seat.status === "occupied" ||
                                seat.status === "disabled"
                              }
                            >
                              {seat.number}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <p>Asiento {seat.number}</p>
                              <p>
                                Tipo:{" "}
                                {seat.type === "window"
                                  ? "Ventana"
                                  : seat.type === "aisle"
                                  ? "Pasillo"
                                  : "Medio"}
                              </p>
                              {seat.status !== "disabled" && (
                                <p>Precio: ${seat.price.toFixed(2)}</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div className="w-10 h-10"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TooltipProvider>

            <div className="w-3/4 h-12 mt-6 bg-gray-200 rounded-b-3xl flex items-center justify-center">
              <span className="font-medium">Parte trasera</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-medium">Asientos seleccionados:</h4>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-md flex items-center gap-2"
                  >
                    <span>Asiento {seat.number}</span>
                    <span className="text-xs text-muted-foreground">
                      ${seat.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleSeatClick(seat)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No has seleccionado ningún asiento
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {selectedSeats.length} de {maxSeats} asientos seleccionados
          </p>
          {selectedSeats.length > 0 && (
            <p className="font-medium">
              Total: $
              {selectedSeats
                .reduce((sum, seat) => sum + seat.price, 0)
                .toFixed(2)}
            </p>
          )}
        </div>
        <Button
          onClick={handleConfirmSelection}
          disabled={selectedSeats.length === 0 || selectedSeats.length > maxSeats}
        >
          Confirmar selección
        </Button>
      </CardFooter>
    </Card>
  );
}
