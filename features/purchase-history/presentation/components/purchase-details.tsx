import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseResponse } from "../../types/purchase.interface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { TicketDetailsCard } from "./ticket-details-card";

interface PurchaseDetailsProps {
  purchase: PurchaseResponse;
}

export function PurchaseDetails({ purchase }: PurchaseDetailsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <Button
        variant="ghost"
        className="self-start mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <Card className="w-full max-w-2xl bg-secondary border-none shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Detalles de la Compra
            </h2>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-primary/80">
                    ID de Compra: {purchase.id}
                  </p>
                  <p className="text-sm text-primary/80">
                    Fecha: {new Date(purchase.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary/80">
                    Método de pago: {purchase.paymentMethod}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    Total: $ {purchase.total}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-dotted border-primary my-4 opacity-50"></div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-primary">
                  Boletos
                </h3>
                {purchase.tickets.map((ticket) => (
                  <TicketDetailsCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 