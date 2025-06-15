import { PassengerType } from "@/core/enums/PassengerType.enum";
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";

export interface TicketSaleRoute {
  id: number;
  origin: { id: number; name: string };
  destination: { id: number; name: string };
  date: string;
  companyId: number;
  companyName: string;
  routeSheetId: number;
  frequencies: Array<{
    id: number;
    time: string;
    busId: number;
    busPlate: string;
  }>;
}

export interface TicketSaleSeat {
  id: number;
  seatNumber: string;
  isOccupied: boolean;
}

export interface TicketSalePassenger {
  passengerId: string;
  passengerName: string;
  passengerType: PassengerType;
  physicalSeatId: number;
}

export interface TicketSaleFormState {
  step: number;
  selectedRoute?: TicketSaleRoute;
  selectedFrequencyId?: number;
  selectedSeats: TicketSaleSeat[];
  passengers: TicketSalePassenger[];
  paymentMethod: PaymentMethod;
  bankReference?: string;
  clerkId: number;
  companyId: number;
}
