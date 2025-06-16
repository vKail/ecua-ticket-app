import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { createCitySchema } from "../types/create-city-schema";
import type { CreateCityRequest, UpdateCityRequest } from "../types";
import { useCreateCity } from "./useMutations/useCreateCity";
import { useUpdateCity } from "./useMutations/useUpdateCity";

interface UseCityFormProps {
  defaultValues?: Partial<CreateCityRequest>;
  isEdit?: boolean;
}

interface UseCityFormReturn {
  form: UseFormReturn<CreateCityRequest>;
  onSubmit: (data: CreateCityRequest) => void;
  onCancel: () => void;
}

export function useCityForm({
  defaultValues,
  isEdit,
}: UseCityFormProps): UseCityFormReturn {
  const params = useParams();
  const router = useRouter();
  const form = useForm<CreateCityRequest>({
    resolver: zodResolver(createCitySchema.body),
    mode: "onChange",
    defaultValues: {
      name: "",
      province: "",
      ...defaultValues,
    },
  });

  const createCityMutation = useCreateCity();
  const updateCityMutation = useUpdateCity();

  function onSubmit(data: CreateCityRequest) {
    if (isEdit && params.id) {
      updateCityMutation.mutate({
        params: { id: Number(params.id) },
        body: data,
      } as UpdateCityRequest);
    } else {
      createCityMutation.mutate(data);
    }
  }

  function onCancel() {
    router.back();
  }

  return { form, onSubmit, onCancel };
}
