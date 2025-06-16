import z from "zod";
import type { PhysicalSeat } from "@/core/models/PhysicalSeat";
import type { CommonResponse } from "@/shared/types/api-response";

export const getAvailableSeatsSchema = {
  params: z.object({
    routeSheetId: z.number().positive("ID de hoja de ruta requerido"),
  }),
};

type GetAvailableSeatsParams = z.infer<typeof getAvailableSeatsSchema.params>;

export type GetAvailableSeatsRequest = {
  params: GetAvailableSeatsParams;
};

export type GetAvailableSeatsResponse = CommonResponse<PhysicalSeat[]>;
