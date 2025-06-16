"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useValidatePaymentPeriodically } from "../hooks/useCheckout";

export function PaymentWaitingContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [hasStartedValidation, setHasStartedValidation] = useState(false);
  const [isPaymentValidated, setIsPaymentValidated] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);

  // Usar ref para evitar múltiples redirecciones
  const hasRedirected = useRef(false);

  useEffect(() => {
    const id = searchParams.get("paymentId");
    const orderId = searchParams.get("paypalOrderId");

    if (id) {
      setPaymentId(parseInt(id));
      setPaypalOrderId(orderId);
      setHasStartedValidation(true);
      setShouldPoll(true); // Iniciar polling
    } else {
      router.push("/dashboard/purchase");
    }
  }, [searchParams, router]);

  // Hook de validación periódica - se controla con shouldPoll
  const {
    data: validationResult,
    error,
    isLoading,
    refetch,
  } = useValidatePaymentPeriodically(
    paymentId || 0,
    paypalOrderId || undefined,
    hasStartedValidation &&
      paymentId !== null &&
      shouldPoll &&
      !isPaymentValidated
  );

  // Efecto para manejar la respuesta de validación
  useEffect(() => {
    if (
      validationResult?.success &&
      paymentId &&
      !isPaymentValidated &&
      !hasRedirected.current
    ) {
      console.log("✅ Payment validated successfully:", validationResult);

      // Detener polling inmediatamente
      setShouldPoll(false);
      setIsPaymentValidated(true);

      // Marcar como redirigido para evitar múltiples redirecciones
      hasRedirected.current = true;

      // Redirigir después de un breve delay para mostrar el estado de éxito
      setTimeout(() => {
        router.push(`/dashboard/purchase/success?paymentId=${paymentId}`);
      }, 1500);
    }
  }, [validationResult, paymentId, router, isPaymentValidated]);

  // Efecto para manejar errores que indican pago ya validado
  useEffect(() => {
    if (error && !isPaymentValidated && !hasRedirected.current) {
      const errorMessage =
        (error as any)?.response?.data?.message?.content?.[0] || "";

      // Si el error indica que ya fue validado (mensaje específico de PayPal)
      if (
        errorMessage
          .toLowerCase()
          .includes("error al verificar el pago de paypal")
      ) {
        console.log(
          "🔄 Detected PayPal validation error - likely already validated"
        );

        // Detener polling
        setShouldPoll(false);
        setIsPaymentValidated(true);
        hasRedirected.current = true;

        // Redirigir asumiendo que el pago ya fue validado
        setTimeout(() => {
          router.push(`/dashboard/purchase/success?paymentId=${paymentId}`);
        }, 2000);
      }
    }
  }, [error, paymentId, router, isPaymentValidated]);

  const handleManualValidation = () => {
    if (paymentId && !isPaymentValidated && shouldPoll) {
      console.log("🔄 Manual validation triggered");
      refetch();
    }
  };

  const handleCancel = () => {
    if (!isPaymentValidated) {
      // Detener polling antes de salir
      setShouldPoll(false);
      router.push("/dashboard/purchase");
    }
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
            <div className="mx-auto w-16 h-16 bg-complementary-yellow rounded-full flex items-center justify-center mb-4">
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
            <CardTitle className="text-xl">
              Esperando Confirmación de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-complementary-gray mb-2">ID de Pago</p>
              <p className="font-mono font-medium">#{paymentId}</p>
              {paypalOrderId && (
                <>
                  <p className="text-sm text-complementary-gray mb-1 mt-2">
                    PayPal Order ID
                  </p>
                  <p className="font-mono text-sm">{paypalOrderId}</p>
                </>
              )}
            </div>

            <div className="text-left space-y-2">
              <h4 className="font-medium">Estado del Proceso:</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-complementary-green rounded-full"></div>
                <span className="text-sm">Orden PayPal creada</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPaymentValidated
                      ? "bg-complementary-green"
                      : "bg-complementary-yellow animate-pulse"
                  }`}
                ></div>
                <span className="text-sm">
                  {isPaymentValidated
                    ? "Pago confirmado ✅"
                    : "Esperando confirmación de pago..."}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPaymentValidated
                      ? "bg-complementary-green"
                      : "bg-gray-300"
                  }`}
                ></div>
                <span
                  className={`text-sm ${
                    isPaymentValidated ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  Verificación completada
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Instrucciones:</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {isPaymentValidated
                  ? "¡Pago confirmado! Serás redirigido en un momento..."
                  : "Completa tu pago en la ventana de PayPal que se abrió. Una vez confirmado, serás redirigido automáticamente."}
              </p>
            </div>

            {error && !isPaymentValidated && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  ⚠️ El pago aún no ha sido confirmado. Seguimos verificando...
                </p>
                {/* Debug info - mostrar solo en desarrollo */}
                {process.env.NODE_ENV === "development" && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-600 cursor-pointer">
                      Debug Info
                    </summary>
                    <pre className="text-xs mt-1 p-2 bg-red-100 rounded">
                      {JSON.stringify(
                        {
                          shouldPoll,
                          isPaymentValidated,
                          errorMessage:
                            (error as any)?.response?.data?.message
                              ?.content?.[0] || "No message",
                          timestamp: new Date().toISOString(),
                        },
                        null,
                        2
                      )}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {isPaymentValidated && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  ✅ ¡Pago confirmado exitosamente! Redirigiendo...
                </p>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleManualValidation}
                disabled={isLoading || isPaymentValidated}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                {isPaymentValidated
                  ? "Pago Confirmado ✅"
                  : isLoading
                  ? "Verificando..."
                  : "Verificar Ahora"}
              </Button>

              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full"
                disabled={isPaymentValidated}
              >
                {isPaymentValidated ? "Redirigiendo..." : "Cancelar y Volver"}
              </Button>
            </div>

            <p className="text-xs text-center text-complementary-gray">
              {isPaymentValidated
                ? "Pago validado exitosamente"
                : shouldPoll
                ? "La validación se realiza automáticamente cada 3 segundos"
                : "Validación detenida"}
            </p>

            {/* Debug info - mostrar solo en desarrollo */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer text-center">
                  Estado interno (desarrollo)
                </summary>
                <div className="text-xs mt-2 p-2 bg-gray-50 rounded">
                  <div>shouldPoll: {shouldPoll.toString()}</div>
                  <div>isPaymentValidated: {isPaymentValidated.toString()}</div>
                  <div>hasRedirected: {hasRedirected.current.toString()}</div>
                  <div>isLoading: {isLoading.toString()}</div>
                  <div>
                    validationResult: {validationResult ? "true" : "false"}
                  </div>
                  <div>error: {error ? "true" : "false"}</div>
                </div>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
