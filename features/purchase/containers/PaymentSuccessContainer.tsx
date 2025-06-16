"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentSuccessContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("paymentId");
    setPaymentId(id);
  }, [searchParams]);

  const handleGoToHistory = () => {
    router.push("/dashboard/purchase-history");
  };

  const handleNewPurchase = () => {
    router.push("/dashboard/purchase");
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-8 pb-24 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-complementary-green rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-xl text-complementary-green">
              ¡Pago Exitoso!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-complementary-gray">
              Tu compra ha sido procesada exitosamente.
            </p>

            {paymentId && (
              <div className="bg-secondary/20 p-3 rounded-lg">
                <p className="text-sm text-complementary-gray">ID de Pago</p>
                <p className="font-mono font-medium">#{paymentId}</p>
              </div>
            )}

            <p className="text-sm text-complementary-gray">
              Recibirás un correo electrónico con los detalles de tu compra y
              los códigos de acceso a tus boletos.
            </p>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleGoToHistory}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Ver mis compras
              </Button>

              <Button
                onClick={handleNewPurchase}
                variant="outline"
                className="w-full"
              >
                Realizar nueva compra
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
