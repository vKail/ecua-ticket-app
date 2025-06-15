export const USER_ROUTES = {
  base: "/users",
  byId: (id: string | number) => `/users/${id}`,
} as const;
