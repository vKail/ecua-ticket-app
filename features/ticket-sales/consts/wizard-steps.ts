import {
  WizardStep,
  WizardStepConfig,
} from "@/features/ticket-sales/types/wizard-steps.types";

export const WIZARD_STEPS_CONFIG: Record<WizardStep, WizardStepConfig> = {
  [WizardStep.ROUTE_SEARCH]: {
    key: WizardStep.ROUTE_SEARCH,
    title: "Buscar Ruta",
    description: "Selecciona origen, destino y fecha de viaje",
    icon: "search",
    isOptional: false,
  },
  [WizardStep.SEAT_SELECTION]: {
    key: WizardStep.SEAT_SELECTION,
    title: "Seleccionar Asientos",
    description: "Elige los asientos para tu viaje",
    icon: "seat",
    isOptional: false,
  },
  [WizardStep.PASSENGER_INFO]: {
    key: WizardStep.PASSENGER_INFO,
    title: "Datos de Pasajeros",
    description: "Completa la información de los pasajeros",
    icon: "user",
    isOptional: false,
  },
  [WizardStep.PAYMENT]: {
    key: WizardStep.PAYMENT,
    title: "Pago",
    description: "Selecciona método de pago y completa la transacción",
    icon: "credit-card",
    isOptional: false,
  },
  [WizardStep.CONFIRMATION]: {
    key: WizardStep.CONFIRMATION,
    title: "Confirmación",
    description: "Confirmación de compra y detalles del viaje",
    icon: "check-circle",
    isOptional: false,
  },
};

export const WIZARD_STEPS_ORDER: WizardStep[] = [
  WizardStep.ROUTE_SEARCH,
  WizardStep.SEAT_SELECTION,
  WizardStep.PASSENGER_INFO,
  WizardStep.PAYMENT,
  WizardStep.CONFIRMATION,
];
