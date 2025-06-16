import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseResponse } from "../../types/purchase.interface";
import { useRouter } from "next/navigation";

interface PurchaseHistoryCardProps {
  purchaseItem: PurchaseResponse;
}

export function PurchaseHistoryCard({
  purchaseItem,
}: PurchaseHistoryCardProps) {
  const router = useRouter();
  const ticket = purchaseItem.tickets.find(
    (ticket) => ticket.id === purchaseItem.id
  );

  return (
    <Card 
      className="bg-secondary border-none shadow-sm rounded-2xl overflow-hidden z-50 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/dashboard/purchase-history/${purchaseItem.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Image
              src="/purchase-history.webp"
              alt="Ilustración de viaje"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          <div className="flex-1 ml-4 justify-start">
            <div className="text-left">
              <h3 className="text-primary font-semibold text-lg mb-1">
                {ticket?.origin.name} - {ticket?.destination.name}
              </h3>

              <p className="text-primary text-sm mb-1">
                Método de pago: {purchaseItem.paymentMethod}
              </p>

              <p className="text-primary text-sm mb-3">
                Fecha:{" "}
                {ticket?.routeSheet.date
                  ? new Date(ticket.routeSheet.date).toLocaleString()
                  : "Fecha no disponible"}
              </p>

              <div className="border-t-2 border-dotted border-primary mb-3 opacity-50"></div>

              <p className="text-primary font-bold text-base">
                Valor Total : $ {purchaseItem.total}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PurchaseHistoryCard;
