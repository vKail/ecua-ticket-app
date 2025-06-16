import { SeatType } from "./SeatType";

export interface PhysicalSeat {
  id: number;
  seatNumber: string;
  row?: number;
  column?: number;
  floor?: number;
  busId: number;
  seatTypeId: number;
  seatType: SeatType;
  isOccupied?: boolean;
}
