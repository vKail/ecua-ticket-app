import { Switch } from "@/components/ui/switch";
import { useFormContext, Controller, FieldError } from "react-hook-form";
import { useFormDisabled } from "@/shared/contexts/FormDisabledContext";

interface RHFSwitchProps {
  name: string;
  label: string;
  disabled?: boolean;
}

export default function RHFSwitch({ name, label, disabled }: RHFSwitchProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const isFormDisabled = useFormDisabled();
  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            checked={!!field.value}
            onCheckedChange={field.onChange}
            id={name}
            disabled={disabled ?? isFormDisabled}
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
