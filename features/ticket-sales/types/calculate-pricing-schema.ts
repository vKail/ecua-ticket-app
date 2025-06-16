import z from "zod";
import { PassengerType } from "@/core/enums/PassengerType.enum";
import type { CommonResponse } from "@/shared/types/api-response";

export const calculatePricingSchema = {
  body: z.object({
    routeSheetId: z.number().positive("ID de hoja de ruta requerido"),
    originId: z.number().positive("ID de ciudad de origen requerido"),
    destinationId: z.number().positive("ID de ciudad de destino requerido"),
    seatTypeIds: z
      .array(z.number().positive())
      .min(1, "Al menos un tipo de asiento requerido"),
    passengerTypes: z
      .array(z.nativeEnum(PassengerType))
      .min(1, "Al menos un tipo de pasajero requerido"),
  }),
};

type CalculatePricingBody = z.infer<typeof calculatePricingSchema.body>;

export type CalculatePricingRequest = CalculatePricingBody;

interface SeatPricing {
  seatTypeId: number;
  multiplier: number;
  price: number;
}

interface PassengerDiscount {
  passengerType: PassengerType;
  discountPercentage: number;
  discountAmount: number;
}

interface PricingResult {
  basePrice: number;
  seatPricing: SeatPricing[];
  passengerDiscounts: PassengerDiscount[];
  taxes: number;
  total: number;
}

export type CalculatePricingResponse = CommonResponse<PricingResult>;
