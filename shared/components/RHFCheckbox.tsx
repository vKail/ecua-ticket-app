import { useFormContext, Controller, FieldError } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface RHFCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
}

export default function RHFCheckbox({
  name,
  label,
  disabled,
}: RHFCheckboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={!!field.value}
            onCheckedChange={field.onChange}
            id={name}
            disabled={disabled}
          />
        )}
      />
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {errors[name] && (
        <span className="text-red-500 text-xs">
          {(errors[name] as FieldError)?.message}
        </span>
      )}
    </div>
  );
}
