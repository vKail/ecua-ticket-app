"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { FormDisabledProvider } from "@/shared/contexts/FormDisabledContext"
import LoginForm from "../components/login-form"

export default function LoginView() {
  const [isLoading, setIsLoading] = useState(false)

//   const handleLogin = async (data: { email: string; password: string }) => {
//     setIsLoading(true)
//     try {
//       // Simular llamada a API
//       await new Promise((resolve) => setTimeout(resolve, 2000))
//       console.log("Login data:", data)
//       // Aquí iría la lógica de autenticación
//     } catch (error) {
//       console.error("Login error:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header decorativo */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-400 rounded-full transform -translate-x-8 -translate-y-8"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500 rounded-full transform translate-x-12 -translate-y-12"></div>
          <div className="absolute top-0 left-1/2 w-48 h-48 bg-blue-900 rounded-full transform -translate-x-1/2 -translate-y-16"></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-white mx-4 rounded-t-3xl relative -mt-8 px-6 py-8">
        <div className="max-w-sm mx-auto">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-20 h-16 mx-auto bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                <svg viewBox="0 0 100 60" className="w-16 h-10 text-white fill-current">
                  <rect x="10" y="20" width="80" height="25" rx="8" />
                  <rect x="15" y="25" width="15" height="8" rx="2" />
                  <rect x="35" y="25" width="15" height="8" rx="2" />
                  <rect x="55" y="25" width="15" height="8" rx="2" />
                  <circle cx="20" cy="50" r="6" />
                  <circle cx="80" cy="50" r="6" />
                  <rect x="5" y="15" width="90" height="8" rx="4" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-blue-900 tracking-wide">ECUATICKETS</h1>
          </div>

          {/* Formulario */}
          <FormDisabledProvider disabled={isLoading}>
            <LoginForm  isLoading={isLoading} />
          </FormDisabledProvider>

          {/* Loading spinner */}
          {isLoading && (
            <div className="flex justify-center mt-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-900" />
            </div>
          )}
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400 rounded-full transform -translate-x-8 translate-y-8"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-500 rounded-full transform translate-x-12 translate-y-12"></div>
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-blue-900 rounded-full transform -translate-x-1/2 translate-y-16"></div>
        </div>
      </div>
    </div>
  )
}
