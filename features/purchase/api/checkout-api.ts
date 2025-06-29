import { AxiosClient } from "@/core/infrestructure/http/axios-client";
import { HttpHandler } from "@/core/interfaces/HttpHandler";
import { TICKET_SALES_ROUTES } from "@/shared/api/routes/ticket-sales";
import {
  OnlineSaleRequest,
  PayPalOrderResponse,
  TransferSaleResponse,
  ApiResponse,
  ValidatePaymentRequest,
  ValidatePaymentResponse,
} from "../types/checkout.interface";

interface CheckoutApiProps {
  processOnlineSale: (
    data: OnlineSaleRequest
  ) => Promise<PayPalOrderResponse | TransferSaleResponse>;
  validatePayment: (
    paymentId: number,
    data?: ValidatePaymentRequest
  ) => Promise<Boolean>;
}

export class CheckoutApi implements CheckoutApiProps {
  private readonly httpClient: HttpHandler;
  private static instance: CheckoutApi;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  async processOnlineSale(
    data: OnlineSaleRequest
  ): Promise<PayPalOrderResponse | TransferSaleResponse> {
    const response = await this.httpClient.post<
      PayPalOrderResponse | TransferSaleResponse
    >(TICKET_SALES_ROUTES.online, data);

    return response.data;
  }
  async validatePayment(
    paymentId: number,
    data?: ValidatePaymentRequest
  ): Promise<Boolean> {
    let url = TICKET_SALES_ROUTES.validatePayment(paymentId);
    if (data?.paypalOrderId) {
      url += `?paypalOrderId=${encodeURIComponent(data.paypalOrderId)}`;
    }

    const response = await this.httpClient.patch<Boolean>(url);

    if (data?.paypalOrderId) {
      if (response) {
        return response.success;
      } else {
        throw new Error("Payment not yet validated");
      }
    }
    return response.success;
  }

  public static getInstance(): CheckoutApi {
    if (!CheckoutApi.instance) {
      CheckoutApi.instance = new CheckoutApi();
    }
    return CheckoutApi.instance;
  }
}
