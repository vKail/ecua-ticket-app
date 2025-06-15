import type { InternalAxiosRequestConfig } from "axios";

export function requestInterceptor(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}
