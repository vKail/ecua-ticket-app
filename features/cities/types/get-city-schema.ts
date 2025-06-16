import z from "zod";
import type { City } from "@/core/models/City";
import type {
  CommonResponse,
  PaginatedResponse,
} from "@/shared/types/api-response";

export const getCitySchema = {
  params: z.object({
    id: z.number().positive(),
    page: z.number().positive().optional().default(1),
    limit: z.number().positive().optional().default(100),
  }),
};

type GetCityParams = z.infer<typeof getCitySchema.params>;

export type GetCityRequest = {
  params: Pick<GetCityParams, "id">;
};

export type GetCitiesRequest = {
  params?: Partial<Pick<GetCityParams, "page" | "limit">>;
};

export type GetCityResponse = CommonResponse<City>;

export type GetCitiesResponse = PaginatedResponse<City[]>;
