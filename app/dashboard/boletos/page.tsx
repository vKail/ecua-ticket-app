import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BoletosPage() {
  const boletos = [
    {
      id: 1,
      origen: "Quito",
      destino: "Guayaquil",
      fecha: "15 Dic 2024",
      hora: "14:30",
      asiento: "A12",
      estado: "Confirmado",
    },
    {
      id: 2,
      origen: "Ambato",
      destino: "Quito",
      fecha: "20 Dic 2024",
      hora: "09:15",
      asiento: "B08",
      estado: "Pendiente",
    },
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" size="sm" className="text-gray-600">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Regresar
        </Button>

        <h1 className="font-semibold text-gray-800">Mis Boletos</h1>

        <div className="w-8"></div>
      </div>

      {/* Boletos List */}
      <div className="p-4 space-y-4">
        {boletos.map((boleto) => (
          <Card key={boleto.id} className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-blue-900">
                  {boleto.origen} → {boleto.destino}
                </CardTitle>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    boleto.estado === "Confirmado"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {boleto.estado}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{boleto.fecha}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{boleto.hora}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Asiento {boleto.asiento}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
