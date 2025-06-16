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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  email?: string;
  phone?: string;
  seatNumber: string;
  birthDate?: string;
}

interface PassengerFormProps {
  passengers: PassengerData[];
  onUpdatePassenger: (index: number, data: Partial<PassengerData>) => void;
  onSubmit: () => void;
  className?: string;
}

export function PassengerForm({
  passengers,
  onUpdatePassenger,
  onSubmit,
  className,
}: PassengerFormProps) {
  const [activeTab, setActiveTab] = useState("0");
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );

  const validatePassenger = (index: number) => {
    const passenger = passengers[index];
    const passengerErrors: Record<string, string> = {};

    if (!passenger.firstName.trim()) {
      passengerErrors.firstName = "El nombre es requerido";
    }

    if (!passenger.lastName.trim()) {
      passengerErrors.lastName = "El apellido es requerido";
    }

    if (!passenger.documentType) {
      passengerErrors.documentType = "El tipo de documento es requerido";
    }

    if (!passenger.documentNumber.trim()) {
      passengerErrors.documentNumber = "El número de documento es requerido";
    } else if (
      passenger.documentType === "cedula" &&
      !/^\d{10}$/.test(passenger.documentNumber)
    ) {
      passengerErrors.documentNumber = "La cédula debe tener 10 dígitos";
    } else if (
      passenger.documentType === "pasaporte" &&
      passenger.documentNumber.length < 6
    ) {
      passengerErrors.documentNumber =
        "El pasaporte debe tener al menos 6 caracteres";
    }

    if (index === 0) {
      if (!passenger.email?.trim()) {
        passengerErrors.email = "El email es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        passengerErrors.email = "El email no es válido";
      }

      if (!passenger.phone?.trim()) {
        passengerErrors.phone = "El teléfono es requerido";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [index]: passengerErrors,
    }));

    return Object.keys(passengerErrors).length === 0;
  };

  const handleSubmit = () => {
    let isValid = true;

    for (let i = 0; i < passengers.length; i++) {
      if (!validatePassenger(i)) {
        isValid = false;
        setActiveTab(i.toString());
        break;
      }
    }

    if (isValid) {
      onSubmit();
    }
  };

  const handleChange = (
    index: number,
    field: keyof PassengerData,
    value: string
  ) => {
    onUpdatePassenger(index, { [field]: value });

    // Clear error for this field if it exists
    if (errors[index]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: "",
        },
      }));
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Datos de los Pasajeros</CardTitle>
        <CardDescription>
          Ingresa la información de cada pasajero para los {passengers.length}{" "}
          asientos seleccionados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {passengers.map((passenger, index) => (
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
                  {index === 0 ? "Pasajero principal" : `Pasajero ${index + 1}`}
                </h3>
                <div className="bg-muted px-3 py-1 rounded-md text-sm">
                  Asiento {passenger.seatNumber}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>Nombre</Label>
                  <Input
                    id={`firstName-${index}`}
                    value={passenger.firstName}
                    onChange={(e) =>
                      handleChange(index, "firstName", e.target.value)
                    }
                    // error={errors[index]?.firstName}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>Apellido</Label>
                  <Input
                    id={`lastName-${index}`}
                    value={passenger.lastName}
                    onChange={(e) =>
                      handleChange(index, "lastName", e.target.value)
                    }
                    // error={errors[index]?.lastName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`documentType-${index}`}>
                    Tipo de documento
                  </Label>
                  <Select
                    value={passenger.documentType}
                    onValueChange={(value) =>
                      handleChange(index, "documentType", value)
                    }
                  >
                    <SelectTrigger
                      id={`documentType-${index}`}
                      className={
                        errors[index]?.documentType ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cedula">Cédula</SelectItem>
                      <SelectItem value="pasaporte">Pasaporte</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[index]?.documentType && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[index].documentType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`documentNumber-${index}`}>
                    Número de documento
                  </Label>
                  <Input
                    id={`documentNumber-${index}`}
                    value={passenger.documentNumber}
                    onChange={(e) =>
                      handleChange(index, "documentNumber", e.target.value)
                    }
                    // error={errors[index]?.documentNumber}
                  />
                </div>
              </div>

              <CedulaUploader
                onBirthDateExtracted={(birthDate) =>
                  handleChange(index, "birthDate", birthDate)
                }
                className="mb-4"
              />
              {passenger.birthDate ? (
                <div className="mt-2 text-green-700 text-sm">
                  Fecha de nacimiento extraída: <b>{passenger.birthDate}</b>
                </div>
              ) : (
                <div className="mt-2">
                  <label className="text-sm">
                    Fecha de nacimiento (ingresa manualmente si no se reconoce):
                  </label>
                  <Input
                    type="date"
                    value={passenger.birthDate || ""}
                    onChange={(e) =>
                      handleChange(index, "birthDate", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={passenger.email || ""}
                    onChange={(e) =>
                      handleChange(index, "email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={passenger.phone || ""}
                    onChange={(e) =>
                      handleChange(index, "phone", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline">Atrás</Button>
        <Button onClick={handleSubmit}>Continuar</Button>
      </CardFooter>
    </Card>
  );
}
