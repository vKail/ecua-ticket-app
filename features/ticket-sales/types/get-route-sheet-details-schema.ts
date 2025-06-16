import z from "zod";
import type { RouteSheet } from "@/core/models/RouteSheet";
import type { CommonResponse } from "@/shared/types/api-response";

export const getRouteSheetDetailsSchema = {
  params: z.object({
    routeSheetId: z.number().positive("ID de hoja de ruta requerido"),
  }),
};

type GetRouteSheetDetailsParams = z.infer<
  typeof getRouteSheetDetailsSchema.params
>;

export type GetRouteSheetDetailsRequest = {
  params: GetRouteSheetDetailsParams;
};

interface RouteSheetDetailsExtended extends RouteSheet {
  occupiedSeats: number[];
  totalSeats: number;
  availableSeats: number;
}

export type GetRouteSheetDetailsResponse =
  CommonResponse<RouteSheetDetailsExtended>;
