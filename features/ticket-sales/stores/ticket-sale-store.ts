import { create } from "zustand";
import type { RouteSearchData } from "../components/route-selector";
import type { RouteOption } from "../components/route-list";
import type { Seat } from "../components/seat-selector";
import type { PassengerData } from "../components/passenger-form";
import type { ConfirmationData } from "../components/confirmation";
import { City } from "@/core/models/City";

export interface TicketSaleState {
  // Current step (0-5)
  currentStep: number;

  // Step 1: Route Search
  routeSearch: RouteSearchData | null;
  originCity: City | null;
  destinationCity: City | null;

  // Step 2: Route Selection
  availableRoutes: RouteOption[];
  selectedRoute: RouteOption | null;
  routesLoading: boolean;
  routesError: string | null;

  // Step 3: Seat Selection
  availableSeats: Seat[];
  selectedSeats: Seat[];
  seatsLoading: boolean;
  seatsError: string | null;

  // Step 4: Passenger Data
  passengers: PassengerData[];

  // Step 5: Payment & Confirmation
  paymentLoading: boolean;
  paymentError: string | null;
  confirmationData: ConfirmationData | null;

  // Cities for autocomplete
  cities: City[];
  citiesLoading: boolean;
}

export interface TicketSaleActions {
  // Navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetFlow: () => void;

  // Route Search (Step 1)
  setRouteSearch: (data: RouteSearchData) => void;
  setCities: (cities: City[]) => void;
  setCitiesLoading: (loading: boolean) => void;
  setOriginCity: (city: City | null) => void;
  setDestinationCity: (city: City | null) => void;

  // Route Selection (Step 2)
  setAvailableRoutes: (routes: RouteOption[]) => void;
  setSelectedRoute: (route: RouteOption) => void;
  setRoutesLoading: (loading: boolean) => void;
  setRoutesError: (error: string | null) => void;

  // Seat Selection (Step 3)
  setAvailableSeats: (seats: Seat[]) => void;
  setSelectedSeats: (seats: Seat[]) => void;
  toggleSeat: (seat: Seat) => void;
  setSeatsLoading: (loading: boolean) => void;
  setSeatsError: (error: string | null) => void;

  // Passenger Data (Step 4)
  setPassengers: (passengers: PassengerData[]) => void;
  updatePassenger: (index: number, data: Partial<PassengerData>) => void;
  initializePassengers: () => void;

  // Payment & Confirmation (Step 5)
  setPaymentLoading: (loading: boolean) => void;
  setPaymentError: (error: string | null) => void;
  setConfirmationData: (data: ConfirmationData) => void;
}

const initialState: TicketSaleState = {
  currentStep: 0,
  routeSearch: null,
  originCity: null,
  destinationCity: null,
  availableRoutes: [],
  selectedRoute: null,
  routesLoading: false,
  routesError: null,
  availableSeats: [],
  selectedSeats: [],
  seatsLoading: false,
  seatsError: null,
  passengers: [],
  paymentLoading: false,
  paymentError: null,
  confirmationData: null,
  cities: [],
  citiesLoading: false,
};

export const useTicketSaleStore = create<TicketSaleState & TicketSaleActions>(
  (set, get) => ({
    ...initialState,

    // Navigation
    setCurrentStep: (step: number) => set({ currentStep: step }),

    nextStep: () => {
      const { currentStep } = get();
      if (currentStep < 5) {
        set({ currentStep: currentStep + 1 });
      }
    },

    previousStep: () => {
      const { currentStep } = get();
      if (currentStep > 0) {
        set({ currentStep: currentStep - 1 });
      }
    },

    resetFlow: () => set(initialState),

    // Route Search (Step 1)
    setRouteSearch: (data: RouteSearchData) => set({ routeSearch: data }),

    setCities: (cities: City[]) => set({ cities }),

    setCitiesLoading: (loading: boolean) => set({ citiesLoading: loading }),

    setOriginCity: (city: City | null) => set({ originCity: city }),

    setDestinationCity: (city: City | null) => set({ destinationCity: city }),

    // Route Selection (Step 2)
    setAvailableRoutes: (routes: RouteOption[]) =>
      set({ availableRoutes: routes }),

    setSelectedRoute: (route: RouteOption) => set({ selectedRoute: route }),

    setRoutesLoading: (loading: boolean) => set({ routesLoading: loading }),

    setRoutesError: (error: string | null) => set({ routesError: error }),

    // Seat Selection (Step 3)
    setAvailableSeats: (seats: Seat[]) => set({ availableSeats: seats }),

    setSelectedSeats: (seats: Seat[]) => set({ selectedSeats: seats }),

    toggleSeat: (seat: Seat) => {
      const { selectedSeats, routeSearch } = get();
      const isSelected = selectedSeats.some((s) => s.id === seat.id);
      const maxSeats = routeSearch?.passengers || 1;

      if (isSelected) {
        set({ selectedSeats: selectedSeats.filter((s) => s.id !== seat.id) });
      } else if (selectedSeats.length < maxSeats) {
        set({ selectedSeats: [...selectedSeats, seat] });
      }
    },

    setSeatsLoading: (loading: boolean) => set({ seatsLoading: loading }),

    setSeatsError: (error: string | null) => set({ seatsError: error }),

    // Passenger Data (Step 4)
    setPassengers: (passengers: PassengerData[]) => set({ passengers }),

    updatePassenger: (index: number, data: Partial<PassengerData>) => {
      const { passengers } = get();
      if (passengers[index]) {
        const updatedPassengers = [...passengers];
        updatedPassengers[index] = { ...updatedPassengers[index], ...data };
        set({ passengers: updatedPassengers });
      }
    },

    initializePassengers: () => {
      const { selectedSeats } = get();
      const initialPassengers = selectedSeats.map((seat, index) => ({
        id: `passenger-${index}`,
        firstName: "",
        lastName: "",
        documentType: "",
        documentNumber: "",
        email: index === 0 ? "" : undefined,
        phone: index === 0 ? "" : undefined,
        seatNumber: seat.number,
      }));
      set({ passengers: initialPassengers });
    },

    // Payment & Confirmation (Step 5)
    setPaymentLoading: (loading: boolean) => set({ paymentLoading: loading }),

    setPaymentError: (error: string | null) => set({ paymentError: error }),

    setConfirmationData: (data: ConfirmationData) =>
      set({ confirmationData: data }),
  })
);
