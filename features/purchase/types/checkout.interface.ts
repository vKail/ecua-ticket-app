import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import { PassengerType } from "@/core/enums/PassengerType.enum";

export interface CheckoutTicket {
  frecuencySegmentPriceId: number;
  date: string;
  physicalSeatId: number;
  passengerType: PassengerType;
  passengerId?: number;
  passsengerDni: string;
  passengerName: string;
  passengerSurname: string;
  passengerEmail: string;
  passengerBirthDate: string;
}

export interface OnlineSaleRequest {
  paymentMethod: PaymentMethod;
  paypalTransactionId?: string;
  bankReference?: string;
  receiptUrl?: string;
  tickets: CheckoutTicket[];
}

export interface PayPalOrderResponse {
  success: boolean;
  message: string;
  paymentId: number;
  paypalOrderId: string;
  approvalUrl: string;
}

export interface TransferSaleResponse {
  success: boolean;
  message: string;
  paymentId: number;
  tickets: ProcessedTicket[];
}

export interface ProcessedTicket {
  passengerId: number;
  passengerType: string;
  passenger: {
    dni: string;
    name: string;
    surname: string;
    email: string;
    birthDate: string;
  };
  price: number;
  basePrice: number;
  discount: number;
  accessCode: string;
  routeSheetId: number;
  physicalSeatId: number;
  originId: number;
  destinationId: number;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: {
    content: string[];
    displayable: boolean;
  };
  data: T;
}

export interface ValidatePaymentRequest {
  paypalOrderId?: string;
}

export interface ValidatePaymentResponse {
  message: string;
}

export interface CheckoutData {
  route: {
    id: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    availableSeats: number;
    busType: string;
    busCompany: string;
  };
  seats: {
    id: string;
    number: string;
    position: { row: number; col: number };
    status: string;
    price: number;
    type: string;
  }[];
  passengers: {
    id: string;
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    email: string;
    phone: string;
    seatNumber: string;
    birthDate: string;
  }[];
}
