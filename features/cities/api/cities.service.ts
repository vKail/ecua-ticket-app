import { apiClient } from "@/shared/api/client";
import {
  GetCitiesResponse,
  GetCityRequest,
  GetCityResponse,
  CreateCityRequest,
  UpdateCityRequest,
  GetCitiesRequest,
  CreateCityResponse,
  UpdateCityResponse,
} from "../types";
import { CITY_ROUTES } from "@/shared/api/routes/city";

async function getCities(params?: GetCitiesRequest) {
  const { data } = await apiClient.get<GetCitiesResponse>(CITY_ROUTES.base, {
    params: { page: 1, limit: 100 },
  });

  return data;
}

async function getCity(params: GetCityRequest) {
  const { data } = await apiClient.get<GetCityResponse>(
    CITY_ROUTES.byId(params.params.id)
  );
  return data;
}

async function createCity(req: CreateCityRequest) {
  const { data } = await apiClient.post<CreateCityResponse>(
    CITY_ROUTES.base,
    req
  );
  return data;
}

async function updateCity(req: UpdateCityRequest) {
  const { data } = await apiClient.patch<UpdateCityResponse>(
    CITY_ROUTES.byId(req.params.id),
    req.body
  );
  return data;
}

export const citiesService = {
  getCities,
  getCity,
  createCity,
  updateCity,
};
