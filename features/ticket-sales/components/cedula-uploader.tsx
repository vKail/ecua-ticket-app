"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";
import Tesseract from "tesseract.js";

interface CedulaUploaderProps {
  onBirthDateExtracted: (birthDate: string) => void;
  className?: string;
}

export function CedulaUploader({
  onBirthDateExtracted,
  className,
}: CedulaUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setBirthDate(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setLoading(true);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "spa");

      // Busca todas las fechas en el texto
      const dateRegex = /(\d{1,2})[\/\s\-](\w{3,}|\d{1,2})[\/\s\-](\d{4})/gi;
      const matches = [...text.matchAll(dateRegex)];

      if (matches.length === 0) {
        throw new Error("No se encontró una fecha válida");
      }

      // Filtra por año de nacimiento razonable
      const birthDateMatch = matches.find(([, day, month, year]) => {
        const y = parseInt(year);
        return y >= 1900 && y <= 2010;
      });

      if (!birthDateMatch) {
        throw new Error("No se encontró una fecha de nacimiento válida");
      }

      let [, day, month, year] = birthDateMatch;

      // Convertir mes en texto a número
      if (isNaN(Number(month))) {
        const months: Record<string, string> = {
          ene: "01",
          feb: "02",
          mar: "03",
          abr: "04",
          may: "05",
          jun: "06",
          jul: "07",
          ago: "08",
          sep: "09",
          oct: "10",
          nov: "11",
          dic: "12",
        };
        month = months[month.slice(0, 3).toLowerCase()] || month;
      }

      const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      setBirthDate(isoDate);
      onBirthDateExtracted(isoDate);
    } catch (err) {
      setError(
        "No se pudo extraer la fecha de nacimiento. Intenta con una foto más clara."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Subir cédula de identidad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex flex-col items-center gap-2 cursor-pointer">
          <UploadCloud className="h-8 w-8 text-primary" />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
          <span className="text-sm text-muted-foreground">
            Selecciona o arrastra una foto de la cédula
          </span>
        </label>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Cédula subida"
            className="max-h-40 rounded border mx-auto"
          />
        )}

        {loading && (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="animate-spin" /> Extrayendo fecha de
            nacimiento...
          </div>
        )}

        {birthDate && (
          <div className="text-green-700 font-medium">
            Fecha de nacimiento detectada: {birthDate}
          </div>
        )}

        {error && <div className="text-red-600 font-medium">{error}</div>}
      </CardContent>
    </Card>
  );
}
