import React from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  useCreatePayPalOrder,
  useCapturePayPalOrder,
} from "../hooks/usePayPal";
import { OnlineSaleRequest } from "../types/checkout.interface";
import { ca } from "zod/v4/locales";

interface PayPalCheckoutProps {
  saleRequest: OnlineSaleRequest;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}

export function PayPalCheckout({
  saleRequest,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const [{ isPending, isResolved }] = usePayPalScriptReducer();
  const createOrderMutation = useCreatePayPalOrder();
  const captureOrderMutation = useCapturePayPalOrder();

  const createOrder = async (): Promise<string> => {
    try {
      const result = await createOrderMutation.mutateAsync(saleRequest);
      return result.paypalOrderId;
    } catch (error) {
      onError(error);
      throw error;
    }
  };

  const onApprove = async (data: any): Promise<void> => {
    try {
      const captureResult = await captureOrderMutation.mutateAsync({
        paymentId: createOrderMutation.data?.paymentId || 0,
        paypalOrderId: data.orderID,
      });

      console.log("Capture result:", captureResult);
      console.log("Payment ID:", createOrderMutation.data?.paymentId);
      console.log("Order Success:", captureResult.message);

      if (captureResult) {
        onSuccess({
          ...captureResult,
          paymentId: createOrderMutation.data?.paymentId,
        });
      }
    } catch (error) {
      onError(error);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Cargando PayPal...</span>
      </div>
    );
  }

  if (!isResolved) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-sm text-red-600">
            Error al cargar PayPal. Verifica tu configuración.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 45,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={() => {
          onError(new Error("Payment cancelled by user"));
        }}
      />
    </div>
  );
}
