"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckoutData, OnlineSaleRequest } from "../types/checkout.interface";
import { useProcessOnlineSale, useValidatePayment } from "../hooks/useCheckout";
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import { PassengerType } from "@/core/enums/PassengerType.enum";
import { transformCheckoutToApiRequest } from "../api/transformers";

interface CheckoutFormProps {
  checkoutData: CheckoutData;
}

export function CheckoutForm({ checkoutData }: CheckoutFormProps) {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PaymentMethod.PAYPAL);
  const [isProcessing, setIsProcessing] = useState(false);

  const processOnlineSaleMutation = useProcessOnlineSale();
  const validatePaymentMutation = useValidatePayment();

  const { route, seats, passengers } = checkoutData;

  // Calcular el precio total
  const totalPrice = seats.reduce((sum, seat) => sum + seat.price, 0);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Preparar los tickets para la API usando el transformador
      const tickets = transformCheckoutToApiRequest(checkoutData);

      const saleRequest: OnlineSaleRequest = {
        paymentMethod: selectedPaymentMethod,
        paypalTransactionId: "sample_transaction_id",
        bankReference: "sample_bank_reference",
        receiptUrl: "sample_receipt_url",
        tickets,
      };

      const result = await processOnlineSaleMutation.mutateAsync(saleRequest);

      // Debug: Log the complete result structure
      console.log("Complete result structure:", result);

      if (selectedPaymentMethod === PaymentMethod.PAYPAL) {
        // Para PayPal, redirigir SOLO a la página de espera (SIN validar)
        const paymentId = (result as any).paymentId;
        const paypalOrderId = (result as any).paypalOrderId;

        console.log(
          "PayPal paymentId:",
          paymentId,
          "paypalOrderId:",
          paypalOrderId
        );

        // El hook ya abre la URL de PayPal automáticamente
        // Redirigir a página de espera donde se validará periódicamente
        router.push(
          `/dashboard/purchase/waiting?paymentId=${paymentId}&paypalOrderId=${paypalOrderId}`
        );
      } else {
        // Para transferencia, validar inmediatamente
        const paymentId = (result as any).paymentId;

        console.log("Transfer paymentId:", paymentId);

        if (!paymentId) {
          console.error("PaymentId is undefined. Result structure:", result);
          throw new Error("PaymentId not found in response");
        }

        await validatePaymentMutation.mutateAsync({ paymentId });
        router.push(`/dashboard/purchase/success?paymentId=${paymentId}`);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen del viaje */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalles del Viaje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-lg">
                {route.origin} → {route.destination}
              </p>
              <p className="text-sm text-complementary-gray">
                {route.busCompany} • {route.busType}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-complementary-gray">Salida</p>
              <p className="font-medium">{route.departureTime}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Pasajeros y Asientos</h4>
            {passengers.map((passenger, index) => (
              <div
                key={passenger.id}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <p className="font-medium">
                    {passenger.firstName} {passenger.lastName}
                  </p>
                  <p className="text-sm text-complementary-gray">
                    {passenger.documentType}: {passenger.documentNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Asiento {seats[index].number}</p>
                  <p className="text-sm text-complementary-gray">
                    {seats[index].type} • ${seats[index].price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de precios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                Subtotal ({passengers.length} pasajero
                {passengers.length > 1 ? "s" : ""})
              </span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuentos</span>
              <span>$0.00</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Método de pago */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedPaymentMethod}
            onValueChange={(value) =>
              setSelectedPaymentMethod(value as PaymentMethod)
            }
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/20 transition-colors">
              <RadioGroupItem value={PaymentMethod.PAYPAL} id="paypal" />
              <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-complementary-gray">
                      Pago seguro con PayPal
                    </p>
                  </div>
                  <div className="text-2xl">💳</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/20 transition-colors">
              <RadioGroupItem value={PaymentMethod.TRANSFER} id="transfer" />
              <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transferencia Bancaria</p>
                    <p className="text-sm text-complementary-gray">
                      Transferencia directa a nuestra cuenta
                    </p>
                  </div>
                  <div className="text-2xl">🏦</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Información del método de pago seleccionado */}
      {selectedPaymentMethod === PaymentMethod.TRANSFER && (
        <Card className="border-complementary-yellow border-2">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h4 className="font-medium mb-2">
                  Instrucciones para Transferencia
                </h4>
                <p className="text-sm text-complementary-gray">
                  Después de completar la compra, recibirás los datos bancarios
                  para realizar la transferencia. Tu reserva se mantendrá por 24
                  horas para que puedas completar el pago.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botón de pago */}
      <Button
        onClick={handlePayment}
        disabled={
          isProcessing ||
          processOnlineSaleMutation.isPending ||
          validatePaymentMutation.isPending
        }
        className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90"
      >
        {isProcessing
          ? "Procesando..."
          : selectedPaymentMethod === PaymentMethod.PAYPAL
          ? `Pagar $${totalPrice.toFixed(2)} con PayPal`
          : `Crear reserva por $${totalPrice.toFixed(2)}`}
      </Button>

      <p className="text-xs text-center text-complementary-gray mt-4">
        Al continuar, aceptas nuestros términos y condiciones de servicio
      </p>
    </div>
  );
}
