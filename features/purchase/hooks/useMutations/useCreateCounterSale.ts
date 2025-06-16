"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketSalesService } from "../../api/ticket-sales.service";
import { TICKET_SALES_QUERY_KEYS } from "../../consts/query-keys";
import { toast } from "sonner";

export function useCreateCounterSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketSalesService.createCounterSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_SALES_QUERY_KEYS.all });
      toast.success("¡Venta procesada exitosamente!");
    },
    onError: (error: any) => {
      console.log(error);
      toast.error("Error al procesar la venta");
    },
  });
}
