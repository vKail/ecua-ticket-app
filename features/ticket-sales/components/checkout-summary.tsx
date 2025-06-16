"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Bus,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Receipt,
  Ticket,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckoutData {
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
}

interface CheckoutSummaryProps {
  checkoutData: CheckoutData;
  onPaymentSubmit: (paymentMethod: string) => void;
  className?: string;
}

export function CheckoutSummary({
  checkoutData,
  onPaymentSubmit,
  className,
}: CheckoutSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);

  const subtotal = checkoutData.seats.reduce(
    (sum, seat) => sum + seat.price,
    0
  );
  const serviceFee = subtotal * 0.05;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + serviceFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "promo10") {
      setPromoApplied(true);
    }
  };

  const handleSubmit = () => {
    onPaymentSubmit(paymentMethod);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Resumen y Pago</CardTitle>
        <CardDescription>
          Revisa los detalles de tu compra y selecciona un método de pago
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Detalles del viaje</h3>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{checkoutData.route.busCompany}</p>
                  <p className="text-sm text-muted-foreground">
                    {checkoutData.route.busType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center">
                <div>
                  <div className="font-semibold">
                    {checkoutData.route.departureTime}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {checkoutData.route.origin}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-px bg-border my-1"></div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>

                <div>
                  <div className="font-semibold">
                    {checkoutData.route.arrivalTime}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {checkoutData.route.destination}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{checkoutData.route.departureDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{checkoutData.route.departureTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Pasajeros y asientos</h3>

          <div className="space-y-3">
            {checkoutData.passengers.map((passenger, index) => (
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
                  <span>Asiento {checkoutData.seats[index].number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Método de pago</h3>

          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit-card" id="credit-card" />
              <Label htmlFor="credit-card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Tarjeta de crédito/débito
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank-transfer" id="bank-transfer" />
              <Label
                htmlFor="bank-transfer"
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Transferencia bancaria
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "credit-card" && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="card-number">Número de tarjeta</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Fecha de expiración</Label>
                  <Input id="expiry" placeholder="MM/AA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre en la tarjeta</Label>
                <Input id="name" placeholder="Nombre completo" />
              </div>
            </div>
          )}

          {paymentMethod === "bank-transfer" && (
            <div className="bg-muted p-4 rounded-md text-sm">
              <p className="font-medium">
                Instrucciones para transferencia bancaria:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Banco: Banco Nacional</li>
                <li>Cuenta: 1234567890</li>
                <li>Titular: Empresa de Transportes S.A.</li>
                <li>
                  Referencia: Tu número de reserva se generará después de
                  confirmar
                </li>
              </ul>
              <p className="mt-2">
                Deberás enviar el comprobante de pago a pagos@empresa.com
              </p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Resumen de pago</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cargo por servicio</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-green-600">
                <span>Descuento (PROMO10)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="promo">Código promocional</Label>
              <Input
                id="promo"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Ingresa código"
                disabled={promoApplied}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleApplyPromo}
              disabled={promoApplied || !promoCode}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline">Atrás</Button>
        <Button onClick={handleSubmit}>Confirmar y pagar</Button>
      </CardFooter>
    </Card>
  );
}
