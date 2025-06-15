import axios from "axios";
import { requestInterceptor } from "./interceptors/request";
import {
  responseInterceptor,
  responseErrorInterceptor,
} from "./interceptors/response";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);
