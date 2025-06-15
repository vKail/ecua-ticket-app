import z from "zod";
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import { PassengerType } from "@/core/enums/PassengerType.enum";
import { Payment } from "@/core/models/Payment";
import type { CommonResponse } from "@/shared/types/api-response";

export const createCounterSaleSchema = {
  body: z.object({
    routeSheetId: z.number().positive(),
    originId: z.number().positive(),
    destinationId: z.number().positive(),
    passengers: z
      .array(
        z.object({
          passengerId: z.string().min(1, "El ID del pasajero es requerido"),
          passengerName: z
            .string()
            .min(1, "El nombre del pasajero es requerido"),
          passengerType: z.nativeEnum(PassengerType),
          physicalSeatId: z.number().positive(),
        })
      )
      .min(1, "Debe haber al menos un pasajero"),
    paymentMethod: z.nativeEnum(PaymentMethod),
    bankReference: z.string(),
    clerkId: z.number().positive(),
    companyId: z.number().positive(),
  }),
};

type CreateCounterSaleRequestBody = z.infer<
  typeof createCounterSaleSchema.body
>;

export type CreateCounterSaleRequest = CreateCounterSaleRequestBody;

export type CreateCounterSaleResponse = CommonResponse<PaymentResponse>;

export type PaymentResponse = {
  payment: {
    id: number;
    amount: number;
    subtotal: number;
    taxes: number;
    discounts: number;
    paymentMethod: PaymentMethod | string;
    status: string;
    receiptUrl: string;
    isOnlinePayment: boolean;
    createdAt: string;
    tickets: Array<{
      id: number;
      passengerId: string;
      passengerName: string;
      passengerType: PassengerType | string;
      price: number;
      basePrice: number;
      discount: number;
      accessCode: string;
      status: string;
      receiptUrl: string;
      createdAt: string;
      origin: Record<string, unknown>;
      destination: Record<string, unknown>;
      physicalSeat: Record<string, unknown>;
    }>;
  };
  message: string;
  totalTickets: number;
};
