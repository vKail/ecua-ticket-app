import z from "zod";
import type { CommonResponse } from "@/shared/types/api-response";

export const validateSeatAvailabilitySchema = {
  params: z.object({
    routeSheetId: z.number().positive("ID de hoja de ruta requerido"),
  }),
  body: z.object({
    seatIds: z
      .array(z.number().positive())
      .min(1, "Al menos un asiento requerido"),
  }),
};

type ValidateSeatAvailabilityParams = z.infer<
  typeof validateSeatAvailabilitySchema.params
>;
type ValidateSeatAvailabilityBody = z.infer<
  typeof validateSeatAvailabilitySchema.body
>;

export type ValidateSeatAvailabilityRequest = {
  params: ValidateSeatAvailabilityParams;
  body: ValidateSeatAvailabilityBody;
};

interface SeatAvailabilityResult {
  available: boolean;
  unavailableSeats: number[];
}

export type ValidateSeatAvailabilityResponse =
  CommonResponse<SeatAvailabilityResult>;
