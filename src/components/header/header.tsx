import { HeaderLogo, HeaderSearch, HeaderUser } from "@/components/header";
import { getSession } from "@/lib/auth";

export async function Header() {
  const session = await getSession();
  const user = session?.user ?? null;

  return (
    <header className="border-border bg-card/50 border-b backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        <HeaderLogo />

        <HeaderSearch />

        <HeaderUser user={user} />
      </div>
    </header>
  );
}
