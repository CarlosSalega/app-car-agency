import { AdminDropdown } from "@/components/admin/admin-dropdown";
import { AuthUser } from "@/types/auth";
import AdminNavigation from "@/components/admin/admin-navigation";
import AdminLogo from "@/components/admin/admin-logo";

interface AdminHeaderProps {
  user: AuthUser;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="border-border bg-card/50 flex h-14 items-center border-b backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4">
        <AdminLogo />

        <AdminNavigation user={user} />

        <AdminDropdown user={user} />
      </div>
    </header>
  );
}
