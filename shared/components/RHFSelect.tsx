import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext, Controller, FieldError } from "react-hook-form";
import { useFormDisabled } from "@/shared/contexts/FormDisabledContext";
interface RHFSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export default function RHFSelect({
  name,
  label,
  options,
  disabled,
}: RHFSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const isFormDisabled = useFormDisabled();

  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled ?? isFormDisabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && (
        <span className="text-red-500 text-xs">
          {(errors[name] as FieldError)?.message}
        </span>
      )}
    </div>
  );
}
