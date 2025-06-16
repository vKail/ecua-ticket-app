export const CITY_ROUTES = {
  base: "/cities",
  byId: (id: number) => `/cities/${id}`,
  changeStatus: (id: number) => `/cities/${id}/change-status`,
} as const;
