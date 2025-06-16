import { useQuery } from "@tanstack/react-query";
import { PURCHASE_HISTORY_QUERY_KEYS } from "../../constans/query-keys";
import { PurchaseHistoryApi } from "../../api/purchase-history-api";

export const usePurchaseHistory = () => {
  return useQuery({
    queryKey: PURCHASE_HISTORY_QUERY_KEYS.list(),
    queryFn: () => PurchaseHistoryApi.getInstance().getPurchases(),
  });
};
