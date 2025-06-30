import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckoutApi } from "../api/checkout-api";
import {
  OnlineSaleRequest,
  PayPalOrderResponse,
  TransferSaleResponse,
  ValidatePaymentRequest,
} from "../types/checkout.interface";
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import { CHECKOUT_QUERY_KEYS } from "../consts/checkout-query-keys";
import {
  isPaymentAlreadyValidatedError,
  isValidationSuccessful,
  extractErrorInfo,
} from "../utils/payment-validation.utils";

export function useProcessOnlineSale() {
  const checkoutApi = CheckoutApi.getInstance();

  return useMutation({
    mutationFn: async (data: OnlineSaleRequest) => {
      return await checkoutApi.processOnlineSale(data);
    },
    onSuccess: (data, variables) => {
      if (variables.paymentMethod === PaymentMethod.PAYPAL) {
        const paypalData = data as PayPalOrderResponse;
        if (paypalData.approvalUrl) {
          window.open(paypalData.approvalUrl, "_blank");
        }
      }
    },
  });
}

export function useValidatePayment() {
  const checkoutApi = CheckoutApi.getInstance();

  return useMutation({
    mutationFn: async ({
      paymentId,
      data,
    }: {
      paymentId: number;
      data?: ValidatePaymentRequest;
    }) => {
      console.log("🚨 useValidatePayment mutation called with:", {
        paymentId,
        data,
      });
      return await checkoutApi.validatePayment(paymentId, data);
    },
  });
}

export function useValidatePaymentPeriodically(
  paymentId: number,
  paypalOrderId?: string,
  enabled: boolean = true
) {
  const checkoutApi = CheckoutApi.getInstance();

  return useQuery({
    queryKey: CHECKOUT_QUERY_KEYS.validatePayment(paymentId),
    queryFn: async () => {
      try {
        console.log("🔄 useValidatePaymentPeriodically called with:", {
          paymentId,
          paypalOrderId,
          enabled,
        });

        // Para PayPal, enviar el paypalOrderId
        const validationData = paypalOrderId ? { paypalOrderId } : undefined;
        const result = await checkoutApi.validatePayment(
          paymentId,
          validationData
        );

        // Log para debugging
        console.log("✅ Validation result:", result);

        return result;
      } catch (error) {
        const errorInfo = extractErrorInfo(error);
        console.log("❌ Validation error:", errorInfo);

        // Si el error indica que el pago ya fue validado,
        // tratarlo como éxito para detener el polling
        if (errorInfo.isAlreadyValidated) {
          console.log("🔄 Payment already validated - treating as success");
          return { message: "Payment already validated" };
        }

        // Para otros errores, propagar la excepción
        throw error;
      }
    },
    enabled, // El polling se controla completamente por este parámetro
    refetchInterval: enabled ? 3000 : false, // Solo hacer polling si está habilitado
    refetchIntervalInBackground: false, // Deshabilitamos background refetch
    retry: (failureCount, error) => {
      // Si no está habilitado, no reintentar
      if (!enabled) {
        console.log("🛑 Query disabled - stopping retries");
        return false;
      }

      // Si el error indica que el pago ya fue validado, no reintentar
      if (isPaymentAlreadyValidatedError(error)) {
        console.log("🛑 Payment already validated - stopping retries");
        return false;
      }

      // Reintentar hasta 5 veces para otros errores
      return failureCount < 5;
    },
    retryDelay: 3000,
  });
}
