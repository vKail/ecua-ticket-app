import { BottomNavigation } from "@/features/dashboard/components/bottom-navigation";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNavigation />
    </div>
  );
}
