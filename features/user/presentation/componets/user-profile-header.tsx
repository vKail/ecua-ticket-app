"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { getInitials, getFullName } from "../../utils/user-profile-utils";

export function UserProfileHeader() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-4 p-6">
      {/* Avatar con iniciales */}
      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-[#0A2367] font-bold text-xl">
          {getInitials(session?.user?.name, session?.user?.surname)}
        </span>
      </div>

      {/* Información del usuario */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-[#0A2367]">
          Hola! {getFullName(session?.user?.name, session?.user?.surname)}
        </h2>
      </div>
    </div>
  );
}

export default UserProfileHeader;
