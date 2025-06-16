"use client";

import { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCities } from "@/features/cities/hooks/useQueries/useCities";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  MapPin,
  ArrowUpDown,
  Users,
  Search,
  Navigation,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import RHFSelect from "@/shared/components/RHFSelect";

interface RouteSearchData {
  origin: string;
  destination: string;
  date: Date | null;
  passengers: number;
}

export function SearchForm({
  onSearch,
}: {
  onSearch: (data: RouteSearchData) => void;
}) {
  const { data: citiesData } = useCities();
  const cities = citiesData?.data.records || [];
  const cityNames = cities.map((city) => city.name);
  const methods = useForm<RouteSearchData>({
    defaultValues: { origin: "", destination: "", date: null, passengers: 1 },
    mode: "onBlur",
  });
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = methods;
  const origin = watch("origin");
  const destination = watch("destination");
  const selectedDate = watch("date");

  const [showOrigin, setShowOrigin] = useState(false);
  const [showDestination, setShowDestination] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const filteredOrigin = cityNames.filter(
    (city) =>
      city.toLowerCase().includes(origin?.toLowerCase() || "") &&
      city.toLowerCase() !== (destination?.toLowerCase() || "")
  );

  const filteredDestination = cityNames.filter(
    (city) =>
      city.toLowerCase().includes(destination?.toLowerCase() || "") &&
      city.toLowerCase() !== (origin?.toLowerCase() || "")
  );

  function handleSwap() {
    setValue("origin", destination);
    setValue("destination", origin);
  }

  async function onSubmit(data: RouteSearchData) {
    if (!data.origin || !data.destination || !data.date) return;

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({
        origin: data.origin,
        destination: data.destination,
        date: data.date.toISOString(),
      });
      router.push(`/dashboard/horarios?${params.toString()}`);
    } catch (error) {
      console.error("Error al buscar rutas:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = origin && destination && selectedDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Buscar Viajes
          </h1>
          <p className="text-gray-600">
            Encuentra el mejor horario para tu destino
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-6">
                {/* Origen */}
                <div className="relative">
                  <Label
                    htmlFor="origin"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
                    Origen
                  </Label>
                  <div className="relative">
                    <Input
                      id="origin"
                      placeholder="¿Desde dónde viajas?"
                      value={origin}
                      onChange={(e) => setValue("origin", e.target.value)}
                      onFocus={() => setShowOrigin(true)}
                      onBlur={() => setTimeout(() => setShowOrigin(false), 200)}
                      className="pl-4 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    />

                    {showOrigin && origin && (
                      <div className="absolute z-30 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-auto">
                        {filteredOrigin.length > 0 ? (
                          filteredOrigin.map((city) => (
                            <div
                              key={city}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                              onMouseDown={() => {
                                setValue("origin", city);
                                setShowOrigin(false);
                              }}
                            >
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                                <span className="text-gray-900">{city}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No se encontraron ciudades
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón intercambiar */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSwap}
                    className="rounded-full w-12 h-12 p-0 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                    disabled={!origin && !destination}
                  >
                    <ArrowUpDown className="w-5 h-5 text-blue-600" />
                  </Button>
                </div>

                {/* Destino */}
                <div className="relative">
                  <Label
                    htmlFor="destination"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    <MapPin className="w-4 h-4 inline mr-2 text-red-600" />
                    Destino
                  </Label>
                  <div className="relative">
                    <Input
                      id="destination"
                      placeholder="¿A dónde quieres ir?"
                      value={destination}
                      onChange={(e) => setValue("destination", e.target.value)}
                      onFocus={() => setShowDestination(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDestination(false), 200)
                      }
                      className="pl-4 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    />

                    {showDestination && destination && (
                      <div className="absolute z-30 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-auto">
                        {filteredDestination.length > 0 ? (
                          filteredDestination.map((city) => (
                            <div
                              key={city}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                              onMouseDown={() => {
                                setValue("destination", city);
                                setShowDestination(false);
                              }}
                            >
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                                <span className="text-gray-900">{city}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No se encontraron ciudades
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fecha y Pasajeros en fila */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fecha */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                      <CalendarIcon className="w-4 h-4 inline mr-2 text-blue-600" />
                      Fecha
                    </Label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal py-3 px-4 border-2 border-gray-200 hover:border-blue-400 rounded-xl",
                                !field.value && "text-gray-500"
                              )}
                              type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccionar</span>
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

                  {/* Pasajeros */}
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
              </CardContent>
            </Card>

            {/* Botón buscar */}
            <div className="flex justify-center">
              <Button type="submit" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    Buscar Rutas Disponibles
                  </div>
                )}
              </Button>
            </div>

            {/* Mensaje de ayuda */}
            <div className="text-center text-sm text-gray-600 bg-white/50 rounded-lg p-3">
              💡 Completa todos los campos para buscar las mejores rutas
              disponibles
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
