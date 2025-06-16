import { RouteMode } from "../enums/RouteMode.enum";
import { RouteStatus } from "../enums/RouteStatus.enum";
import { Bus } from "./Bus";
import { Frequency } from "./Frequency";
import { Ticket } from "./Ticket";

export interface RouteSheet {
  id: number;
  date: string;
  status: RouteStatus;
  mode: RouteMode;
  frequencyId: number;
  frequency: Frequency;
  busId: number;
  bus: Bus;
  tickets?: Ticket[];
}
