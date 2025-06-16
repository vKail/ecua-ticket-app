import z from "zod";
import type { CommonResponse } from "@/shared/types/api-response";

export const createCitySchema = {
  body: z.object({
    name: z.string().min(1, "El nombre de la ciudad es requerido"),
    province: z.string().min(1, "La provincia es requerida"),
  }),
};

type CreateCityRequestBody = z.infer<typeof createCitySchema.body>;

export type CreateCityRequest = CreateCityRequestBody;

export type CreateCityResponse = CommonResponse<boolean>;
