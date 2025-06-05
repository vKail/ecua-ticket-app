export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    surname: string;
    dni: string;
    email: string;
    username: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}