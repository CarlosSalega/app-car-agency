import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { HEADER_CONTENT } from "@/data/header";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  const { logo } = HEADER_CONTENT;

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="size-16 rounded-full border-2"
            />
          </Link>
          <p className="text-muted-foreground mt-2">Ingresá con tu cuenta</p>
        </div>

        <LoginForm />

        <div className="text-muted-foreground text-center text-sm">
          <p>Cuentas para Demo:</p>
          <p>Admin: admin@agencia.com / admin123</p>
          <p>Colaborador: juan@agencia.com / juan123</p>
        </div>
      </div>
    </div>
  );
}
