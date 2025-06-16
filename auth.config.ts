import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { z } from "zod";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: {},
        name: {},
        surname: {},
        dni: {},
        email: {},
        username: {},
        password: {},
        role: {},
        accessToken: {},
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            id: z.string(),
            name: z.string(),
            surname: z.string(),
            dni: z.string(),
            email: z.string().email(),
            username: z.string(),
            password: z.string(),
            role: z.string(),
            accessToken: z.string(),
          })
          .safeParse(credentials);
        if (!parsedCredentials.success) return null;
        return parsedCredentials.data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.surname = user.surname;
        token.dni = user.dni;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.surname = token.surname as string;
        session.user.dni = token.dni as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl, url } }) {
      const { pathname } = nextUrl;
      const user = auth?.user;

      if (pathname === "/login" && user) {
        const redirectPath = "/dashboard";
        if (!redirectPath) return true;
        return NextResponse.redirect(new URL(redirectPath, url));
      }
      if (pathname !== "/login" && !user) {
        const redirectPath = "/login";
        if (!redirectPath) return true;
        return NextResponse.redirect(new URL(redirectPath, url));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
