import { useQuery } from "@tanstack/react-query";
import { citiesService } from "@/features/cities/api/cities.service";
import { CITY_QUERY_KEYS } from "@/features/cities/consts/query-keys";
import type { GetCityRequest } from "@/features/cities/types";

export function useCity(req: GetCityRequest) {
  return useQuery({
    queryKey: CITY_QUERY_KEYS.detail(req.params.id),
    queryFn: () => citiesService.getCity(req),
    enabled: !!req.params.id,
    throwOnError: false,
  });
}
