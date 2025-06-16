import type { User } from "./User";
import type { Bus } from "./Bus";
import type { Frequency } from "./Frequency";
import type { Payment } from "./Payment";

export interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  supportContact?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: User[];
  buses?: Bus[];
  frequencies?: Frequency[];
  payments?: Payment[];
}
