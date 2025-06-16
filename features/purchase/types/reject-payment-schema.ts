import z from "zod";
import type { CommonResponse } from "@/shared/types/api-response";

export const rejectPaymentSchema = {
  params: z.object({
    paymentId: z.number().positive(),
    clerkId: z.number().positive(),
  }),
};

type RejectPaymentParams = z.infer<typeof rejectPaymentSchema.params>;

export type RejectPaymentRequest = RejectPaymentParams;

export type RejectPaymentResponse = CommonResponse<null>;
