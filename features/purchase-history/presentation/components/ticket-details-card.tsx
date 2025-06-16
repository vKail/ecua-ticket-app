import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket } from "../../types/purchase.interface";
import { useQRGeneration } from "@/features/ticket-sales/hooks/useQueries/useQRGeneration";
import { LoadingSpinner } from "@/shared/components/LoadinSpinner";
import { User, Calendar, CreditCard, ScanLine, Armchair } from "lucide-react";

interface TicketDetailsCardProps {
  ticket: Ticket;
}

export function TicketDetailsCard({ ticket }: TicketDetailsCardProps) {
  const { data: qrData, isLoading: isLoadingQR } = useQRGeneration(
    ticket.accessCode,
    true
  );

  return (
    <div className="bg-white rounded-xl p-6 space-y-6 shadow-md border border-gray-200">
      {/* Encabezado del boleto */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-primary mb-1">
            {ticket.origin?.name} → {ticket.destination?.name}
          </h2>
          <div className="flex items-center text-sm text-gray-600 gap-1">
            <Calendar size={16} className="text-primary" />
            <span>
              {new Date(ticket.routeSheet?.date || "").toLocaleString()}
            </span>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <div className="flex items-center justify-end gap-1">
            <CreditCard size={16} className="text-primary" />
            <span className="font-semibold text-base text-primary">
              ${ticket.price}
            </span>
          </div>
        </div>
      </div>

      {/* QR de Acceso */}
      <div className="flex flex-col items-center text-center">
        <h3 className="text-md font-semibold text-primary mb-2 flex items-center gap-2">
          <ScanLine size={18} /> Código QR de Acceso
        </h3>
        {isLoadingQR ? (
          <LoadingSpinner />
        ) : qrData?.data?.qr ? (
          <div className="bg-white p-3 rounded-lg shadow-sm border">
            <Image
              src={qrData.data.qr}
              alt="Código QR"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No se pudo generar el código QR
          </p>
        )}
        <p className="text-xs text-gray-600 mt-2">
          Código de acceso: <span className="font-medium">{ticket.accessCode}</span>
        </p>
      </div>

      {/* Información del pasajero */}
      <div className="space-y-2">
        <h4 className="text-md font-semibold text-primary flex items-center gap-2">
          <User size={18} /> Información del Pasajero
        </h4>
        <div className="text-sm text-gray-700 ml-1">
          <p>
            <strong>Nombre:</strong> {ticket.passenger.name} {ticket.passenger.surname}
          </p>
          <p>
            <strong>Documento:</strong> {ticket.passenger.dni}
          </p>
          <p>
            <strong>Email:</strong> {ticket.passenger.email}
          </p>
        </div>
      </div>

      {/* Información del asiento */}
      <div className="space-y-1">
        <h4 className="text-md font-semibold text-primary flex items-center gap-2">
          <Armchair size={18} /> Información del Asiento
        </h4>
        <p className="text-sm text-gray-700 ml-1">
          <strong>Número de Asiento:</strong> {ticket.physicalSeat?.seatNumber}
        </p>
      </div>
    </div>
  );
}
