"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useValidatePayment } from "../hooks/useCheckout";

export function PaymentValidationContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validatePaymentMutation = useValidatePayment();

  useEffect(() => {
    const validatePayment = async () => {
      const paymentId = searchParams.get("paymentId");
      const paypalOrderId = searchParams.get("token"); // PayPal token from redirect

      if (!paymentId) {
        setError("ID de pago no encontrado");
        setIsValidating(false);
        return;
      }

      try {
        await validatePaymentMutation.mutateAsync({
          paymentId: parseInt(paymentId),
          data: paypalOrderId ? { paypalOrderId } : undefined,
        });

        // Redirect to success page
        router.push(`/dashboard/purchase/success?paymentId=${paymentId}`);
      } catch (error) {
        console.error("Error validating payment:", error);
        setError("Error al validar el pago");
        setIsValidating(false);
      }
    };

    validatePayment();
  }, [searchParams, router, validatePaymentMutation]);

  const handleRetry = () => {
    setIsValidating(true);
    setError(null);
    window.location.reload();
  };

  const handleGoBack = () => {
    router.push("/dashboard/purchase");
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-white px-4 pt-8 pb-24 flex items-center justify-center">
        <Card className="text-center max-w-md w-full">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 animate-pulse">
              <svg
                className="w-8 h-8 text-white animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <CardTitle className="text-xl">Validando Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-complementary-gray mb-4">
              Estamos validando tu pago. Por favor espera...
            </p>
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-2 h-2 bg-primary rounded-full animation-delay-75"></div>
                <div className="w-2 h-2 bg-primary rounded-full animation-delay-150"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 pt-8 pb-24 flex items-center justify-center">
        <Card className="text-center max-w-md w-full">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-complementary-red rounded-full flex items-center justify-center mb-4">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <CardTitle className="text-xl text-complementary-red">
              Error en la Validación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-complementary-gray">{error}</p>

            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Reintentar
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
