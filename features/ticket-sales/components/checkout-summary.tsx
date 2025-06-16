"use client";

import { useForm, FormProvider, Controller } from "react-hook-form";
import RHFInput from "@/shared/components/RHFInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Bus,
  Calendar,
  Clock,
  MapPin,
  Receipt,
  Ticket,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const methods = useForm({
    defaultValues: {
      paymentMethod: "cash",
      promoCode: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      name: "",
    },
    mode: "onBlur",
  });
  const { handleSubmit, watch } = methods;
  const paymentMethod = watch("paymentMethod");
  const promoCode = watch("promoCode");
  const [promoApplied, setPromoApplied] = useState(false);
  const subtotal = checkoutData.seats.reduce(
    (sum, seat) => sum + seat.price,
    0
  );
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "promo10") {
      setPromoApplied(true);
    }
  };

  const submitForm = (data: any) => {
    onPaymentSubmit(data.paymentMethod);
  };

  return (
    <FormProvider {...methods}>
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
                    <p className="font-medium">
                      {checkoutData.route.busCompany}
                    </p>
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

          <form onSubmit={handleSubmit(submitForm)}>
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Método de pago</h3>

              <Controller
                name="paymentMethod"
                control={methods.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Efectivo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="bank-transfer"
                        id="bank-transfer"
                      />
                      <Label
                        htmlFor="bank-transfer"
                        className="flex items-center gap-2"
                      >
                        <Receipt className="h-4 w-4" />
                        Transferencia bancaria
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />

              {paymentMethod === "cash" && (
                <div className="bg-muted p-4 rounded-md text-sm">
                  <p className="font-medium">Pago en efectivo:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>El cliente debe entregar el monto exacto</li>
                    <li>Verificar billetes antes de confirmar</li>
                    <li>Entregar cambio si es necesario</li>
                  </ul>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="bg-muted p-4 rounded-md text-sm">
                  <p className="font-medium">Pago con PayPal:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      El cliente debe completar el pago en su cuenta PayPal
                    </li>
                    <li>Solicitar el ID de la orden de PayPal al cliente</li>
                    <li>El pago será validado en el siguiente paso</li>
                  </ul>
                </div>
              )}

              {paymentMethod === "credit-card" && (
                <div className="space-y-4 pt-2">
                  <RHFInput
                    name="cardNumber"
                    label="Número de tarjeta"
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <RHFInput
                      name="expiry"
                      label="Fecha de expiración"
                      placeholder="MM/AA"
                    />
                    <RHFInput name="cvc" label="CVC" placeholder="123" />
                  </div>
                  <RHFInput
                    name="name"
                    label="Nombre en la tarjeta"
                    placeholder="Nombre completo"
                  />
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
                  <RHFInput
                    name="promoCode"
                    label="Código promocional"
                    placeholder="Ingresa código"
                    disabled={promoApplied}
                  />
                </div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                >
                  Aplicar
                </Button>
              </div>
            </div>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" type="button">
                Atrás
              </Button>
              <Button type="submit">Confirmar y pagar</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
