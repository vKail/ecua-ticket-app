import { ArrowLeft, Edit, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PerfilPage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" size="sm" className="text-gray-600">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Regresar
        </Button>

        <h1 className="font-semibold text-gray-800">Mi Perfil</h1>

        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-3">
            <span className="text-gray-600 font-medium text-xl">JD</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Jhon Doe</h2>
          <p className="text-gray-600">jhon.doe@email.com</p>
        </div>

        {/* Menu Options */}
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            <div className="space-y-0">
              <Button
                variant="ghost"
                className="w-full justify-start h-14 px-4"
              >
                <Settings className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-gray-700">Configuración</span>
              </Button>

              <Separator />

              <Button
                variant="ghost"
                className="w-full justify-start h-14 px-4"
              >
                <HelpCircle className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-gray-700">Ayuda y Soporte</span>
              </Button>

              <Separator />

              <Button
                variant="ghost"
                className="w-full justify-start h-14 px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
