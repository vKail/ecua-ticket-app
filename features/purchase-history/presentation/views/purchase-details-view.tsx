"use client";

import { useParams } from "next/navigation";
import { usePurchaseHistory } from "../../hooks/useQueries/use-purchase-history";
import { PurchaseDetails } from "../components/purchase-details";
import { LoadingSpinner } from "@/shared/components/LoadinSpinner";

export const PurchaseDetailsView = () => {
  const params = useParams();
  const { data: purchases, isLoading } = usePurchaseHistory();

  if (isLoading) return <LoadingSpinner />;

  const purchase = purchases?.find((p) => p.id === Number(params.id));

  if (!purchase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-primary">Compra no encontrada</p>
      </div>
    );
  }

  return <PurchaseDetails purchase={purchase} />;
}; 