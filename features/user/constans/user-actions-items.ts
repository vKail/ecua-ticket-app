import {
  User,
  History,
  Bell,
  MessageCircle,
  HelpCircle,
  CreditCard,
  FileText,
  LogOut,
} from "lucide-react";

export interface UserActionItem {
  id: string;
  name: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "personal" | "support";
}

export const userActionsItems: UserActionItem[] = [
  // Grupo Personal
  {
    id: "edit-profile",
    name: "Editar perfil",
    route: "/dashboard/perfil/editar",
    icon: User,
    group: "personal",
  },
  {
    id: "purchase-history",
    name: "Historial de compras",
    route: "/dashboard/boletos",
    icon: History,
    group: "personal",
  },

  // Grupo Soporte
  {
    id: "notifications",
    name: "Notificaciones",
    route: "/dashboard/notificaciones",
    icon: Bell,
    group: "support",
  },
  {
    id: "support",
    name: "Soporte",
    route: "/dashboard/soporte",
    icon: MessageCircle,
    group: "support",
  },
  {
    id: "faq",
    name: "Preguntas frecuentes",
    route: "/dashboard/preguntas-frecuentes",
    icon: HelpCircle,
    group: "support",
  },
  {
    id: "payment-details",
    name: "Detalles de pago",
    route: "/dashboard/detalles-pago",
    icon: CreditCard,
    group: "support",
  },
  {
    id: "legal",
    name: "Legal",
    route: "/dashboard/legal",
    icon: FileText,
    group: "support",
  },
  {
    id: "logout",
    name: "Salir",
    route: "/logout",
    icon: LogOut,
    group: "support",
  },
];
