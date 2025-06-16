"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketSalesService } from "../../api/ticket-sales.service";
import { toast } from "sonner";
import { TICKET_SALES_QUERY_KEYS } from "../../consts/query-keys";

interface ValidatePaymentParams {
  paymentId: number;
  paypalOrderId?: string;
}

export function useValidatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ValidatePaymentParams) =>
      ticketSalesService.validatePayment(
        params.paymentId,
        1,
        params.paypalOrderId
      ),
    onSuccess: () => {
      toast.success("Pago validado exitosamente");
      queryClient.invalidateQueries({
        queryKey: TICKET_SALES_QUERY_KEYS.all,
      });
    },
    onError: (error: any) => {
      toast.error("Error al validar el pago");
    },
  });
}
