import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <div className="from-primary/5 to-primary/10 mx-auto mt-16 flex min-h-[320px] max-w-4xl flex-col items-center justify-center rounded-2xl bg-gradient-to-r p-8 text-center">
      <h2 className="mb-4 text-3xl font-bold text-balance">
        ¿No encontraste lo que buscabas?
      </h2>
      <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
        Tenemos más vehículos listos para ser tu próxima gran compra. Todas las
        marcas, modelos y precios.
      </p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button
          asChild
          className="px-8 text-base font-semibold transition duration-300 ease-in-out hover:scale-110"
        >
          <Link href="/autos">🔍 Mirá todo nuestro stock</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="hover:bg-foreground px-8 text-base transition duration-300 ease-in-out hover:scale-110"
        >
          <Link href="/contacto">💬 Quiero Asesoramiento</Link>
        </Button>
      </div>
    </div>
  );
}
