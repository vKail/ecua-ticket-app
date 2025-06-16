import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutNextAuth } from "../helpers/next-auth-logout";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    const result = await logoutNextAuth();
    
    if (result.status === "success") {
      toast.success(result.message);
      router.push("/login");
    } else {
      toast.error(result.message);
    }
    
    setIsLoading(false);
  };

  return {
    handleLogout,
    isLoading,
  };
};