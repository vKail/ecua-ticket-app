import type { CommonResponse } from "@/shared/types/api-response";

// Request types
export interface SearchRoutesRequest {
  originId: number;
  destinationId: number;
  date: string; // Format: YYYY-MM-DD
}

export interface ValidateSeatRequest {
  routeSheetId: number;
  seatId: number;
}

// Response types from backend
export interface RouteSheetResponse {
  id: number;
  date: string;
  status: string;
  mode: string;
  frequencyId: number;
  busId: number;
  frequency: {
    id: number;
    time: string;
    resolution: string;
    active: boolean;
    createdAt: string;
    companyId: number;
    originId: number;
    destinationId: number;
    company: {
      id: number;
      name: string;
      logoUrl?: string | null;
      supportContact?: string | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    origin: {
      id: number;
      name: string;
      province: string;
    };
    destination: {
      id: number;
      name: string;
      province: string;
    };
    segmentPrices: Array<{
      id: number;
      price: number;
      frequencyId: number;
      originId: number;
      destinationId: number;
    }>;
  };
  bus: {
    id: number;
    internalNumber: string;
    licensePlate: string;
    chassisBrand: string;
    bodyBrand: string;
    photoUrl?: string | null;
    isActive: boolean;
    companyId: number;
  };
}

export interface PhysicalSeatResponse {
  id: number;
  seatNumber: string;
  row: number;
  column: number;
  floor: number;
  isTaken: boolean;
  busId: number;
  seatTypeId: number;
  seatType: {
    id: number;
    name: string;
    description: string;
    valueToApply: number;
    companyId: number;
  };
}

export interface QRResponse {
  qrCode: string; // Base64 encoded QR image
  accessCode: string;
}

// API Response wrappers
export type SearchRoutesResponse = CommonResponse<RouteSheetResponse[]>;
export type AvailableSeatsResponse = CommonResponse<PhysicalSeatResponse[]>;
export type ValidateSeatResponse = CommonResponse<{ isValid: boolean }>;
export type GenerateQRResponse = CommonResponse<QRResponse>;
