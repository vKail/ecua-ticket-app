const BASE_URL = "/ticket-sales";

export const TICKET_SALES_ROUTES = {
  counter: `${BASE_URL}/counter`,
  online: `${BASE_URL}/online`,
  validatePayment: (paymentId: number) =>
    `${BASE_URL}/payments/${paymentId}/validate`,
  rejectPayment: (paymentId: number) =>
    `${BASE_URL}/payments/${paymentId}/reject`,
  customerTickets: (customerId: number) =>
    `${BASE_URL}/customers/${customerId}/tickets`,
  ticketByCode: (accessCode: string, customerId: number) =>
    `${BASE_URL}/tickets/${accessCode}/customer/${customerId}`,
} as const;
