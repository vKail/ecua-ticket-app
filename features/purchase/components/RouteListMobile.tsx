import { RouteCardMobile } from "./RouteCardMobile";

export interface RouteOption {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  busType: string;
  busCompany: string;
  busCompanyLogo?: string;
  passengers: number;
}

interface RouteListMobileProps {
  routes: RouteOption[];
  onSelectRoute: (route: RouteOption) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function RouteListMobile({
  routes,
  onSelectRoute,
  isLoading,
  isError,
}: RouteListMobileProps) {
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <span className="animate-spin h-8 w-8 mb-4 border-4 border-primary border-t-transparent rounded-full inline-block" />
        <p>Buscando rutas disponibles...</p>
      </div>
    );
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-red-500">
        <p className="mb-4">Error al cargar las rutas</p>
        <button
          className="text-primary underline"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  if (!routes.length)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <p className="text-lg font-medium">
          No se encontraron rutas disponibles
        </p>
        <p className="text-gray-400">Intenta con diferentes filtros o fechas</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 pb-24">
      {routes.map((route) => (
        <RouteCardMobile
          key={route.id}
          route={route}
          onSelect={onSelectRoute}
        />
      ))}
    </div>
  );
}
