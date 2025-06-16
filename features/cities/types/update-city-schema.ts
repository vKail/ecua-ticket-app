import z from "zod";
import { createCitySchema } from "./create-city-schema";
import type { City } from "@/core/models/City";
import type { CommonResponse } from "@/shared/types/api-response";

export const updateCitySchema = {
  params: z.object({
    id: z.number().positive(),
  }),
  body: createCitySchema.body.partial(),
};

type UpdateCityRequestBody = z.infer<typeof updateCitySchema.body>;
type UpdateCityParams = z.infer<typeof updateCitySchema.params>;

export type UpdateCityRequest = {
  params: UpdateCityParams;
  body: UpdateCityRequestBody;
};

export type UpdateCityResponse = CommonResponse<City>;
