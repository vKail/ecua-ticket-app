import { ArrowLeft, Edit, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserProfileView from "@/features/user/presentation/views/user-profile-view";

export default function PerfilPage() {
  return (
    <div className=" min-h-screen w-screen">
      <UserProfileView />
    </div>
  );
}
