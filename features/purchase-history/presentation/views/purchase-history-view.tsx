"use client";
import { LoadingSpinner } from "@/shared/components/LoadinSpinner";
import { usePurchaseHistory } from "../../hooks/useQueries/use-purchase-history";
import { PurchaseHistoryCard } from "../components/purchase-history-card";

export const PucharseHistoryView = () => {
  const { data: purchases, isLoading } = usePurchaseHistory();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col items-center justify-start h-screen z-50">
      <h1 className="text-2xl font-bold mb-4 text-primary z-50">
        Historial de Compras
      </h1>
      <div className="flex flex-col space-y-4">
        {purchases?.map((purchase) => (
          <PurchaseHistoryCard key={purchase.id} purchaseItem={purchase} />
        ))}
      </div>
    </div>
  );
};
