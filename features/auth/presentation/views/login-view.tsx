"use client";
import React from "react";
import { useLogin } from "../../hooks/use-auth";
import { LoginForm } from "../components/login-form";
import Image from "next/image";

export const LoginView: React.FC = () => {
  const login = useLogin();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 ">
        <div className="max-w-xs w-full flex flex-col items-center">
          <Image
            src="/logo_ecuaticket.webp"
            alt="Ecuatickets Bus Logo"
            width={180}
            height={180}
            className="mb-4"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm
            onSubmit={login.onSubmit}
            isLoading={login.isLoading}
            error={login.isError ? login.error : null}
          />
        </div>
      </div>
    </div>
  );
};
