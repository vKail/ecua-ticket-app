"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Bus,
  Calendar,
  Check,
  Clock,
  Download,
  MapPin,
  QrCode,
  Share2,
  Ticket,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmationData {
  reservationId: string;
  route: {
    origin: string;
    destination: string;
    departureTime: string;
    departureDate: string;
    arrivalTime: string;
    busCompany: string;
    busType: string;
  };
  seats: {
    number: string;
    price: number;
  }[];
  passengers: {
    name: string;
    documentNumber: string;
  }[];
  contactInfo: {
    email: string;
    phone: string;
  };
  paymentInfo: {
    method: string;
    total: number;
    date: string;
  };
  qrCode?: string;
}

interface ConfirmationProps {
  confirmationData: ConfirmationData;
  onFinish: () => void;
  className?: string;
}

export function Confirmation({
  confirmationData,
  onFinish,
  className,
}: ConfirmationProps) {
  // Si no hay datos de reserva, mostrar solo el mensaje de éxito
  const isSimpleSuccess = !confirmationData?.reservationId;

  if (isSimpleSuccess) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="text-center bg-green-50 border-b">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>¡Pago realizado exitosamente!</CardTitle>
          <CardDescription>
            Tu reserva ha sido creada correctamente.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col sm:flex-row gap-2 border-t p-4">
          <Button className="w-full sm:w-auto sm:ml-auto" onClick={onFinish}>
            Finalizar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const hasRouteInfo =
    confirmationData.route &&
    (confirmationData.route.origin ||
      confirmationData.route.destination ||
      confirmationData.route.departureTime ||
      confirmationData.route.arrivalTime ||
      confirmationData.route.busCompany ||
      confirmationData.route.busType);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="text-center bg-green-50 border-b">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>¡Compra Confirmada!</CardTitle>
        <CardDescription>
          La compra ha sido procesada exitosamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="rounded-lg border bg-card p-4 text-center">
          <h3 className="font-medium text-lg">Código de Compra</h3>
          <p className="text-2xl font-bold tracking-wider mt-1">
            {confirmationData.reservationId}
          </p>
        </div>

        {hasRouteInfo && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Detalles del viaje</h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {confirmationData.route.busCompany}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {confirmationData.route.busType}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <div>
                      <div className="font-semibold">
                        {confirmationData.route.departureTime}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {confirmationData.route.origin}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-px bg-border my-1"></div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {confirmationData.route.arrivalTime}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {confirmationData.route.destination}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{confirmationData.route.departureDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{confirmationData.route.departureTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Pasajeros y asientos</h3>
          <div className="space-y-3">
            {confirmationData.passengers.map((passenger, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p>{passenger.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Doc: {passenger.documentNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span>Asiento {confirmationData.seats[index]?.number}</span>
                  <span className="text-xs text-muted-foreground">
                    ${confirmationData.seats[index]?.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Información de pago</h3>
          <div className="space-y-2">
            <div className="flex justify-between font-bold">
              <span>Total pagado</span>
              <span>${confirmationData.paymentInfo.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Método de pago</span>
              <span>{confirmationData.paymentInfo.method}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha de pago</span>
              <span>{confirmationData.paymentInfo.date}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm">
            Se ha enviado un correo electrónico con los detalles de tu reserva a{" "}
            {confirmationData.contactInfo.email}.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 border-t p-4">
        <Button className="w-full sm:w-auto sm:ml-auto" onClick={onFinish}>
          Finalizar
        </Button>
      </CardFooter>
    </Card>
  );
}
