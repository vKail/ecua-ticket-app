import { useMutation, useQueryClient } from "@tanstack/react-query";
import { citiesService } from "@/features/cities/api/cities.service";
import { CITY_QUERY_KEYS } from "@/features/cities/consts/query-keys";
import type { CreateCityRequest } from "@/features/cities/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCreateCity() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (req: CreateCityRequest) => citiesService.createCity(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITY_QUERY_KEYS.lists() });
      toast.success("Ciudad creada correctamente");
      router.push("/dashboard/cities");
    },
  });
}
