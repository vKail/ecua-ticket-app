export const CHECKOUT_QUERY_KEYS = {
  all: ["checkout"] as const,
  onlineSale: ["checkout", "online-sale"] as const,
  validatePayment: (paymentId: number) =>
    ["checkout", "validate-payment", paymentId] as const,
} as const;
