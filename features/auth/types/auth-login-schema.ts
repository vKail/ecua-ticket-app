import { LoginResponse } from "@/core/models/User-Login";
import { CommonResponse } from "@/shared/types/api-response";
import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(6, {
    message: "El nombre de usuario debe tener al menos 6 caracteres",
  }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export type AuthLoginResponse = CommonResponse<LoginResponse>;
