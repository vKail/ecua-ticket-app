export const CITY_QUERY_KEYS = {
  all: ["cities"] as const,
  lists: () => [...CITY_QUERY_KEYS.all, "list"] as const,
  list: (filters: object) => [...CITY_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...CITY_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...CITY_QUERY_KEYS.details(), id] as const,
};
