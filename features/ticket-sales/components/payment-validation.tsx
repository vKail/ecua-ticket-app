"use client";

import { useForm, FormProvider } from "react-hook-form";
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
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DollarSign,
  Loader2,
  XCircle,
} from "lucide-react";
import { PaymentMethod } from "@/core/enums/PaymentMethod.enum";
import { cn } from "@/lib/utils";

interface PaymentValidationProps {
  paymentId: number;
  paymentMethod: string;
  totalAmount: number;
  onValidate: (paypalOrderId?: string) => void;
  onReject: () => void;
  isValidating?: boolean;
  isRejecting?: boolean;
  className?: string;
}

export function PaymentValidation({
  paymentId,
  paymentMethod,
  totalAmount,
  onValidate,
  onReject,
  isValidating = false,
  isRejecting = false,
  className,
}: PaymentValidationProps) {
  const methods = useForm({ defaultValues: { paypalOrderId: "" } });
  const { handleSubmit, watch } = methods;
  const isPaypal = paymentMethod === PaymentMethod.PAYPAL;
  const isProcessing = isValidating || isRejecting;

  function submitForm(data: any) {
    if (isPaypal && !data.paypalOrderId.trim()) return;
    onValidate(isPaypal ? data.paypalOrderId : undefined);
  }

  function getPaymentMethodLabel() {
    switch (paymentMethod) {
      case PaymentMethod.CASH:
        return "Efectivo";
      case PaymentMethod.TRANSFER:
        return "Transferencia bancaria";
      case PaymentMethod.PAYPAL:
        return "PayPal";
      default:
        return paymentMethod;
    }
  }

  function getPaymentIcon() {
    switch (paymentMethod) {
      case PaymentMethod.CASH:
        return <DollarSign className="h-5 w-5" />;
      case PaymentMethod.TRANSFER:
      case PaymentMethod.PAYPAL:
        return <CreditCard className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  }

  return (
    <FormProvider {...methods}>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="bg-amber-50 border-b">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle>Validación de Pago Pendiente</CardTitle>
          </div>
          <CardDescription>
            El pago debe ser validado antes de confirmar la compra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  ID de Pago
                </span>
                <span className="font-mono font-medium">#{paymentId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Método de Pago
                </span>
                <div className="flex items-center gap-2">
                  {getPaymentIcon()}
                  <span className="font-medium">{getPaymentMethodLabel()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Monto Total
                </span>
                <span className="text-lg font-bold">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {isPaypal && (
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="space-y-2">
                <RHFInput
                  name="paypalOrderId"
                  label="ID de Orden de PayPal"
                  placeholder="Ingrese el ID de la orden de PayPal"
                  disabled={isProcessing}
                />
                <p className="text-sm text-muted-foreground">
                  Este ID se obtiene después de que el cliente complete el pago
                  en PayPal
                </p>
                <CardFooter className="flex gap-2 border-t p-4">
                  <Button
                    variant="destructive"
                    onClick={onReject}
                    disabled={isProcessing}
                    className="flex-1"
                    type="button"
                  >
                    {isRejecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Rechazando...
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" /> Rechazar Pago
                      </>
                    )}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing || !watch("paypalOrderId").trim()}
                    className="flex-1"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Validando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" /> Validar Pago
                      </>
                    )}
                  </Button>
                </CardFooter>
              </div>
            </form>
          )}
          {!isPaypal && (
            <div className="bg-muted p-4 rounded-md space-y-2">
              <p className="text-sm font-medium">
                Instrucciones de validación:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                {paymentMethod === PaymentMethod.CASH && (
                  <>
                    <li>
                      Verificar que el cliente haya entregado el monto exacto en
                      efectivo
                    </li>
                    <li>
                      Contar el dinero y confirmar que coincide con el total
                    </li>
                  </>
                )}
                {paymentMethod === PaymentMethod.TRANSFER && (
                  <>
                    <li>
                      Verificar que la transferencia haya sido recibida en la
                      cuenta bancaria
                    </li>
                    <li>
                      Confirmar que el monto transferido coincide con el total
                    </li>
                  </>
                )}
              </ul>
              <CardFooter className="flex gap-2 border-t p-4">
                <Button
                  variant="destructive"
                  onClick={onReject}
                  disabled={isProcessing}
                  className="flex-1"
                  type="button"
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Rechazando...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" /> Rechazar Pago
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => onValidate()}
                  disabled={isProcessing}
                  className="flex-1"
                  type="button"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Validando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Validar Pago
                    </>
                  )}
                </Button>
              </CardFooter>
            </div>
          )}
        </CardContent>
      </Card>
    </FormProvider>
  );
}
