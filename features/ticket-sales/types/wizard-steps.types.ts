import { PassengerType } from "@/core/enums/PassengerType.enum";
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import { Payment } from "@/core/models/Payment";
import { PhysicalSeat } from "@/core/models/PhysicalSeat";
import { RouteSheet } from "@/core/models/RouteSheet";

export interface SeatPricing {
  basePrice: number;
  seatTypeMultiplier: number;
  finalPrice: number;
}

export interface PassengerPricing {
  basePrice: number;
  discount: number;
  finalPrice: number;
  discountPercentage: number;
}

export interface TotalPricing {
  subtotal: number;
  taxes: number;
  discounts: number;
  total: number;
  breakdown: Array<{
    description: string;
    amount: number;
  }>;
}

export enum WizardStep {
  ROUTE_SEARCH = "route-search",
  SEAT_SELECTION = "seat-selection",
  PASSENGER_INFO = "passenger-info",
  PAYMENT = "payment",
  CONFIRMATION = "confirmation",
}

export interface WizardStepConfig {
  key: WizardStep;
  title: string;
  description: string;
  icon: string;
  isOptional: boolean;
}

// ===== ROUTE SEARCH STEP =====
export interface RouteSearchFormData {
  originId: number | null;
  destinationId: number | null;
  date: Date | null;
  passengers: number;
  companyId?: number;
}

export interface AvailableRoute {
  routeSheet: RouteSheet;
  availableSeats: number;
  basePrice: number;
  estimatedDuration: string;
}

export interface RouteSearchState {
  searchCriteria: RouteSearchFormData | null;
  availableRoutes: AvailableRoute[];
  selectedRoute: AvailableRoute | null;
  isSearching: boolean;
  searchError: string | null;
}

// ===== SEAT SELECTION STEP =====
export interface SeatSelectionFormData {
  selectedSeatIds: number[];
}

export interface SeatLayoutConfig {
  rows: number;
  columns: number;
  aisleAfterColumn?: number;
  hasUpperDeck?: boolean;
}

export interface SeatInfo extends PhysicalSeat {
  isSelected: boolean;
  isAvailable: boolean;
  pricing: SeatPricing[];
}

export interface SeatSelectionState {
  availableSeats: SeatInfo[];
  selectedSeats: SeatInfo[];
  seatLayout: SeatLayoutConfig;
  maxSeatsAllowed: number;
  isLoadingSeats: boolean;
  seatsError: string | null;
}

// ===== PASSENGER INFO STEP =====
export interface PassengerFormData {
  passengerId: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email?: string;
  phone?: string;
  passengerType: PassengerType;
  physicalSeatId: number;
  seatNumber: string;
}

export interface PassengerInfoState {
  passengers: PassengerFormData[];
  passengerPricing: Record<number, PassengerPricing>;
  isValidatingPassengers: boolean;
  validationErrors: Record<number, string[]>;
}

// ===== PAYMENT STEP =====
export interface PaymentFormData {
  paymentMethod: PaymentMethod;
  bankReference?: string;
  paypalTransactionId?: string;
  receiptFile?: File;
  agreesToTerms: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface PaymentState {
  paymentForm: PaymentFormData | null;
  totalPricing: TotalPricingCalculation | null;
  isProcessingPayment: boolean;
  paymentError: string | null;
}

// ===== CONFIRMATION STEP =====
export interface ConfirmationState {
  saleResult: Payment | null;
  isGeneratingTickets: boolean;
  confirmationError: string | null;
  reservationCode: string | null;
}

// ===== FORM VALIDATION =====
export interface FormValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StepValidation {
  [WizardStep.ROUTE_SEARCH]: FormValidation;
  [WizardStep.SEAT_SELECTION]: FormValidation;
  [WizardStep.PASSENGER_INFO]: FormValidation;
  [WizardStep.PAYMENT]: FormValidation;
  [WizardStep.CONFIRMATION]: FormValidation;
}

// ===== WIZARD CONTEXT =====
export interface WizardContextData {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  canProceedToStep: (step: WizardStep) => boolean;
  isStepAccessible: (step: WizardStep) => boolean;
  getStepProgress: () => number;
}

// ===== SALE TYPES =====
export enum SaleType {
  COUNTER = "counter",
  ONLINE = "online",
}

export interface SaleContext {
  saleType: SaleType;
  clerkId?: number;
  customerId?: number;
  companyId: number;
}

// ===== ERROR HANDLING =====
export interface WizardError {
  step: WizardStep;
  type: "validation" | "api" | "business";
  message: string;
  details?: Record<string, any>;
}

// ===== PERSISTENCE =====
export interface WizardPersistenceConfig {
  enabled: boolean;
  storageKey: string;
  expirationMinutes: number;
  excludeFields: string[];
}

// ===== PRICING CALCULATIONS =====
export interface PricingBreakdown {
  passengerIndex: number;
  seatInfo: SeatInfo;
  passengerType: PassengerType;
  basePrice: number;
  seatTypeMultiplier: number;
  passengerDiscount: number;
  finalPrice: number;
}

export interface TotalPricingCalculation {
  passengersBreakdown: PricingBreakdown[];
  subtotal: number;
  totalDiscounts: number;
  taxes: number;
  finalTotal: number;
  currency: string;
}
