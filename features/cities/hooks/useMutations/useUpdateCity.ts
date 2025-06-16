import { useMutation, useQueryClient } from "@tanstack/react-query";
import { citiesService } from "@/features/cities/api/cities.service";
import { CITY_QUERY_KEYS } from "@/features/cities/consts/query-keys";
import type { UpdateCityRequest } from "@/features/cities/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateCity() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (req: UpdateCityRequest) => citiesService.updateCity(req),
    onSuccess: (_, req) => {
      queryClient.invalidateQueries({
        queryKey: CITY_QUERY_KEYS.detail(req.params.id),
      });
      queryClient.invalidateQueries({ queryKey: CITY_QUERY_KEYS.lists() });
      toast.success("Ciudad actualizada correctamente");
      router.push("/dashboard/cities");
    },
  });
}
