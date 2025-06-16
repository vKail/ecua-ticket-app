"use client";

import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import RHFInput from "@/shared/components/RHFInput";
import RHFSelect from "@/shared/components/RHFSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RotateCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCities } from "@/features/cities/hooks/useQueries/useCities";
import RHFInputWithEvents from "@/shared/components/RHFInputWithEvents";

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
  const cityNames = cities.map((city) => city.name);
  const methods = useForm<RouteSearchData>({
    defaultValues: { origin: "", destination: "", date: null, passengers: 1 },
    mode: "onBlur",
  });
  const { handleSubmit, setValue, watch, control } = methods;
  const origin = watch("origin");
  const destination = watch("destination");
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const filteredOriginCities = cityNames.filter(
    (city: string) =>
      city.toLowerCase().includes(origin?.toLowerCase() || "") &&
      city.toLowerCase() !== (destination?.toLowerCase() || "")
  );
  const filteredDestinationCities = cityNames.filter(
    (city: string) =>
      city.toLowerCase().includes(destination?.toLowerCase() || "") &&
      city.toLowerCase() !== (origin?.toLowerCase() || "")
  );
  function handleSwapLocations() {
    setValue("origin", destination);
    setValue("destination", origin);
  }
  function submitForm(data: RouteSearchData) {
    onSearch(data);
  }
  return (
    <FormProvider {...methods}>
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <RHFInputWithEvents
                    name="origin"
                    label="Origen"
                    placeholder="Ciudad de origen"
                    onFocus={() => setShowOriginSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowOriginSuggestions(false), 200)
                    }
                  />
                  {showOriginSuggestions && origin && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
                      {filteredOriginCities.length > 0 ? (
                        filteredOriginCities.map((city) => (
                          <div
                            key={city}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onMouseDown={() => setValue("origin", city)}
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
                      <RHFInputWithEvents
                        name="destination"
                        label="Destino"
                        placeholder="Ciudad de destino"
                        onFocus={() => setShowDestinationSuggestions(true)}
                        onBlur={() =>
                          setTimeout(
                            () => setShowDestinationSuggestions(false),
                            200
                          )
                        }
                      />
                      {showDestinationSuggestions && destination && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
                          {filteredDestinationCities.length > 0 ? (
                            filteredDestinationCities.map((city) => (
                              <div
                                key={city}
                                className="px-4 py-2 hover:bg-muted cursor-pointer"
                                onMouseDown={() =>
                                  setValue("destination", city)
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
                      type="button"
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
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            type="button"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                <div>
                  <RHFSelect
                    name="passengers"
                    label="Pasajeros"
                    options={Array.from({ length: 8 }, (_, i) => ({
                      value: (i + 1).toString(),
                      label: `${i + 1} ${i === 0 ? "pasajero" : "pasajeros"}`,
                    }))}
                  />
                </div>
              </div>
              <Button className="w-full mt-2" size="lg" type="submit">
                Buscar rutas disponibles
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
