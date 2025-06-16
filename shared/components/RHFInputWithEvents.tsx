import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";

interface RHFInputWithEventsProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function RHFInputWithEvents({
  name,
  label,
  onFocus,
  onBlur,
  ...props
}: RHFInputWithEventsProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[name]?.message as string | undefined;
  return (
    <div className="space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        {...register(name)}
        {...props}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={!!error}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
