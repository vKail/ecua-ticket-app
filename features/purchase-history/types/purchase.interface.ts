export interface PurchaseResponse {
  id: number;
  subtotal: number;
  discounts: number;
  total: number;
  paymentMethod: string;
  status: string;
  receiptUrl: string;
  paypalTransactionId: string;
  bankReference: string;
  createdAt: Date;
  updatedAt: Date;
  isOnlinePayment: boolean;
  validatedAt: null;
  validatedBy: null;
  userId: number;
  tickets: Ticket[];
}

export interface Ticket {
  id: number;
  price: number;
  basePrice: number;
  discount: number;
  accessCode: string;
  createdAt: Date;
  updatedAt: Date;
  passengerType: string;
  status: string;
  passengerId: number;
  paymentId: number;
  routeSheetId: number;
  physicalSeatId: number;
  originId: number;
  destinationId: number;
  origin: Destination;
  destination: Destination;
  routeSheet: RouteSheet;
}

export interface Destination {
  id: number;
  name: string;
  province: string;
}

export interface RouteSheet {
  id: number;
  date: Date;
  status: string;
  mode: string;
  frequencyId: number;
  busId: number;
}
