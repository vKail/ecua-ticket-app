"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  LoginRequest,
  loginSchema,
} from "@/features/auth/types/auth-login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "../../hooks/use-auth";

export const LoginForm: React.FC = () => {
  const { onSubmit, isLoading } = useLogin();

  const methods = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = (data: LoginRequest) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          {/* Usuario */}
          <FormField
            control={methods.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-900">
                  Usuario
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="usuario"
                    autoComplete="username"
                    className="h-12 px-4 text-sm border border-gray-300 rounded-lg focus:ring-0 focus:border-blue-900 transition-colors placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contraseña */}
          <FormField
            control={methods.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-900">
                  Contraseña
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••••••••••"
                    autoComplete="current-password"
                    className="h-12 px-4 text-sm border border-gray-300 rounded-lg focus:ring-0 focus:border-blue-900 transition-colors placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botón de envío */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </Button>

          {/* Links opcionales */}
          <Button
            type="button"
            variant="link"
            className="text-sm w-full  text-gray-600 hover:text-gray-800 underline"
            disabled={isLoading}
          >
            ¿Olvidaste tu contraseña?
          </Button>

          <Button
            type="button"
            variant="link"
            className="text-sm w-full  text-gray-600 hover:text-gray-800 underline"
            disabled={isLoading}
          >
            ¿No tienes una cuenta? Regístrate
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};
