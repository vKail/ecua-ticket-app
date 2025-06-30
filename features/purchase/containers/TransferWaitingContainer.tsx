"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatusCard } from "@/shared/components/PaymentStatusBadge";
import { PaymentStatus } from "@/core/enums/PaymentStatus.enum";

export function TransferWaitingContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentId, setPaymentId] = useState<number | null>(null);

  useEffect(() => {
    const id = searchParams.get("paymentId");

    if (id) {
      setPaymentId(parseInt(id));
    } else {
      router.push("/dashboard/purchase");
    }
  }, [searchParams, router]);

  const handleViewHistory = () => {
    router.push("/dashboard/purchase-history");
  };

  const handleBackToPurchase = () => {
    router.push("/dashboard/purchase");
  };

  if (!paymentId) {
    return (
      <div className="min-h-screen bg-white px-4 pt-8 pb-24 flex items-center justify-center">
        <p className="text-gray-500">Cargando información del pago...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-8 pb-24 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-xl">
              Reserva Creada Exitosamente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-complementary-gray mb-2">ID de Pago</p>
              <p className="font-mono font-medium">#{paymentId}</p>
            </div>

            {/* Estado del pago */}
            <PaymentStatusCard status={PaymentStatus.PENDING} />

            <div className="text-left space-y-3">
              <h4 className="font-medium">Instrucciones para el Pago:</h4>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
                <h5 className="font-medium text-blue-900 mb-2">
                  📋 Pasos a seguir:
                </h5>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </span>
                    <span>
                      Realiza la transferencia bancaria por el monto total
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </span>
                    <span>Guarda el comprobante de transferencia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </span>
                    <span>Envía el comprobante por WhatsApp o email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                      4
                    </span>
                    <span>Espera la confirmación (máximo 24 horas)</span>
                  </li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-yellow-900 mb-2">
                  ⏰ Importante:
                </h5>
                <p className="text-sm text-yellow-800">
                  Tu reserva se mantendrá activa por <strong>24 horas</strong>.
                  Una vez confirmado el pago, recibirás tus boletos por email.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">
                  💳 Información Bancaria:
                </h5>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Banco:</strong> Banco Ejemplo
                  </p>
                  <p>
                    <strong>Cuenta:</strong> 1234-5678-9012-3456
                  </p>
                  <p>
                    <strong>Titular:</strong> EcuaTicket S.A.
                  </p>
                  <p>
                    <strong>Monto:</strong> $XX.XX
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleViewHistory}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Ver Historial de Compras
              </Button>

              <Button
                onClick={handleBackToPurchase}
                variant="outline"
                className="w-full"
              >
                Realizar Nueva Compra
              </Button>
            </div>

            <p className="text-xs text-center text-complementary-gray">
              Puedes revisar el estado de tu pago en el historial de compras
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
