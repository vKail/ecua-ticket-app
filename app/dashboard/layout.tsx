import BackgroundCircles from "@/components/layout/BackgroundCircles";
import { BottomNavigation } from "@/features/dashboard/components/bottom-navigation";
import { UserHeader } from "@/features/user/presentation/componets/user-header";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="z-[1]">
      <div className="min-h-screen w-screen bg-gray-100 flex flex-col justify-center items-center align-middle z-[1]">
        <UserHeader />
        <main className="flex-1 pb-20 z-[1]">{children}</main>
        <BottomNavigation />
      </div>
      <BackgroundCircles />
    </div>
  );
}
