import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext, Controller } from "react-hook-form";
import { useFormDisabled } from "@/shared/contexts/FormDisabledContext";

type RHFInputProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

function RHFInput({
  name,
  label,
  type = "text",
  placeholder,
  className,
  disabled,
}: RHFInputProps) {
  const { control, formState } = useFormContext();
  const isFormDisabled = useFormDisabled();

  const getErrorMessage = (name: string) => {
    return formState.errors[name]?.message as string | undefined;
  };

  const errorMessage = getErrorMessage(name);

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            type={type}
            placeholder={placeholder}
            className={className}
            {...field}
            disabled={disabled ?? isFormDisabled}
          />
        )}
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default RHFInput;
