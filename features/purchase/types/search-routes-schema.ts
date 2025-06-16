import z from "zod";
import type { RouteSheet } from "@/core/models/RouteSheet";
import type { CommonResponse } from "@/shared/types/api-response";

export const searchRoutesSchema = {
  query: z.object({
    originId: z.number().positive("ID de ciudad de origen requerido"),
    destinationId: z.number().positive("ID de ciudad de destino requerido"),
    date: z.string().min(1, "Fecha de viaje requerida"),
    companyId: z.number().positive().optional(),
  }),
};

type SearchRoutesQuery = z.infer<typeof searchRoutesSchema.query>;

export type SearchRoutesRequest = {
  query: SearchRoutesQuery;
};

interface AvailableRoute {
  routeSheet: RouteSheet;
  availableSeats: number;
  basePrice: number;
  estimatedDuration: string;
}

export type SearchRoutesResponse = CommonResponse<AvailableRoute[]>;
