import type { Ticket } from "./Ticket";
import { User } from "./User";

export interface TicketScan {
  id: number;
  user?: User;
  ticket?: Ticket;
  scannedAt: string;
}
