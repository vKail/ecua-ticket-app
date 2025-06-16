"use client";

import { useQuery } from "@tanstack/react-query";
import { routeSheetsService } from "../../api/route-sheets.service";
import { TICKET_SALES_QUERY_KEYS } from "../../consts/query-keys";
import type { SearchRoutesRequest } from "../../types/route-sheets";

export function useRouteSearch(params: SearchRoutesRequest, enabled = true) {
  return useQuery({
    queryKey: TICKET_SALES_QUERY_KEYS.routeSearch(params),
    queryFn: () => routeSheetsService.searchRoutes(params),
    enabled:
      enabled && !!params.originId && !!params.destinationId && !!params.date,
  });
}
