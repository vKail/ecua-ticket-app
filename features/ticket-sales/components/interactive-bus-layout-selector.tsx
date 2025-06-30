"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bus, Users, MapPin, Layers, Check } from "lucide-react";

interface BusSeat {
  id: number;
  seatNumber: string;
  row: number;
  column: number;
  floor: number;
  seatType: string;
  seatValue: number;
  isTaken: boolean;
}

interface BusSeatsData {
  busId: number;
  totalSeats: number;
  floors: number;
  seatsByFloor: Record<string, BusSeat[]>;
}

interface SelectedSeat {
  id: number;
  number: string;
  price: number;
  seatType: string;
  seatValue: number;
}

interface InteractiveBusLayoutSelectorProps {
  seats: BusSeatsData;
  maxSeats: number;
  basePrice: number;
  onSeatSelect: (selectedSeats: SelectedSeat[]) => void;
  className?: string;
}

const seatTypeColors: Record<string, string> = {
  Standard: "bg-blue-500 hover:bg-blue-600",
  Premium: "bg-purple-500 hover:bg-purple-600",
  VIP: "bg-amber-500 hover:bg-amber-600",
  Economy: "bg-green-500 hover:bg-green-600",
  Normal: "bg-blue-500 hover:bg-blue-600",
};

export function InteractiveBusLayoutSelector({
  seats,
  maxSeats,
  basePrice,
  onSeatSelect,
  className,
}: InteractiveBusLayoutSelectorProps) {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  // Safety checks
  const seatsByFloor = seats?.seatsByFloor || {};
  const totalSeats = seats?.totalSeats || 0;
  const floors = Object.keys(seatsByFloor).map(Number).sort();
  const [activeFloor, setActiveFloor] = useState(floors[0]?.toString() || "1");

  const handleSeatClick = (seat: BusSeat) => {
    if (seat.isTaken) return;

    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= maxSeats) return;

      const newSeat: SelectedSeat = {
        id: seat.id,
        number: seat.seatNumber,
        price: basePrice * seat.seatValue,
        seatType: seat.seatType,
        seatValue: seat.seatValue,
      };
      setSelectedSeats([...selectedSeats, newSeat]);
    }
  };

  const handleConfirm = () => {
    onSeatSelect(selectedSeats);
  };

  // Empty state
  if (!seats || !seatsByFloor || Object.keys(seatsByFloor).length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Selección de Asientos</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Bus className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No hay asientos disponibles
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Este bus no tiene configuración de asientos disponible.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderSeatGrid = (floorSeats: BusSeat[]) => {
    if (!floorSeats || !Array.isArray(floorSeats) || floorSeats.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Layers className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-center">
            No hay asientos en este piso
          </p>
        </div>
      );
    }

    // Group seats by row and column for grid layout
    const maxRow = Math.max(...floorSeats.map((s) => s.row));
    const maxCol = Math.max(...floorSeats.map((s) => s.column));

    const seatGrid: (BusSeat | null)[][] = Array(maxRow)
      .fill(null)
      .map(() => Array(maxCol).fill(null));

    floorSeats.forEach((seat) => {
      if (seat.row > 0 && seat.column > 0) {
        seatGrid[seat.row - 1][seat.column - 1] = seat;
      }
    });

    return (
      <div className="space-y-4">
        {/* Bus Front Indicator */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
            <Bus className="h-4 w-4 inline mr-2" />
            Frente del Bus
          </div>
        </div>

        {/* Seat Grid */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <div className="space-y-3">
            {seatGrid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center space-x-2">
                {/* Left side seats */}
                <div className="flex space-x-1">
                  {row
                    .slice(0, Math.ceil(row.length / 2))
                    .map((seat, colIndex) => (
                      <InteractiveSeatButton
                        key={`${rowIndex}-${colIndex}`}
                        seat={seat}
                        isSelected={
                          seat ? selectedSeats.some((s) => s.id === seat.id) : false
                        }
                        onClick={seat ? () => handleSeatClick(seat) : undefined}
                        basePrice={basePrice}
                      />
                    ))}
                </div>

                {/* Aisle */}
                <div className="w-8 flex items-center justify-center">
                  <div className="w-1 h-8 bg-gray-300 rounded"></div>
                </div>

                {/* Right side seats */}
                <div className="flex space-x-1">
                  {row
                    .slice(Math.ceil(row.length / 2))
                    .map((seat, colIndex) => (
                      <InteractiveSeatButton
                        key={`${rowIndex}-${
                          colIndex + Math.ceil(row.length / 2)
                        }`}
                        seat={seat}
                        isSelected={
                          seat ? selectedSeats.some((s) => s.id === seat.id) : false
                        }
                        onClick={seat ? () => handleSeatClick(seat) : undefined}
                        basePrice={basePrice}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-500" />
            <span className="text-sm">Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-sm">Seleccionado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-sm">Ocupado</span>
          </div>
        </div>

        {/* Seat type legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {Object.entries(
            floorSeats.reduce((acc, seat) => {
              acc[seat.seatType] = (acc[seat.seatType] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => (
            <Badge
              key={type}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <div
                className={`w-3 h-3 rounded ${
                  seatTypeColors[type] || "bg-gray-500"
                }`}
              />
              <span>
                {type}: {count}
              </span>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Selección de Asientos</span>
          </div>
          <Badge variant="secondary">
            <Users className="h-4 w-4 mr-1" />
            {totalSeats} asientos totales
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {floors.length > 1 ? (
            <Tabs value={activeFloor} onValueChange={setActiveFloor}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                {floors.map((floor) => (
                  <TabsTrigger key={floor} value={floor.toString()}>
                    <Layers className="h-4 w-4 mr-2" />
                    Piso {floor}
                  </TabsTrigger>
                ))}
              </TabsList>

              {floors.map((floor) => (
                <TabsContent key={floor} value={floor.toString()}>
                  {renderSeatGrid(seatsByFloor[floor.toString()] || [])}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            renderSeatGrid(seatsByFloor[activeFloor] || [])
          )}

          {/* Selected seats summary */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Asientos seleccionados:</h4>
            {selectedSeats.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-md flex items-center gap-2"
                    >
                      <span className="font-medium">{seat.number}</span>
                      <span className="text-xs text-muted-foreground">
                        {seat.seatType}
                      </span>
                      <span className="text-xs font-medium">
                        ${seat.price.toFixed(2)}
                      </span>
                      <button
                        className="text-muted-foreground hover:text-foreground text-xs"
                        onClick={() =>
                          setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    {selectedSeats.length} de {maxSeats} asientos
                  </span>
                  <span className="font-bold">
                    Total: ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Selecciona hasta {maxSeats} asiento{maxSeats !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Confirm button */}
          <Button
            onClick={handleConfirm}
            disabled={selectedSeats.length === 0 || selectedSeats.length > maxSeats}
            className="w-full"
            size="lg"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirmar selección ({selectedSeats.length} asientos)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface InteractiveSeatButtonProps {
  seat: BusSeat | null;
  isSelected: boolean;
  onClick?: () => void;
  basePrice: number;
}

function InteractiveSeatButton({
  seat,
  isSelected,
  onClick,
  basePrice,
}: InteractiveSeatButtonProps) {
  if (!seat) {
    return <div className="w-12 h-12" />;
  }

  const colorClass =
    seatTypeColors[seat.seatType] || "bg-gray-500 hover:bg-gray-600";

  const getSeatStatusClass = () => {
    if (seat.isTaken) {
      return "bg-red-500 cursor-not-allowed opacity-60";
    }
    if (isSelected) {
      return "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2";
    }
    return `${colorClass} cursor-pointer hover:scale-105 bg-green-100 border border-green-500 hover:bg-green-200 text-green-700`;
  };

  const seatPrice = basePrice * seat.seatValue;

  return (
    <Button
      variant="outline"
      size="sm"
      className={`w-12 h-12 p-0 font-semibold transition-all duration-200 transform ${getSeatStatusClass()}`}
      disabled={seat.isTaken}
      onClick={onClick}
      title={`Asiento ${seat.seatNumber} - ${seat.seatType} - $${seatPrice.toFixed(2)}`}
    >
      {seat.seatNumber}
    </Button>
  );
}