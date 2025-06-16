import { DefaultOptions } from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;
