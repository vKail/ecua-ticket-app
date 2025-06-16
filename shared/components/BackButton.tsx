"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function BackButton({ label = "Volver", ...props }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 pl-0"
      onClick={() => router.back()}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
