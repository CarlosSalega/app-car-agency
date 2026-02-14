import { Badge } from "@/components/ui/badge";

type CarStatus = "AVAILABLE" | "SOLD" | "RESERVED" | "UNAVAILABLE" | "PENDING";

const carStatusMap: Record<CarStatus, { label: string; className: string }> = {
  AVAILABLE: {
    label: "Disponible",
    className: "bg-green-600 text-white",
  },
  SOLD: {
    label: "Vendido",
    className: "bg-blue-600 text-white",
  },
  RESERVED: {
    label: "Reservado",
    className: "bg-orange-500 text-white",
  },
  UNAVAILABLE: {
    label: "No Disponible",
    className: "bg-red-600 text-white",
  },
  PENDING: {
    label: "Pendiente",
    className: "bg-yellow-500 text-white",
  },
};

interface CarStatusBadgeProps {
  status: string;
}

export function CarStatusBadge({ status }: CarStatusBadgeProps) {
  const statusInfo = carStatusMap[status as CarStatus] || {
    label: status,
    className: "bg-gray-500 text-white",
  };

  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
}

type UserRole = "ADMIN" | "COLLABORATOR";

const userRoleMap: Record<UserRole, { label: string; className: string }> = {
  ADMIN: {
    label: "Administrador",
    className: "bg-blue-600 text-white",
  },
  COLLABORATOR: {
    label: "Colaborador",
    className: "bg-gray-600 text-white",
  },
};

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const roleInfo = userRoleMap[role as UserRole] || {
    label: role,
    className: "bg-gray-500 text-white",
  };

  return <Badge className={roleInfo.className}>{roleInfo.label}</Badge>;
}

const activeStatusMap = {
  active: {
    label: "Activo",
    className: "bg-green-600 text-white",
  },
  inactive: {
    label: "Inactivo",
    className: "bg-gray-800 text-white",
  },
};

interface ActiveStatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function ActiveStatusBadge({ isActive, activeLabel, inactiveLabel }: ActiveStatusBadgeProps) {
  const statusInfo = isActive ? activeStatusMap.active : activeStatusMap.inactive;

  const label = isActive ? activeLabel || statusInfo.label : inactiveLabel || statusInfo.label;

  return <Badge className={statusInfo.className}>{label}</Badge>;
}
