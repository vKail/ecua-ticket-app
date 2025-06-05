import { createContext, useContext } from "react";

interface FormDisabledContextValue {
  disabled: boolean;
}

const FormDisabledContext = createContext<FormDisabledContextValue>({
  disabled: false,
});

export function FormDisabledProvider({
  disabled,
  children,
}: {
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <FormDisabledContext.Provider value={{ disabled }}>
      {children}
    </FormDisabledContext.Provider>
  );
}

export function useFormDisabled(): boolean {
  const { disabled } = useContext(FormDisabledContext);

  return disabled;
}
