import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RouteOption {
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
}

interface RouteCardMobileProps {
  route: RouteOption;
  onSelect: (route: RouteOption) => void;
}

export function RouteCardMobile({ route, onSelect }: RouteCardMobileProps) {
  const router = useRouter();
  const busTypeColors: Record<string, string> = {
    Estándar: "bg-blue-100 text-blue-800",
    Ejecutivo: "bg-purple-100 text-purple-800",
    VIP: "bg-amber-100 text-amber-800",
  };

  const handleSelect = () => {
    // Codificar los datos de la ruta para pasarlos como parámetro de URL
    const routeData = encodeURIComponent(JSON.stringify(route));
    router.push(`/dashboard/purchase/seats?route=${routeData}`);
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md">
          {route.busCompanyLogo ? (
            <img
              src={route.busCompanyLogo}
              alt={route.busCompany}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="font-bold text-lg">
              {route.busCompany.substring(0, 2)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-base">{route.busCompany}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                busTypeColors[route.busType] || "bg-gray-200 text-gray-700"
              }`}
            >
              {route.busType}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {route.origin} → {route.destination}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col items-start">
          <span className="font-semibold text-lg">{route.departureTime}</span>
          <span className="text-xs text-gray-400">Salida</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">{route.duration}</span>
          <span className="w-10 h-0.5 bg-gray-200 my-1" />
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold text-lg">{route.arrivalTime}</span>
          <span className="text-xs text-gray-400">Llegada</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {route.availableSeats} asientos disponibles
        </span>
        <span className="text-primary font-bold text-lg">
          ${route.price.toFixed(2)}
        </span>
      </div>
      <Button className="w-full mt-2" size="lg" onClick={handleSelect}>
        Seleccionar
      </Button>
    </div>
  );
}
