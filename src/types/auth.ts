export type UserRole = "ADMIN" | "COLLABORATOR";

export interface AuthUser {
  name: string | null;
  email: string;
  role: UserRole;
}
