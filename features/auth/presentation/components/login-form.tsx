"use client"

// import { useForm, FormProvider } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import RHFInput from "@/shared/components/RHFInput"
import { FormProvider, useForm } from "react-hook-form"
import { loginSchema } from "../../types/auth-login-schema"

// const loginSchema = z.object({
//   email: z.string().min(1, "El correo electrónico es requerido").email("Ingresa un correo electrónico válido"),
//   password: z.string().min(1, "La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
// })

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  isLoading?: boolean
}

export default function LoginForm({  isLoading = false }: LoginFormProps) {
  const methods = useForm<LoginFormData>({
    // resolver: zodResolver(loginSchema),
    // defaultValues: {
    //   email: "",
    //   password: "",
    // },
  })

//   const handleSubmit = (data: LoginFormData) => {
//     onSubmit(data)
//   }

  return (
    <FormProvider {...methods} >
      <form className="space-y-6">
        <RHFInput
          name="email"
          label="Correo electrónico"
          type="email"
          placeholder="example@example.com"
          disabled={isLoading}
        />

        <RHFInput
          name="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••••••••••"
          disabled={isLoading}
        />

        <div className="text-center">
          <button type="button" className="text-sm text-gray-600 hover:text-gray-800 underline" disabled={isLoading}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Contraseña"}
        </Button>

        <div className="text-center">
          <button type="button" className="text-sm text-gray-600 hover:text-gray-800 underline" disabled={isLoading}>
            Crea tu cuenta aquí
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
