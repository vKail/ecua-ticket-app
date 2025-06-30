import React from "react";
import { PaymentStatus } from "@/core/enums/PaymentStatus.enum";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

/**
 * Componente para mostrar el estado del pago con colores específicos:
 * - PENDING: Amarillo
 * - APPROVED: Verde
 * - REJECTED: Rojo
 * - REFUNDED: Plomo/Gris
 */
export function PaymentStatusBadge({
  status,
  className = "",
}: PaymentStatusBadgeProps) {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: "⏳",
          label: "Pendiente",
        };
      case PaymentStatus.APPROVED:
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: "✅",
          label: "Aprobado",
        };
      case PaymentStatus.REJECTED:
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: "❌",
          label: "Rechazado",
        };
      case PaymentStatus.REFUNDED:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "💰",
          label: "Reembolsado",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "❓",
          label: "Desconocido",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border
        ${config.color}
        ${className}
      `}
    >
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
}

/**
 * Versión más grande para usar en detalles
 */
export function PaymentStatusCard({
  status,
  className = "",
}: PaymentStatusBadgeProps) {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return {
          color: "bg-yellow-50 text-yellow-900 border-yellow-200",
          bgColor: "bg-yellow-100",
          icon: "⏳",
          label: "Pago Pendiente",
          description: "El pago está siendo procesado",
        };
      case PaymentStatus.APPROVED:
        return {
          color: "bg-green-50 text-green-900 border-green-200",
          bgColor: "bg-green-100",
          icon: "✅",
          label: "Pago Aprobado",
          description: "El pago fue procesado exitosamente",
        };
      case PaymentStatus.REJECTED:
        return {
          color: "bg-red-50 text-red-900 border-red-200",
          bgColor: "bg-red-100",
          icon: "❌",
          label: "Pago Rechazado",
          description: "El pago no pudo ser procesado",
        };
      case PaymentStatus.REFUNDED:
        return {
          color: "bg-gray-50 text-gray-900 border-gray-200",
          bgColor: "bg-gray-100",
          icon: "💰",
          label: "Pago Reembolsado",
          description: "El pago fue reembolsado",
        };
      default:
        return {
          color: "bg-gray-50 text-gray-900 border-gray-200",
          bgColor: "bg-gray-100",
          icon: "❓",
          label: "Estado Desconocido",
          description: "Estado del pago no definido",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg border
        ${config.color}
        ${className}
      `}
    >
      <div
        className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}
      >
        <span className="text-lg">{config.icon}</span>
      </div>
      <div>
        <p className="font-medium text-sm">{config.label}</p>
        <p className="text-xs opacity-75">{config.description}</p>
      </div>
    </div>
  );
}
