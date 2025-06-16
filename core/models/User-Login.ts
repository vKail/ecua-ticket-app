export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    companyId: number;
    person: Person;
    company: Company;
  };
}

export interface Company {
  id: number;
  name: string;
  logoUrl: string;
  supportContact: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: number;
  name: string;
  surname: string;
  dni: string;
  email: string;
  birthDate: Date;
}

