"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketSalesService } from "../../api/ticket-sales.service";
import { toast } from "sonner";
import { TICKET_SALES_QUERY_KEYS } from "../../consts/query-keys";

export function useRejectPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number) =>
      ticketSalesService.rejectPayment(paymentId, 1),
    onSuccess: () => {
      toast.success("Pago rechazado exitosamente");
      queryClient.invalidateQueries({
        queryKey: TICKET_SALES_QUERY_KEYS.all,
      });
    },
    onError: (error: any) => {
      toast.error("Error al rechazar el pago");
    },
  });
}
