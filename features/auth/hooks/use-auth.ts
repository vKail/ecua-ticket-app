import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginRequest } from "@/core/models/User-Login";
import { login } from "../api/auth.api";
import { loginNextAuth } from "../helpers/next-auth-login";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);

    try {
      const response = await login(data);
      const result = await loginNextAuth(response);

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/dashboard");
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading,
  };
};
