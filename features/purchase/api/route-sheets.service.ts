import { apiClient } from "@/shared/api/client";
import { ROUTE_SHEETS_ROUTES } from "@/shared/api/routes/route-sheets";
import { QR_ROUTES } from "@/shared/api/routes/qr";
import type {
  SearchRoutesRequest,
  SearchRoutesResponse,
  AvailableSeatsResponse,
  ValidateSeatRequest,
  ValidateSeatResponse,
  GenerateQRResponse,
} from "../types";

async function searchRoutes(
  params: SearchRoutesRequest
): Promise<SearchRoutesResponse> {
  const { data } = await apiClient.get<SearchRoutesResponse>(
    ROUTE_SHEETS_ROUTES.search,
    {
      params: {
        originId: params.originId,
        destinationId: params.destinationId,
        date: params.date,
      },
    }
  );

  const result = data;

  console.log(result);

  return result;
}

async function getAvailableSeats(
  routeSheetId: number
): Promise<AvailableSeatsResponse> {
  const { data } = await apiClient.get<AvailableSeatsResponse>(
    ROUTE_SHEETS_ROUTES.availableSeats(routeSheetId)
  );
  return data;
}

async function validateSeat(
  params: ValidateSeatRequest
): Promise<ValidateSeatResponse> {
  const { data } = await apiClient.get<ValidateSeatResponse>(
    ROUTE_SHEETS_ROUTES.validate(params.routeSheetId),
    {
      params: {
        seatId: params.seatId,
      },
    }
  );
  return data;
}

async function generateQR(accessCode: string): Promise<GenerateQRResponse> {
  const { data } = await apiClient.get<GenerateQRResponse>(
    QR_ROUTES.generate(accessCode)
  );
  return data;
}

export const routeSheetsService = {
  searchRoutes,
  getAvailableSeats,
  validateSeat,
  generateQR,
};
