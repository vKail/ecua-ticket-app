import { PassengerType } from "../enums/PassengerType.enum";
import { PaymentMethod } from "../enums/PaymentMethod.enum";
import type { Payment } from "./Payment";
import type { PhysicalSeat } from "./PhysicalSeat";
import type { City } from "./City";
import type { RouteSheet } from "./RouteSheet";
import type { TicketScan } from "./TicketScan";
import { Passenger } from "./Passenger";

export interface Ticket {
  id: number;
  passengerId: string;
  passengerName: string;
  passengerType: PassengerType;
  price: number;
  basePrice: number;
  discount: number;
  accessCode: string;
  status: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  paymentId?: number;
  payment?: Payment;
  routeSheetId: number;
  routeSheet?: RouteSheet;
  physicalSeatId: number;
  physicalSeat?: PhysicalSeat;
  originId: number;
  origin?: City;
  destinationId: number;
  destination?: City;
  scans?: TicketScan[];
  passenger: Passenger;
  passengerSurname?: string;
  passsengerDni?: string;
  passengerEmail?: string;
}
