import { IntermediateStop } from "./IntermediateStop";

export interface Frequency {
  id: number;
  time: string;
  resolution: string;
  active: boolean;
  createdAt: string;
  companyId: number;
  company: {
    id: number;
    name: string;
  };
  originId: number;
  origin: {
    id: number;
    name: string;
    province: string;
  };
  destinationId: number;
  destination: {
    id: number;
    name: string;
    province: string;
  };
  stops: IntermediateStop[];
}
