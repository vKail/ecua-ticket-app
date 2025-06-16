"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RouteListMobile, RouteOption } from "../components/RouteListMobile";
import { useRouteSearch } from "../hooks/useQueries/useRouteSearch";
import { useAvailableSeats } from "../hooks/useQueries/useAvailableSeats";
import { useCities } from "@/features/cities/hooks/useQueries/useCities";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchForm } from "../components/SearchForm";

export function PurchaseRoutesContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: citiesData, isLoading: loadingCities } = useCities();
  const cities = citiesData?.data.records || [];

  const originParam = searchParams.get("origin") || "";
  const destinationParam = searchParams.get("destination") || "";
  const dateParam = searchParams.get("date") || "";
  const passengersParam = searchParams.get("passengers") || "1";

  const originCity = useMemo(
    () =>
      cities.find(
        (c: any) => c.name.toLowerCase() === originParam.toLowerCase()
      ),
    [cities, originParam]
  );
  const destinationCity = useMemo(
    () =>
      cities.find(
        (c: any) => c.name.toLowerCase() === destinationParam.toLowerCase()
      ),
    [cities, destinationParam]
  );

  // Validar datos de búsqueda
  const isValidSearch =
    !!originCity &&
    !!destinationCity &&
    !!dateParam &&
    !isNaN(Date.parse(dateParam)) &&
    !!passengersParam &&
    !loadingCities;

  // Fetch de rutas
  const {
    data: routesData,
    isLoading: routesLoading,
    isError: routesError,
  } = useRouteSearch(
    isValidSearch
      ? {
          originId: originCity.id,
          destinationId: destinationCity.id,
          date: new Date(dateParam).toISOString(),
        }
      : undefined
  );

  const [seatsMap, setSeatsMap] = useState<Record<string, number>>({});

  function transformRouteSheetToOption(route: any): RouteOption {
    return {
      id: String(route.id),
      origin: route.frequency.origin.name,
      destination: route.frequency.destination.name,
      departureTime: route.frequency.time,
      arrivalTime: "", // Si tienes el dato, colócalo aquí
      duration: "", // Si tienes el dato, colócalo aquí
      price: route.frequency.segmentPrices[0]?.price ?? 0,
      availableSeats: seatsMap[route.id] ?? 0,
      busType: route.bus.bodyBrand || "Estándar",
      busCompany: route.frequency.company.name,
      busCompanyLogo: route.frequency.company.logoUrl || undefined,
    };
  }

  const routes =
    routesData?.success && routesData.data
      ? routesData.data.map(transformRouteSheetToOption)
      : [];

  // Handler para volver a buscar
  function handleBackToSearch() {
    router.push("/dashboard/horarios");
  }

  // Handler para búsqueda desde el formulario
  function handleSearchForm(data: any) {
    const params = new URLSearchParams({
      origin: data.origin,
      destination: data.destination,
      date: data.date.toISOString(),
      passengers: data.passengers.toString(),
    });
    router.push(`/dashboard/horarios?${params.toString()}`);
  }

  // Render principal
  const showForm = !originParam || !destinationParam || !dateParam;

  return (
    <div className="min-h-screen bg-white px-4 pt-4 pb-24">
      {/* Paso 1: Formulario de búsqueda */}
      {showForm && (
        <Card className="mb-4">
          <CardContent className="p-0">
            <SearchForm onSearch={handleSearchForm} />
          </CardContent>
        </Card>
      )}
      {/* Paso 2: Lista de rutas */}
      {!showForm && (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-1">
              Rutas disponibles: {originParam} a {destinationParam}
            </h2>
            <p className="text-gray-500 text-sm">
              {dateParam ? new Date(dateParam).toLocaleDateString() : ""} ·{" "}
              {passengersParam} pasajero
              {passengersParam !== "1" ? "s" : ""}
            </p>
            <Button
              className="mt-2 text-primary underline text-sm"
              variant="link"
              onClick={handleBackToSearch}
            >
              Volver a buscar
            </Button>
          </div>
          <RouteListMobile
            routes={routes}
            onSelectRoute={() => {}}
            isLoading={routesLoading || loadingCities}
            isError={routesError}
          />
        </>
      )}
    </div>
  );
}
