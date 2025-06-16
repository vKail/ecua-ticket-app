"use client";

import { useQuery } from "@tanstack/react-query";
import { routeSheetsService } from "../../api/route-sheets.service";
import { TICKET_SALES_QUERY_KEYS } from "../../consts/query-keys";

export function useAvailableSeats(routeSheetId: number, enabled = true) {
  return useQuery({
    queryKey: TICKET_SALES_QUERY_KEYS.seatsByRoute(routeSheetId),
    queryFn: () => routeSheetsService.getAvailableSeats(routeSheetId),
    enabled: enabled && !!routeSheetId,
  });
}
