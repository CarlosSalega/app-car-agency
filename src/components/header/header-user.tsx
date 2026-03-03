import Link from "next/link";

import { AdminDropdown } from "@/components/admin";
import { Button } from "@/components/ui/button";

type HeaderUserProps = {
  user: {
    name: string | null;
    email: string;
    role: "ADMIN" | "COLLABORATOR";
  } | null;
};

export function HeaderUser({ user }: HeaderUserProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex w-30 justify-end">
        {user ? (
          <AdminDropdown user={user} />
        ) : (
          <Link href="/admin" className="w-full">
            <Button
              variant="outline"
              className="hover:bg-foreground hover:text-background w-full transition-colors duration-300 ease-in-out"
            >
              Iniciar sesión
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
