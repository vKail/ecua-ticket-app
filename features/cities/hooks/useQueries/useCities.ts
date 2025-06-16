import { useQuery } from "@tanstack/react-query";
import { citiesService } from "@/features/cities/api/cities.service";
import { CITY_QUERY_KEYS } from "@/features/cities/consts/query-keys";
import type { GetCitiesRequest } from "@/features/cities/types";

export function useCities(params?: GetCitiesRequest) {
  return useQuery({
    queryKey: CITY_QUERY_KEYS.list(params ?? {}),
    queryFn: () => citiesService.getCities(params),
  });
}
