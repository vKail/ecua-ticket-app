export const PURCHASE_HISTORY_QUERY_KEYS = {
  all: ["purchaseHistory"] as const,
  list: () => [...PURCHASE_HISTORY_QUERY_KEYS.all, "list"] as const,
};
