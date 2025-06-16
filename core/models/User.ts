export type UserRole = "ADMIN" | "COMPANY" | "CUSTOMER" | "CLERK" | "DRIVER";

export interface User {
  id: number;
  name: string;
  surname: string;
  dni: string;
  email: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  companyId: number;
}
