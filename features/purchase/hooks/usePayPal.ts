import { useMutation } from "@tanstack/react-query";
import { PayPalApi } from "../api/paypal-api";
import { OnlineSaleRequest } from "../types/checkout.interface";

export function useCreatePayPalOrder() {
  const paypalApi = PayPalApi.getInstance();

  return useMutation({
    mutationFn: async (data: OnlineSaleRequest) => {
      return await paypalApi.createOrder(data);
    },
  });
}

export function useCapturePayPalOrder() {
  const paypalApi = PayPalApi.getInstance();

  return useMutation({
    mutationFn: async ({
      paymentId,
      paypalOrderId,
    }: {
      paymentId: number;
      paypalOrderId: string;
    }) => {
      return await paypalApi.captureOrder(paymentId, paypalOrderId);
    },
  });
}
