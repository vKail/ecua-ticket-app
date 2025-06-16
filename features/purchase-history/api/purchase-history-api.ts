import { AxiosClient } from "@/core/infrestructure/http/axios-client";
import { HttpHandler } from "@/core/interfaces/HttpHandler";
import { PURCHASE_HISTORY_ROUTES } from "@/shared/api/routes/pucharse-history";
import { PurchaseResponse } from "../types/purchase.interface";

interface PurchaseHistoryProps {
  getPurchases: () => Promise<PurchaseResponse[]>;
}

export class PurchaseHistoryApi implements PurchaseHistoryProps {
  private readonly httpClient: HttpHandler;
  private static instance: PurchaseHistoryApi;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  async getPurchases(): Promise<PurchaseResponse[]> {
    const { data } = await this.httpClient.get<PurchaseResponse[]>(
      PURCHASE_HISTORY_ROUTES.base
    );
    return data;
  }

  public static getInstance(): PurchaseHistoryApi {
    if (!PurchaseHistoryApi.instance) {
      PurchaseHistoryApi.instance = new PurchaseHistoryApi();
    }
    return PurchaseHistoryApi.instance;
  }
}
