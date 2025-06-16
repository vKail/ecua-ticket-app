import { useState, useEffect, useRef, useCallback } from "react";
import { CheckoutApi } from "../api/checkout-api";
import {
  ValidatePaymentRequest,
  ValidatePaymentResponse,
} from "../types/checkout.interface";
import {
  isPaymentAlreadyValidatedError,
  extractErrorInfo,
} from "../utils/payment-validation.utils";

interface UsePollingValidationProps {
  paymentId: number;
  paypalOrderId?: string;
  enabled: boolean;
  interval?: number;
}

interface UsePollingValidationReturn {
  data: ValidatePaymentResponse | null;
  error: any;
  isLoading: boolean;
  stopPolling: () => void;
  startPolling: () => void;
  manualValidation: () => Promise<void>;
}

/**
 * Hook alternativo para validación de pagos con control manual completo del polling
 * Usa setInterval nativo para tener control total sobre cuándo parar
 */
export function usePollingValidation({
  paymentId,
  paypalOrderId,
  enabled,
  interval = 3000,
}: UsePollingValidationProps): UsePollingValidationReturn {
  const [data, setData] = useState<ValidatePaymentResponse | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkoutApi = CheckoutApi.getInstance();

  // Función para realizar la validación
  const validatePayment =
    useCallback(async (): Promise<ValidatePaymentResponse | null> => {
      if (!paymentId) return null;

      try {
        console.log("🔄 Manual polling validation - attempting validation:", {
          paymentId,
          paypalOrderId,
          timestamp: new Date().toISOString(),
        });

        setIsLoading(true);
        setError(null);

        const validationData: ValidatePaymentRequest | undefined = paypalOrderId
          ? { paypalOrderId }
          : undefined;

        const result = await checkoutApi.validatePayment(
          paymentId,
          validationData
        );

        console.log("✅ Manual polling validation - success:", result);
        setData(result);

        // Si es exitoso, detener polling automáticamente
        if (result.success) {
          console.log("🛑 Payment validated successfully - stopping polling");
          stopPolling();
        }

        return result;
      } catch (err) {
        const errorInfo = extractErrorInfo(err);
        console.log("❌ Manual polling validation - error:", errorInfo);

        // Si el error indica que ya fue validado, tratarlo como éxito
        if (errorInfo.isAlreadyValidated) {
          console.log(
            "🔄 Payment already validated - treating as success and stopping polling"
          );
          const successResult: ValidatePaymentResponse = {
            success: true,
            message: "Payment already validated",
          };
          setData(successResult);
          stopPolling();
          return successResult;
        }

        setError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [paymentId, paypalOrderId, checkoutApi]);

  // Función para detener el polling
  const stopPolling = useCallback(() => {
    console.log("🛑 Stopping manual polling");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Función para iniciar el polling
  const startPolling = useCallback(() => {
    if (!enabled || !paymentId || isPolling) return;

    console.log("▶️ Starting manual polling every", interval, "ms");
    setIsPolling(true);

    // Realizar primera validación inmediatamente
    validatePayment();

    // Configurar interval para validaciones siguientes
    intervalRef.current = setInterval(() => {
      validatePayment();
    }, interval);
  }, [enabled, paymentId, isPolling, interval, validatePayment]);

  // Función para validación manual
  const manualValidation = useCallback(async () => {
    console.log("🔄 Manual validation triggered");
    await validatePayment();
  }, [validatePayment]);

  // Efecto para controlar el inicio/parada del polling
  useEffect(() => {
    if (enabled && paymentId && !data?.success) {
      startPolling();
    } else {
      stopPolling();
    }

    // Cleanup al desmontar
    return () => {
      stopPolling();
    };
  }, [enabled, paymentId, data?.success, startPolling, stopPolling]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    stopPolling,
    startPolling,
    manualValidation,
  };
}
