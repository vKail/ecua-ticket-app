import { signIn as signInClient } from "next-auth/react"; // Importa la versión del cliente
import { AuthLoginResponse } from "../types/auth-login-schema";

export const loginNextAuth = async (params: AuthLoginResponse) => {
  try {
    await signInClient("credentials", {
      id: params.data.user.id,
      name: params.data.user.person.name,
      surname: params.data.user.person.surname,
      dni: params.data.user.person.dni,
      email: params.data.user.person.email,
      username: params.data.user.username,
      password: params.data.user.password,
      role: params.data.user.role,
      accessToken: params.data.token,
      redirect: false,
    });
    return { status: "success", message: "Inicio de sesión exitoso" };
  } catch (error) {
    console.error("Login failed:", error);
    return { status: "error", message: "Error en el inicio de sesión" };
  }
};
