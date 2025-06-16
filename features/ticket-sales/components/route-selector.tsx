"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, MapPin, RotateCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCities } from "@/features/cities/hooks/useQueries/useCities";

interface RouteSelectorProps {
  onSearch: (routeData: RouteSearchData) => void;
  className?: string;
}

export interface RouteSearchData {
  origin: string;
  destination: string;
  date: Date | null;
  passengers: number;
}

export function RouteSelector({ onSearch, className }: RouteSelectorProps) {
  const { data: citiesData } = useCities();
  const cities = citiesData?.data.records || [];

  const [routeData, setRouteData] = useState<RouteSearchData>({
    origin: "",
    destination: "",
    date: new Date(),
    passengers: 1,
  });

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  const handleInputChange = (field: keyof RouteSearchData, value: any) => {
    setRouteData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSwapLocations = () => {
    setRouteData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const handleSearch = () => {
    onSearch(routeData);
  };

  // Get city names for autocomplete
  const cityNames = cities.map((city) => city.name);

  const filteredOriginCities = cityNames.filter(
    (city: string) =>
      city.toLowerCase().includes(routeData.origin.toLowerCase()) &&
      city.toLowerCase() !== routeData.destination.toLowerCase()
  );

  const filteredDestinationCities = cityNames.filter(
    (city: string) =>
      city.toLowerCase().includes(routeData.destination.toLowerCase()) &&
      city.toLowerCase() !== routeData.origin.toLowerCase()
  );

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="origin">Origen</Label>
              <Input
                id="origin"
                placeholder="Ciudad de origen"
                value={routeData.origin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleInputChange("origin", e.target.value);
                  setShowOriginSuggestions(true);
                }}
                onFocus={() => setShowOriginSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowOriginSuggestions(false), 200)
                }
              />
              {showOriginSuggestions && routeData.origin && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
                  {filteredOriginCities.length > 0 ? (
                    filteredOriginCities.map((city) => (
                      <div
                        key={city}
                        className="px-4 py-2 hover:bg-muted cursor-pointer"
                        onMouseDown={() => handleInputChange("origin", city)}
                      >
                        {city}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-muted-foreground">
                      No se encontraron ciudades
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    placeholder="Ciudad de destino"
                    value={routeData.destination}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange("destination", e.target.value);
                      setShowDestinationSuggestions(true);
                    }}
                    onFocus={() => setShowDestinationSuggestions(true)}
                    onBlur={() =>
                      setTimeout(
                        () => setShowDestinationSuggestions(false),
                        200
                      )
                    }
                  />
                  {showDestinationSuggestions && routeData.destination && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
                      {filteredDestinationCities.length > 0 ? (
                        filteredDestinationCities.map((city) => (
                          <div
                            key={city}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onMouseDown={() =>
                              handleInputChange("destination", city)
                            }
                          >
                            {city}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground">
                          No se encontraron ciudades
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="mb-0.5"
                  onClick={handleSwapLocations}
                  title="Intercambiar origen y destino"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Fecha de viaje</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {routeData.date ? (
                      format(routeData.date, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={routeData.date || undefined}
                    onSelect={(date: Date | undefined) =>
                      handleInputChange("date", date)
                    }
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="passengers">Pasajeros</Label>
              <Select
                value={routeData.passengers.toString()}
                onValueChange={(value) =>
                  handleInputChange("passengers", Number.parseInt(value))
                }
              >
                <SelectTrigger id="passengers">
                  <SelectValue placeholder="Seleccionar número de pasajeros" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "pasajero" : "pasajeros"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full mt-2"
            size="lg"
            onClick={handleSearch}
            disabled={
              !routeData.origin || !routeData.destination || !routeData.date
            }
          >
            Buscar rutas disponibles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
