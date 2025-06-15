"use client";
import React from "react";
import { useLogin } from "../../hooks/use-auth";
import { LoginForm } from "../components/login-form";
import Image from "next/image";

export const LoginView: React.FC = () => {
  const login = useLogin();

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="text-center z-10">
          <div className="mb-8">
            <Image
              src="/logo_ecuaticket.webp"
              alt="Ecuatickets Bus Logo"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">
            Bienvenido a Ecuatickets
          </h2>
          <p className="text-lg text-gray-500">Inicio de sesión</p>
        </div>
        <LoginForm
          onSubmit={login.onSubmit}
          isLoading={login.isLoading}
          error={login.isError ? login.error : null}
        />
      </div>
    </div>
  );
};
