export const TICKET_SALES_QUERY_KEYS = {
  all: ["ticket-sales"] as const,
  routes: () => [...TICKET_SALES_QUERY_KEYS.all, "routes"] as const,
  routeSearch: (params: object) =>
    [...TICKET_SALES_QUERY_KEYS.routes(), { params }] as const,
  seats: () => [...TICKET_SALES_QUERY_KEYS.all, "seats"] as const,
  seatsByRoute: (routeSheetId: number) =>
    [...TICKET_SALES_QUERY_KEYS.seats(), routeSheetId] as const,
  qr: () => [...TICKET_SALES_QUERY_KEYS.all, "qr"] as const,
  qrByCode: (accessCode: string) =>
    [...TICKET_SALES_QUERY_KEYS.qr(), accessCode] as const,
} as const;
