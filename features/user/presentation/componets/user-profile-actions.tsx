"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import {
  userActionsItems,
  type UserActionItem,
} from "../../constans/user-actions-items";

export function UserProfileActions() {
  // Separar acciones por grupos
  const personalActions = userActionsItems.filter(
    (item) => item.group === "personal"
  );
  const supportActions = userActionsItems.filter(
    (item) => item.group === "support"
  );

  // Manejar el logout
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  // Renderizar una acción individual
  const renderAction = (action: UserActionItem) => {
    const IconComponent = action.icon;

    // Si es logout, manejar diferente
    if (action.id === "logout") {
      return (
        <button
          key={action.id}
          onClick={handleLogout}
          className="flex items-center justify-between w-full p-4 hover:bg-[#cddaf8]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0A2367] rounded-full flex items-center justify-center">
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#0A2367] font-medium">{action.name}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#0A2367]" />
        </button>
      );
    }

    // Para las demás acciones, usar Link
    return (
      <Link
        key={action.id}
        href={action.route}
        className="flex items-center justify-between w-full p-4 hover:bg-[#cddaf8]/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0A2367] rounded-full flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <span className="text-[#0A2367] font-medium">{action.name}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-[#0A2367]" />
      </Link>
    );
  };

  return (
    <div className="space-y-4 px-6">
      {/* Grupo Personal */}
      <Card className="bg-[#cddaf8] border-none shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-[#0A2367]/10">
            {personalActions.map(renderAction)}
          </div>
        </CardContent>
      </Card>

      {/* Grupo Soporte */}
      <Card className="bg-[#cddaf8] border-none shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-[#0A2367]/10">
            {supportActions.map(renderAction)}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[#0A2367] text-sm font-medium">
          Derechos reservados CodeCrafters
        </p>
      </div>
    </div>
  );
}

export default UserProfileActions;
