import { PaymentMethod } from "../enums/PaymentMethod.enum";
import { PaymentStatus } from "../enums/PaymentStatus.enum";
import { Company } from "./Company";
import type { Ticket } from "./Ticket";
import type { User } from "./User";

export interface Payment {
  id: number;
  amount: number;
  subtotal: number;
  taxes?: number;
  discounts?: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus | string;
  receiptUrl?: string;
  paypalTransactionId?: string;
  bankReference?: string;
  validatedBy?: number;
  validatedAt?: string;
  createdAt: string;
  updatedAt: string;
  isOnlinePayment: boolean;
  userId: number;
  user?: User;
  companyId?: number;
  company?: Company;
  tickets: Ticket[];
}
