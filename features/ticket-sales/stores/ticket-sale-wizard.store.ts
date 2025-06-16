import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  WizardStep,
  RouteSearchFormData,
  SeatSelectionState,
  PassengerInfoState,
  PaymentState,
  ConfirmationState,
  SaleContext,
  SaleType,
  StepValidation,
  FormValidation,
  TotalPricingCalculation,
  SeatInfo,
  PassengerFormData,
  PaymentFormData,
} from "../types/wizard-steps.types";

import {
  WIZARD_STEPS_ORDER,
  STORAGE_KEYS,
  PERSISTENCE_CONFIG,
} from "@/features/ticket-sales/consts/wizard-steps";
import { PassengerType, PaymentMethod } from "@/core/enums";

// ===== INITIAL STATES =====
const getInitialRouteSearchState = (): RouteSearchFormData => ({
  originId: null,
  destinationId: null,
  date: null,
  passengers: 1,
  companyId: undefined,
});

const getInitialSeatSelectionState = (): SeatSelectionState => ({
  availableSeats: [],
  selectedSeats: [],
  seatLayout: { rows: 0, columns: 0 },
  maxSeatsAllowed: 1,
  isLoadingSeats: false,
  seatsError: null,
});

const getInitialPassengerInfoState = (): PassengerInfoState => ({
  passengers: [],
  passengerPricing: {},
  isValidatingPassengers: false,
  validationErrors: {},
});

const getInitialPaymentState = (): PaymentState => ({
  paymentForm: null,
  totalPricing: null,
  isProcessingPayment: false,
  paymentError: null,
});

const getInitialConfirmationState = (): ConfirmationState => ({
  saleResult: null,
  isGeneratingTickets: false,
  confirmationError: null,
  reservationCode: null,
});

const getInitialValidation = (): FormValidation => ({
  isValid: false,
  errors: [],
  warnings: [],
});

const getInitialStepValidation = (): StepValidation => ({
  [WizardStep.ROUTE_SEARCH]: getInitialValidation(),
  [WizardStep.SEAT_SELECTION]: getInitialValidation(),
  [WizardStep.PASSENGER_INFO]: getInitialValidation(),
  [WizardStep.PAYMENT]: getInitialValidation(),
  [WizardStep.CONFIRMATION]: getInitialValidation(),
});

// ===== STORE INTERFACE =====
interface TicketSaleWizardState {
  // ===== CORE STATE =====
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  saleContext: SaleContext;

  // ===== STEP STATES =====
  routeSearch: {
    formData: RouteSearchFormData;
    availableRoutes: AvailableRoute[];
    selectedRoute: AvailableRoute | null;
    isSearching: boolean;
    searchError: string | null;
  };

  seatSelection: SeatSelectionState;
  passengerInfo: PassengerInfoState;
  payment: PaymentState;
  confirmation: ConfirmationState;

  // ===== VALIDATION =====
  stepValidation: StepValidation;

  // ===== COMPUTED STATE =====
  totalPricing: TotalPricingCalculation | null;

  // ===== ACTIONS =====
  // Wizard Navigation
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (step: WizardStep) => void;

  // Sale Context
  setSaleContext: (context: Partial<SaleContext>) => void;

  // Route Search Actions
  setRouteSearchData: (data: Partial<RouteSearchFormData>) => void;
  setAvailableRoutes: (routes: AvailableRoute[]) => void;
  selectRoute: (route: AvailableRoute) => void;
  setRouteSearchLoading: (isLoading: boolean) => void;
  setRouteSearchError: (error: string | null) => void;

  // Seat Selection Actions
  setAvailableSeats: (seats: SeatInfo[]) => void;
  selectSeat: (seat: SeatInfo) => void;
  deselectSeat: (seatId: number) => void;
  clearSelectedSeats: () => void;
  setSeatsLoading: (isLoading: boolean) => void;
  setSeatsError: (error: string | null) => void;

  // Passenger Info Actions
  addPassenger: (passenger: PassengerFormData) => void;
  updatePassenger: (index: number, data: Partial<PassengerFormData>) => void;
  removePassenger: (index: number) => void;
  setPassengerValidation: (index: number, errors: string[]) => void;
  setPassengersLoading: (isLoading: boolean) => void;

  // Payment Actions
  setPaymentForm: (data: Partial<PaymentFormData>) => void;
  setTotalPricing: (pricing: TotalPricingCalculation) => void;
  setPaymentLoading: (isLoading: boolean) => void;
  setPaymentError: (error: string | null) => void;

  // Confirmation Actions
  setSaleResult: (result: PaymentInfo) => void;
  setConfirmationLoading: (isLoading: boolean) => void;
  setConfirmationError: (error: string | null) => void;

  // Validation Actions
  setStepValidation: (step: WizardStep, validation: FormValidation) => void;
  validateCurrentStep: () => boolean;

  // Utility Actions
  canProceedToStep: (step: WizardStep) => boolean;
  getStepProgress: () => number;
  resetWizard: () => void;
  resetFromStep: (step: WizardStep) => void;

  // Computed Getters
  getTotalAmount: () => number;
  getSelectedSeatsCount: () => number;
  getPassengersCount: () => number;
  isStepCompleted: (step: WizardStep) => boolean;
}

// ===== STORE IMPLEMENTATION =====
export const useTicketSaleWizardStore = create<TicketSaleWizardState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ===== INITIAL STATE =====
        currentStep: WizardStep.ROUTE_SEARCH,
        completedSteps: [],
        saleContext: {
          saleType: SaleType.COUNTER,
          clerkId: undefined,
          customerId: undefined,
          companyId: 1, // Default company
        },

        routeSearch: {
          formData: getInitialRouteSearchState(),
          availableRoutes: [],
          selectedRoute: null,
          isSearching: false,
          searchError: null,
        },

        seatSelection: getInitialSeatSelectionState(),
        passengerInfo: getInitialPassengerInfoState(),
        payment: getInitialPaymentState(),
        confirmation: getInitialConfirmationState(),
        stepValidation: getInitialStepValidation(),
        totalPricing: null,

        // ===== WIZARD NAVIGATION =====
        setStep: (step) =>
          set((state) => {
            if (get().canProceedToStep(step)) {
              state.currentStep = step;
            }
          }),

        nextStep: () =>
          set((state) => {
            const currentIndex = WIZARD_STEPS_ORDER.indexOf(state.currentStep);
            const nextIndex = currentIndex + 1;
            if (nextIndex < WIZARD_STEPS_ORDER.length) {
              const nextStep = WIZARD_STEPS_ORDER[nextIndex];
              if (get().canProceedToStep(nextStep)) {
                state.currentStep = nextStep;
              }
            }
          }),

        previousStep: () =>
          set((state) => {
            const currentIndex = WIZARD_STEPS_ORDER.indexOf(state.currentStep);
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
              state.currentStep = WIZARD_STEPS_ORDER[prevIndex];
            }
          }),

        completeStep: (step) =>
          set((state) => {
            if (!state.completedSteps.includes(step)) {
              state.completedSteps.push(step);
            }
          }),

        // ===== SALE CONTEXT =====
        setSaleContext: (context) =>
          set((state) => {
            Object.assign(state.saleContext, context);
          }),

        // ===== ROUTE SEARCH ACTIONS =====
        setRouteSearchData: (data) =>
          set((state) => {
            Object.assign(state.routeSearch.formData, data);
            // Reset dependent states when search criteria changes
            if (data.originId || data.destinationId || data.date) {
              state.routeSearch.selectedRoute = null;
              state.routeSearch.availableRoutes = [];
              state.seatSelection = getInitialSeatSelectionState();
              state.passengerInfo = getInitialPassengerInfoState();
              state.payment = getInitialPaymentState();
            }
          }),

        setAvailableRoutes: (routes) =>
          set((state) => {
            state.routeSearch.availableRoutes = routes;
          }),

        selectRoute: (route) =>
          set((state) => {
            state.routeSearch.selectedRoute = route;
            // Update max seats allowed based on route capacity
            state.seatSelection.maxSeatsAllowed =
              state.routeSearch.formData.passengers;
            // Reset dependent states
            state.seatSelection.selectedSeats = [];
            state.passengerInfo.passengers = [];
          }),

        setRouteSearchLoading: (isLoading) =>
          set((state) => {
            state.routeSearch.isSearching = isLoading;
          }),

        setRouteSearchError: (error) =>
          set((state) => {
            state.routeSearch.searchError = error;
          }),

        // ===== SEAT SELECTION ACTIONS =====
        setAvailableSeats: (seats) =>
          set((state) => {
            state.seatSelection.availableSeats = seats;
          }),

        selectSeat: (seat) =>
          set((state) => {
            const { selectedSeats, maxSeatsAllowed } = state.seatSelection;

            if (
              selectedSeats.length < maxSeatsAllowed &&
              !selectedSeats.find((s) => s.id === seat.id)
            ) {
              state.seatSelection.selectedSeats.push({
                ...seat,
                isSelected: true,
              });

              // Auto-generate passenger data for new seat
              const passengerIndex = selectedSeats.length;
              const newPassenger: PassengerFormData = {
                passengerId: "",
                firstName: "",
                lastName: "",
                documentType: "CI",
                documentNumber: "",
                email: passengerIndex === 0 ? "" : undefined,
                phone: passengerIndex === 0 ? "" : undefined,
                passengerType: PassengerType.NORMAL,
                physicalSeatId: seat.id,
                seatNumber: seat.seatNumber,
              };
              state.passengerInfo.passengers.push(newPassenger);
            }
          }),

        deselectSeat: (seatId) =>
          set((state) => {
            const seatIndex = state.seatSelection.selectedSeats.findIndex(
              (s) => s.id === seatId
            );
            if (seatIndex !== -1) {
              state.seatSelection.selectedSeats.splice(seatIndex, 1);
              // Remove corresponding passenger
              const passengerIndex = state.passengerInfo.passengers.findIndex(
                (p) => p.physicalSeatId === seatId
              );
              if (passengerIndex !== -1) {
                state.passengerInfo.passengers.splice(passengerIndex, 1);
              }
            }
          }),

        clearSelectedSeats: () =>
          set((state) => {
            state.seatSelection.selectedSeats = [];
            state.passengerInfo.passengers = [];
          }),

        setSeatsLoading: (isLoading) =>
          set((state) => {
            state.seatSelection.isLoadingSeats = isLoading;
          }),

        setSeatsError: (error) =>
          set((state) => {
            state.seatSelection.seatsError = error;
          }),

        // ===== PASSENGER INFO ACTIONS =====
        addPassenger: (passenger) =>
          set((state) => {
            state.passengerInfo.passengers.push(passenger);
          }),

        updatePassenger: (index, data) =>
          set((state) => {
            if (state.passengerInfo.passengers[index]) {
              Object.assign(state.passengerInfo.passengers[index], data);
            }
          }),

        removePassenger: (index) =>
          set((state) => {
            state.passengerInfo.passengers.splice(index, 1);
          }),

        setPassengerValidation: (index, errors) =>
          set((state) => {
            state.passengerInfo.validationErrors[index] = errors;
          }),

        setPassengersLoading: (isLoading) =>
          set((state) => {
            state.passengerInfo.isValidatingPassengers = isLoading;
          }),

        // ===== PAYMENT ACTIONS =====
        setPaymentForm: (data) =>
          set((state) => {
            if (!state.payment.paymentForm) {
              state.payment.paymentForm = {
                paymentMethod: PaymentMethod.CASH,
                agreesToTerms: false,
                contactEmail: "",
                contactPhone: "",
              };
            }
            Object.assign(state.payment.paymentForm, data);
          }),

        setTotalPricing: (pricing) =>
          set((state) => {
            state.totalPricing = pricing;
            state.payment.totalPricing = {
              subtotal: pricing.subtotal,
              taxes: pricing.taxes,
              discounts: pricing.totalDiscounts,
              total: pricing.finalTotal,
              breakdown: pricing.passengersBreakdown.map((p) => ({
                description: `${p.seatInfo.seatNumber} - ${p.passengerType}`,
                amount: p.finalPrice,
              })),
            };
          }),

        setPaymentLoading: (isLoading) =>
          set((state) => {
            state.payment.isProcessingPayment = isLoading;
          }),

        setPaymentError: (error) =>
          set((state) => {
            state.payment.paymentError = error;
          }),

        // ===== CONFIRMATION ACTIONS =====
        setSaleResult: (result) =>
          set((state) => {
            state.confirmation.saleResult = result;
            state.confirmation.reservationCode = `RES-${result.id
              .toString()
              .padStart(6, "0")}`;
          }),

        setConfirmationLoading: (isLoading) =>
          set((state) => {
            state.confirmation.isGeneratingTickets = isLoading;
          }),

        setConfirmationError: (error) =>
          set((state) => {
            state.confirmation.confirmationError = error;
          }),

        // ===== VALIDATION ACTIONS =====
        setStepValidation: (step, validation) =>
          set((state) => {
            state.stepValidation[step] = validation;
          }),

        validateCurrentStep: () => {
          const state = get();
          return state.stepValidation[state.currentStep]?.isValid ?? false;
        },

        // ===== UTILITY ACTIONS =====
        canProceedToStep: (targetStep) => {
          const state = get();
          const currentStepIndex = WIZARD_STEPS_ORDER.indexOf(
            state.currentStep
          );
          const targetStepIndex = WIZARD_STEPS_ORDER.indexOf(targetStep);

          // Can always go backwards
          if (targetStepIndex <= currentStepIndex) {
            return true;
          }

          // Can only proceed if all previous steps are completed
          for (let i = 0; i < targetStepIndex; i++) {
            const step = WIZARD_STEPS_ORDER[i];
            if (!state.completedSteps.includes(step)) {
              return false;
            }
          }

          return true;
        },

        getStepProgress: () => {
          const state = get();
          const currentIndex = WIZARD_STEPS_ORDER.indexOf(state.currentStep);
          return ((currentIndex + 1) / WIZARD_STEPS_ORDER.length) * 100;
        },

        resetWizard: () =>
          set((state) => {
            state.currentStep = WizardStep.ROUTE_SEARCH;
            state.completedSteps = [];
            state.routeSearch = {
              formData: getInitialRouteSearchState(),
              availableRoutes: [],
              selectedRoute: null,
              isSearching: false,
              searchError: null,
            };
            state.seatSelection = getInitialSeatSelectionState();
            state.passengerInfo = getInitialPassengerInfoState();
            state.payment = getInitialPaymentState();
            state.confirmation = getInitialConfirmationState();
            state.stepValidation = getInitialStepValidation();
            state.totalPricing = null;
          }),

        resetFromStep: (step) =>
          set((state) => {
            const stepIndex = WIZARD_STEPS_ORDER.indexOf(step);

            // Remove completed steps from the target step onwards
            state.completedSteps = state.completedSteps.filter(
              (s) => WIZARD_STEPS_ORDER.indexOf(s) < stepIndex
            );

            // Reset state for affected steps
            if (
              stepIndex <= WIZARD_STEPS_ORDER.indexOf(WizardStep.SEAT_SELECTION)
            ) {
              state.seatSelection = getInitialSeatSelectionState();
            }
            if (
              stepIndex <= WIZARD_STEPS_ORDER.indexOf(WizardStep.PASSENGER_INFO)
            ) {
              state.passengerInfo = getInitialPassengerInfoState();
            }
            if (stepIndex <= WIZARD_STEPS_ORDER.indexOf(WizardStep.PAYMENT)) {
              state.payment = getInitialPaymentState();
            }
            if (
              stepIndex <= WIZARD_STEPS_ORDER.indexOf(WizardStep.CONFIRMATION)
            ) {
              state.confirmation = getInitialConfirmationState();
            }
          }),

        // ===== COMPUTED GETTERS =====
        getTotalAmount: () => {
          const state = get();
          return state.totalPricing?.finalTotal ?? 0;
        },

        getSelectedSeatsCount: () => {
          const state = get();
          return state.seatSelection.selectedSeats.length;
        },

        getPassengersCount: () => {
          const state = get();
          return state.passengerInfo.passengers.length;
        },

        isStepCompleted: (step) => {
          const state = get();
          return state.completedSteps.includes(step);
        },
      })),
      {
        name: STORAGE_KEYS.WIZARD_STATE,
        partialize: (state) => {
          // Exclude certain fields from persistence
          const { ...persistedState } = state;
          PERSISTENCE_CONFIG.EXCLUDE_FIELDS.forEach((field) => {
            const keys = field.split(".");
            let obj = persistedState as any;
            for (let i = 0; i < keys.length - 1; i++) {
              obj = obj[keys[i]];
              if (!obj) break;
            }
            if (obj) {
              delete obj[keys[keys.length - 1]];
            }
          });
          return persistedState;
        },
      }
    ),
    { name: "ticket-sale-wizard-store" }
  )
);
