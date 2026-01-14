import { LucideIcon } from "lucide-react";

export type UserRole = "ADMIN" | "COLLABORATOR";

export type NavAction = "logout";

export interface AdminNavItem {
  id: string;
  label: string;
  href?: string;
  action?: NavAction;
  icon?: LucideIcon;
  roles?: UserRole[];
  showInHeader?: boolean;
  showInDropdown?: boolean;
}
