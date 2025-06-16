"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckoutData } from "../types/checkout.interface";
import { CheckoutForm } from "../components/CheckoutForm";
import { BackButton } from "@/shared/components/BackButton";

export function CheckoutContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        console.log("Checkout data received:", parsedData);
        setCheckoutData(parsedData);
      } catch (error) {
        console.error("Error parsing checkout data:", error);
        router.push("/dashboard/purchase");
      }
    } else {
      router.push("/dashboard/purchase");
    }
  }, [searchParams, router]);

  if (!checkoutData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando información del checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-4 pb-24">
      <div className="mb-6">
        <BackButton />
        <h1 className="text-xl font-bold mb-2 mt-4">Resumen de Compra</h1>
      </div>

      <CheckoutForm checkoutData={checkoutData} />
    </div>
  );
}
