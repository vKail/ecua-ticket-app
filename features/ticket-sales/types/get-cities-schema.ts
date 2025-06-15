import z from "zod";
import type { City } from "@/core/models/City";
import type { PaginatedResponse } from "@/shared/types/api-response";

export const getCitiesSchema = {
  query: z.object({
    page: z.number().positive().optional(),
    limit: z.number().positive().optional(),
    search: z.string().optional(),
  }),
};

type GetCitiesQuery = z.infer<typeof getCitiesSchema.query>;

export type GetCitiesRequest = {
  query: GetCitiesQuery;
};

export type GetCitiesResponse = PaginatedResponse<City[]>;
