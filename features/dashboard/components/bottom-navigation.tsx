"use client";

import { Home, Ticket, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Inicio",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Boletos",
    href: "/dashboard/boletos",
    icon: Ticket,
  },
  {
    name: "Perfil",
    href: "/dashboard/perfil",
    icon: User,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <nav className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
