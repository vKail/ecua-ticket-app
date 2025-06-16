"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvailableSeats } from "../hooks/useQueries/useAvailableSeats";

export interface RouteOption {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  busType: "Estándar" | "Ejecutivo" | "VIP";
  busCompany: string;
  busCompanyLogo?: string;
}

interface RouteListProps {
  routes: RouteOption[];
  onSelectRoute: (route: RouteOption) => void;
  className?: string;
}

export function RouteList({
  routes,
  onSelectRoute,
  className,
}: RouteListProps) {
  const [sortBy, setSortBy] = useState<string>("departure");
  const [filterBusType, setFilterBusType] = useState<string>("all");

  const sortedRoutes = [...routes].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "duration":
        return a.duration.localeCompare(b.duration);
      case "departure":
      default:
        return a.departureTime.localeCompare(b.departureTime);
    }
  });

  const filteredRoutes =
    filterBusType === "all"
      ? sortedRoutes
      : sortedRoutes.filter((route) => route.busType === filterBusType);

  const busTypes = [
    "all",
    ...Array.from(new Set(routes.map((route) => route.busType))),
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs
          defaultValue="all"
          value={filterBusType}
          onValueChange={setFilterBusType}
        >
          <TabsList>
            {busTypes.map((type) => (
              <TabsTrigger key={type} value={type}>
                {type === "all" ? "Todos" : type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="departure">Hora de salida</SelectItem>
              <SelectItem value="duration">Duración</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredRoutes.length > 0 ? (
        <div className="space-y-4">
          {filteredRoutes.map((route) => {
            console.log(route);
            return (
              <RouteCard
                key={route.id}
                route={route}
                onSelect={onSelectRoute}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-lg font-medium">
              No se encontraron rutas disponibles
            </p>
            <p className="text-muted-foreground">
              Intenta con diferentes filtros o fechas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RouteCard({
  route,
  onSelect,
}: {
  route: RouteOption;
  onSelect: (route: RouteOption) => void;
}) {
  const busTypeColors = {
    Estándar: "bg-blue-100 text-blue-800",
    Ejecutivo: "bg-purple-100 text-purple-800",
    VIP: "bg-amber-100 text-amber-800",
  };

  // Hook para obtener asientos disponibles
  const {
    data: availableSeats,
    isLoading,
    isError,
  } = useAvailableSeats(Number(route.id));

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-md">
              {route.busCompanyLogo ? (
                <img
                  src={route.busCompanyLogo || "/placeholder.svg"}
                  alt={route.busCompany}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="font-bold text-lg">
                  {route.busCompany.substring(0, 2)}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{route.busCompany}</h3>
                <Badge className={cn(busTypeColors[route.busType])}>
                  {route.busType}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center">
                <div>
                  <div className="font-semibold">{route.departureTime}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {route.origin}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground">
                    {route.duration}
                  </div>
                  <div className="w-16 h-px bg-border my-1"></div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>

                <div>
                  <div className="font-semibold">{route.arrivalTime}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {route.destination}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{route.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {isLoading && "Cargando asientos..."}
                    {isError && "Error al cargar asientos"}
                    {!isLoading &&
                      !isError &&
                      availableSeats &&
                      `${availableSeats.data.length} asientos disponibles`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center justify-between bg-muted/30 p-4 border-t md:border-t-0 md:border-l">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4" />
              <span className="text-xl font-bold">
                {route.price.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={() => onSelect(route)}
              className="whitespace-nowrap"
            >
              Seleccionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
