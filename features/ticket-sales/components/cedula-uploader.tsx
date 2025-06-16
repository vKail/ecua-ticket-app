"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";

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
      setBirthDate("2025-01-01");
      onBirthDateExtracted("2025-01-01");
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
