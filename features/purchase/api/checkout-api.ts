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
  ) => Promise<ValidatePaymentResponse>;
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

    console.log("Raw API response:", response);
    console.log("Extracted data:", response.data);

    return response.data;
  }  async validatePayment(
    paymentId: number,
    data?: ValidatePaymentRequest
  ): Promise<ValidatePaymentResponse> {
    console.log("🔍 Validating payment:");
    console.log("- PaymentId (URL):", paymentId);
    console.log("- Data (for query):", data);
    
    // Construir URL con query parameters en lugar de enviarlo en el body
    let url = TICKET_SALES_ROUTES.validatePayment(paymentId);
    if (data?.paypalOrderId) {
      url += `?paypalOrderId=${encodeURIComponent(data.paypalOrderId)}`;
    }
    
    console.log("- Final URL with query:", url);

    // Enviar PATCH SIN BODY (undefined) como espera el backend
    const response = await this.httpClient.patch<ValidatePaymentResponse>(url);

    console.log("✅ Validation response:", response);

    // Para PayPal, lanzar error si success es false (para usar con polling)
    // Para transferencias, retornar la respuesta tal como está
    if (data?.paypalOrderId) {
      // Es PayPal - usar lógica de polling (lanzar error si no está validado)
      if (response.data && response.data.success) {
        return response.data;
      } else {
        // Si success es false, lanzar error para que TanStack Query lo trate como fallido
        throw new Error("Payment not yet validated");
      }
    } else {
      // Es transferencia u otro método - retornar respuesta directamente
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response from server");
      }
    }
  }

  public static getInstance(): CheckoutApi {
    if (!CheckoutApi.instance) {
      CheckoutApi.instance = new CheckoutApi();
    }
    return CheckoutApi.instance;
  }
}
