import { ArrowLeft, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PurchaseSearchContainer } from "@/features/purchase/containers/PurchaseSearchContainer";

export default function DashboardPage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" size="sm" className="text-gray-600">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Regresar
        </Button>

        <Button variant="ghost" size="sm">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">JD</span>
          </div>
          <span className="text-lg font-medium text-gray-800">
            Hola! Jhon Doe
          </span>
        </div>

        <div className="mb-2">
          <h1 className="text-xl font-semibold text-blue-900 mb-1">
            A donde quieres ir hoy?
          </h1>
          <p className="text-gray-600 mb-6">Vámonos de viaje</p>
        </div>
        <PurchaseSearchContainer />
      </div>
    </div>
  );
}
