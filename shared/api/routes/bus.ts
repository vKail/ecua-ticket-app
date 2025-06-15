export const BUS_ROUTES = {
  base: "/buses",
  byId: (id: number) => `/buses/${id}`,
  changeStatus: (id: number) => `/buses/${id}/change-status`,
} as const;
