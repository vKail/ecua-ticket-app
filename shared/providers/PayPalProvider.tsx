"use client";

import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PayPalProviderProps {
  children: React.ReactNode;
  clientId?: string;
  currency?: string;
}

export function PayPalProvider({
  children,
  clientId,
  currency = "USD",
}: PayPalProviderProps) {
  const paypalClientId = clientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    // En desarrollo, podemos mostrar una advertencia sin romper la app
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "PayPal Client ID not found. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID environment variable."
      );
    }
    return <>{children}</>;
  }

  const initialOptions = {
    clientId: paypalClientId,
    currency: currency,
    intent: "capture",
    "enable-funding": "venmo,paylater",
    "disable-funding": "",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
