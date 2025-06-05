"use client";

import { signOut } from "next-auth/react";

export const logoutNextAuth = async () => {
  try {
    await signOut({ redirect: false });
    return { status: "success", message: "Sesión cerrada exitosamente" };
  } catch (error) {
    console.error("Logout failed:", error);
    return { status: "error", message: "Error al cerrar sesión" };
  }
};