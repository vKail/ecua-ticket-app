"use client";

import { useQuery } from "@tanstack/react-query";
import { routeSheetsService } from "../../api/route-sheets.service";
import { TICKET_SALES_QUERY_KEYS } from "../../consts/query-keys";

export interface SearchRoutesRequest {
  originId: number;
  destinationId: number;
  date: string;
}

export function useRouteSearch(params?: SearchRoutesRequest, enabled = true) {
  return useQuery({
    queryKey: params
      ? TICKET_SALES_QUERY_KEYS.routeSearch(params)
      : ["route-search-empty"],
    queryFn: () => {
      if (!params) throw new Error("No hay parámetros de búsqueda");
      return routeSheetsService.searchRoutes(params);
    },
    enabled: enabled && !!params,
  });
}
