import { apiClient } from "@/shared/api/client";
import { TICKET_SALES_ROUTES } from "@/shared/api/routes/ticket-sales";

async function createCounterSale(req: any): Promise<any> {
  const { data } = await apiClient.post(TICKET_SALES_ROUTES.counter, req);
  return data;
}

async function validatePayment(
  paymentId: number,
  clerkId: number,
  paypalOrderId?: string
): Promise<void> {
  const url = paypalOrderId
    ? `${TICKET_SALES_ROUTES.validatePayment(
        paymentId
      )}?paypalOrderId=${paypalOrderId}`
    : TICKET_SALES_ROUTES.validatePayment(paymentId);

  await apiClient.patch(url, {
    clerkId,
  });
}

async function rejectPayment(
  paymentId: number,
  clerkId: number
): Promise<void> {
  await apiClient.patch(TICKET_SALES_ROUTES.rejectPayment(paymentId), {
    clerkId,
  });
}

export const ticketSalesService = {
  createCounterSale,
  validatePayment,
  rejectPayment,
};
