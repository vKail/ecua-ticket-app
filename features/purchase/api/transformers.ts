import type { RouteSearchData } from "../../ticket-sales/components/route-selector";
import type { RouteOption } from "../../ticket-sales/components/route-list";
import type { Seat } from "../../ticket-sales/components/seat-selector";
import type { PassengerData } from "../../ticket-sales/components/passenger-form";

import { City } from "@/core/models/City";
import { PassengerType } from "@/core/enums/PassengerType.enum";
import {
  PhysicalSeatResponse,
  RouteSheetResponse,
  SearchRoutesRequest,
} from "../types";

// Transform frontend search data to backend request format
export function transformSearchRequest(
  searchData: RouteSearchData,
  originCity: City,
  destinationCity: City
): SearchRoutesRequest {
  return {
    originId: originCity.id,
    destinationId: destinationCity.id,
    date: searchData.date ? searchData.date.toISOString() : "",
  };
}

// Transform backend route sheet to frontend route option
export function transformRouteSheetToOption(
  routeSheet: RouteSheetResponse
): RouteOption {
  const { frequency, bus } = routeSheet;

  // Calcular duración si es necesario (no está en la nueva estructura, así que se omite o se calcula si hay datos)
  // Suponiendo que solo tenemos la hora de salida
  // const durationText = 'N/A' // O puedes calcularlo si tienes arrivalTime

  // Obtener precio del primer segmento
  const normalPrice = frequency.segmentPrices[0]?.price || 0;

  return {
    id: routeSheet.id.toString(),
    origin: frequency.origin.name,
    destination: frequency.destination.name,
    departureTime: frequency.time,
    arrivalTime: "", // No hay arrivalTime en la nueva estructura
    duration: "", // No hay duración en la nueva estructura
    price: normalPrice,
    availableSeats: 0, // No hay availableSeats en la nueva estructura, ajustar si lo agregas
    busType: mapBusType(bus.bodyBrand), // Usar mapBusType para asegurar el tipo correcto
    busCompany: frequency.company.name,
    busCompanyLogo: frequency.company.logoUrl || undefined,
  };
}

// Transform backend physical seat to frontend seat
export function transformPhysicalSeatToSeat(
  physicalSeat: PhysicalSeatResponse,
  segmentPrice: number
): Seat {
  return {
    id: physicalSeat.id.toString(),
    number: physicalSeat.seatNumber,
    position: {
      row: physicalSeat.row,
      col: physicalSeat.column,
    },
    status: physicalSeat.isTaken ? "occupied" : "available",
    price: Number(
      (segmentPrice * (physicalSeat.seatType.valueToApply || 1)).toFixed(2)
    ),
    type: mapSeatType(physicalSeat.seatType.name),
  };
}

// Transform frontend passenger data to backend ticket request format
export function transformPassengersToTickets(
  passengers: PassengerData[],
  selectedSeats: Seat[],
  routeSheetId: number,
  date: Date
) {
  return passengers.map((passenger, index) => {
    const seat = selectedSeats[index];

    return {
      frecuencySegmentPriceId: 1, // This needs to be resolved based on passenger type
      date: date,
      physicalSeatId: parseInt(seat.id),
      passengerType: "NORMAL" as const,
      passsengerDni: passenger.documentNumber,
      passengerName: passenger.firstName,
      passengerSurname: passenger.lastName,
      passengerEmail: passenger.email,
      passengerBirthDate: new Date(), // This would need to be collected in the form
    };
  });
}

// Transform checkout data to API request format
export function transformCheckoutToApiRequest(
  checkoutData: import("../types/checkout.interface").CheckoutData
): import("../types/checkout.interface").CheckoutTicket[] {
  return checkoutData.passengers.map((passenger, index) => {
    const seat = checkoutData.seats[index];

    return {
      frecuencySegmentPriceId: 1, // This should come from the route data
      date: new Date().toISOString(),
      physicalSeatId: parseInt(seat.id),
      passengerType: PassengerType.NORMAL,
      passsengerDni: passenger.documentNumber,
      passengerName: passenger.firstName,
      passengerSurname: passenger.lastName,
      passengerEmail: passenger.email,
      passengerBirthDate: passenger.birthDate,
    };
  });
}

// Helper functions for mapping backend values to frontend values
function mapBusType(backendType: string): "Estándar" | "Ejecutivo" | "VIP" {
  switch (backendType.toLowerCase()) {
    case "ejecutivo":
    case "executive":
      return "Ejecutivo";
    case "vip":
    case "premium":
      return "VIP";
    default:
      return "Estándar";
  }
}

function mapSeatStatus(
  backendStatus: string
): "available" | "occupied" | "disabled" {
  switch (backendStatus) {
    case "OCCUPIED":
      return "occupied";
    case "DISABLED":
      return "disabled";
    default:
      return "available";
  }
}

function mapSeatType(backendType: string): "window" | "aisle" | "middle" {
  switch (backendType.toLowerCase()) {
    case "window":
    case "ventana":
      return "window";
    case "aisle":
    case "pasillo":
      return "aisle";
    default:
      return "middle";
  }
}
