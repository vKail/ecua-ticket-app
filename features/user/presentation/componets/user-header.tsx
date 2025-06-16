"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/use-logout";

export const UserHeader = () => {
  const { data: session } = useSession();
  const { handleLogout, isLoading } = useLogout();

  const getInitials = (name?: string, surname?: string) => {
    const firstInitial = name?.charAt(0)?.toUpperCase() || "";
    const lastInitial = surname?.charAt(0)?.toUpperCase() || "";
    return firstInitial + lastInitial || "U";
  };

  return (
    <Card className=" w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg border border-white/20 z-50 my-5  p-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Avatar y información del usuario */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage
                src="https://via.placeholder.com/150"
                alt="User Avatar"
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-white font-semibold text-sm">
                {getInitials(session?.user?.name, session?.user?.surname)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900">
                ¡Hola! {session?.user?.name || "Usuario"}
              </p>
              {session?.user?.surname && (
                <p className="text-xs text-gray-500">{session.user.surname}</p>
              )}
              {session?.user?.role && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                  {session.user.role}
                </span>
              )}
            </div>
          </div>

          {/* Botón de logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoading}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
