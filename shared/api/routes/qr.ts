const BASE_URL = "/qr";

export const QR_ROUTES = {
  generate: (accessCode: string) => `${BASE_URL}/generate/${accessCode}`,
} as const;
