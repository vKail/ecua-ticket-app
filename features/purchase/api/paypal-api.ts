import { AxiosClient } from "@/core/infrestructure/http/axios-client";
import { HttpHandler } from "@/core/interfaces/HttpHandler";
import { TICKET_SALES_ROUTES } from "@/shared/api/routes/ticket-sales";
import {
  OnlineSaleRequest,
  PayPalOrderResponse,
  ValidatePaymentResponse,
} from "../types/checkout.interface";

interface PayPalApiProps {
  createOrder: (data: OnlineSaleRequest) => Promise<PayPalOrderResponse>;
  captureOrder: (
    paymentId: number,
    paypalOrderId: string
  ) => Promise<ValidatePaymentResponse>;
}

export class PayPalApi implements PayPalApiProps {
  private readonly httpClient: HttpHandler;
  private static instance: PayPalApi;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  async createOrder(data: OnlineSaleRequest): Promise<PayPalOrderResponse> {
    const response = await this.httpClient.post<PayPalOrderResponse>(
      TICKET_SALES_ROUTES.online,
      data
    );
    return response.data;
  }

  async captureOrder(
    paymentId: number,
    paypalOrderId: string
  ): Promise<ValidatePaymentResponse> {
    const url = `${TICKET_SALES_ROUTES.validatePayment(
      paymentId
    )}?paypalOrderId=${encodeURIComponent(paypalOrderId)}`;
    const response = await this.httpClient.patch<ValidatePaymentResponse>(url);
    return response.data;
  }

  public static getInstance(): PayPalApi {
    if (!PayPalApi.instance) {
      PayPalApi.instance = new PayPalApi();
    }
    return PayPalApi.instance;
  }
}
