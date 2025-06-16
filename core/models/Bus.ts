export interface Bus {
  id: number;
  internalNumber: string;
  licensePlate: string;
  chassisBrand: string;
  bodyBrand: string;
  photoUrl?: string;
  isActive: boolean;
  companyId: number;
}
