"use client";

import { useQuery } from "@tanstack/react-query";
import { routeSheetsService } from "../../api/route-sheets.service";
import { TICKET_SALES_QUERY_KEYS } from "../../consts/query-keys";

export function useQRGeneration(accessCode: string, enabled = true) {
  return useQuery({
    queryKey: TICKET_SALES_QUERY_KEYS.qrByCode(accessCode),
    queryFn: () => routeSheetsService.generateQR(accessCode),
    enabled: enabled && !!accessCode,
  });
}
