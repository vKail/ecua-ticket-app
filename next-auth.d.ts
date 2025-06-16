import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      surname: string;
      username: string;
      email: string;
      dni: string;
      role: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    name: string;
    surname: string;
    username: string;
    email: string;
    dni: string;
    role: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    name?: string;
    surmane?: string;
    username?: string;
    email?: string;
    role?: string;
    accessToken?: string;
  }
}
