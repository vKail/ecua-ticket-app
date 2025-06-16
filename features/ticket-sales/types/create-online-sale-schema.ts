import z from "zod";
import { PassengerType } from "@/core/enums/PassengerType.enum";
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import type { Payment } from "@/core/models/Payment";
import type { CommonResponse } from "@/shared/types/api-response";

const PassengerInfoSchema = z.object({
  passengerId: z.string().min(1, "ID de pasajero requerido"),
  passengerName: z.string().min(1, "Nombre de pasajero requerido"),
  passengerType: z.nativeEnum(PassengerType),
  physicalSeatId: z.number().positive("ID de asiento requerido"),
});

export const createOnlineSaleSchema = {
  body: z.object({
    routeSheetId: z.number().positive("ID de hoja de ruta requerido"),
    originId: z.number().positive("ID de ciudad de origen requerido"),
    destinationId: z.number().positive("ID de ciudad de destino requerido"),
    passengers: z
      .array(PassengerInfoSchema)
      .min(1, "Al menos un pasajero requerido"),
    paymentMethod: z.nativeEnum(PaymentMethod),
    paypalTransactionId: z.string().optional(),
    bankReference: z.string().optional(),
    receiptUrl: z.string().optional(),
    customerId: z.number().positive("ID de cliente requerido"),
  }),
};

type CreateOnlineSaleBody = z.infer<typeof createOnlineSaleSchema.body>;

export type CreateOnlineSaleRequest = CreateOnlineSaleBody;

interface SaleResult {
  payment: Payment;
  message: string;
  totalTickets: number;
}

export type CreateOnlineSaleResponse = CommonResponse<SaleResult>;
