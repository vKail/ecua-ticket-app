import z from "zod";
import type { CommonResponse } from "@/shared/types/api-response";

export const validatePaymentSchema = {
  params: z.object({
    paymentId: z.number().positive(),
    clerkId: z.number().positive(),
  }),
};

type ValidatePaymentParams = z.infer<typeof validatePaymentSchema.params>;

export type ValidatePaymentRequest = ValidatePaymentParams;

export type ValidatePaymentResponse = CommonResponse<null>;
