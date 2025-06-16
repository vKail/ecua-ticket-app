import { LoginRequest } from "@/core/models/User-Login";
import { apiClient } from "@/shared/api/client";
import { AuthLoginResponse } from "../types/auth-login-schema";

export const login = async (user: LoginRequest): Promise<AuthLoginResponse> => {
  const { data } = await apiClient.post<AuthLoginResponse>("/auth/login", user);
  return data;
};
