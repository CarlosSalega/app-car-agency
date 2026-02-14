import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login";

  const session = await getSession();

  if (isLoginPage && session) {
    redirect("/admin");
  }

  if (!isLoginPage && !session) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
