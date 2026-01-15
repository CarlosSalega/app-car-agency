import { HeaderLogo } from "@/components/header/header-logo";
import { HeaderSearch } from "@/components/header/header-search";
import { HeaderUser } from "@/components/header/header-user";
import { getSession } from "@/lib/session";

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
