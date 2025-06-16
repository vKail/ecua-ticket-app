const BASE_URL = "/route-sheets";

export const ROUTE_SHEETS_ROUTES = {
  search: `${BASE_URL}/search`,
  byId: (id: number) => `${BASE_URL}/${id}`,
  availableSeats: (id: number) => `${BASE_URL}/${id}/available-seats`,
  validate: (id: number) => `${BASE_URL}/${id}/validate`,
} as const;
