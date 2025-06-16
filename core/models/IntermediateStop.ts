import { City } from "./City";

export interface IntermediateStop {
  id: number;
  order: number;
  frequencyId: number;
  cityId: number;
  city: City;
}
