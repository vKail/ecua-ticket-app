"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import RHFInput from "@/shared/components/RHFInput";
import RHFSelect from "@/shared/components/RHFSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CedulaUploader } from "./cedula-uploader";

export interface PassengerData {
  id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  seatNumber: string;
  birthDate: string;
}

interface PassengerFormProps {
  passengers: PassengerData[];
  onUpdatePassenger: (index: number, data: Partial<PassengerData>) => void;
  onSubmit: () => void;
  className?: string;
}

const passengerSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  documentType: z.string().min(1, "Selecciona un tipo de documento"),
  documentNumber: z.string().min(1, "El número de documento es obligatorio"),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
  seatNumber: z.string(),
  id: z.string(),
});

const schema = z.object({
  passengers: z.array(passengerSchema),
});

export function PassengerForm({
  passengers,
  onUpdatePassenger,
  onSubmit,
  className,
}: PassengerFormProps) {
  const methods = useForm<{ passengers: PassengerData[] }>({
    defaultValues: { passengers },
    mode: "onBlur",
    resolver: zodResolver(schema),
  });
  const { handleSubmit, setValue, formState } = methods;
  const [activeTab, setActiveTab] = useState("0");

  function handleTabChange(tab: string) {
    setActiveTab(tab);
  }

  function handleBirthDateExtracted(index: number, birthDate: string) {
    setValue(`passengers.${index}.birthDate`, birthDate);
    onUpdatePassenger(index, { birthDate });
  }

  function submitForm(data: { passengers: PassengerData[] }) {
    data.passengers.forEach((passenger, index) => {
      onUpdatePassenger(index, passenger);
    });
    onSubmit();
  }

  return (
    <FormProvider {...methods}>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle>Datos de los Pasajeros</CardTitle>
          <CardDescription>
            Ingresa la información de cada pasajero para los {passengers.length}{" "}
            asientos seleccionados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              {passengers.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  {index === 0 ? "Pasajero principal" : `Pasajero ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>
            {passengers.map((passenger, index) => (
              <TabsContent
                key={index}
                value={index.toString()}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {index === 0
                      ? "Pasajero principal"
                      : `Pasajero ${index + 1}`}
                  </h3>
                  <div className="bg-muted px-3 py-1 rounded-md text-sm">
                    Asiento {passenger.seatNumber}
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RHFInput
                    name={`passengers.${index}.firstName`}
                    label="Nombre"
                  />
                  <RHFInput
                    name={`passengers.${index}.lastName`}
                    label="Apellido"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RHFSelect
                    name={`passengers.${index}.documentType`}
                    label="Tipo de documento"
                    options={[
                      { value: "cedula", label: "Cédula" },
                      { value: "pasaporte", label: "Pasaporte" },
                      { value: "otro", label: "Otro" },
                    ]}
                  />
                  <RHFInput
                    name={`passengers.${index}.documentNumber`}
                    label="Número de documento"
                  />
                </div>
                <CedulaUploader
                  onBirthDateExtracted={(birthDate) =>
                    handleBirthDateExtracted(index, birthDate)
                  }
                  className="mb-4"
                />
                <RHFInput
                  name={`passengers.${index}.birthDate`}
                  label="Fecha de nacimiento (ingresa manualmente si no se reconoce)"
                  type="date"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RHFInput
                    name={`passengers.${index}.email`}
                    label="Correo electrónico"
                    type="email"
                  />
                  <RHFInput
                    name={`passengers.${index}.phone`}
                    label="Teléfono"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline">Atrás</Button>
          <Button onClick={handleSubmit(submitForm)}>Continuar</Button>
        </CardFooter>
      </Card>
    </FormProvider>
  );
}
