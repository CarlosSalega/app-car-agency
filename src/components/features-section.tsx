import { CheckCircle, Shield, TrendingUp } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="bg-muted/50 min-h-80 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <Shield className="text-primary size-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Trato Directo</h3>
            <p className="text-muted-foreground">Garantía y confianza. Tu inversión siempre segura.</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <CheckCircle className="text-primary size-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Verificación Completa</h3>
            <p className="text-muted-foreground">Inspección rigurosa para garantizar calidad y seguridad.</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <TrendingUp className="text-primary size-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Mejor Precio</h3>
            <p className="text-muted-foreground">Ahorrá hasta 30% vs concesionarias oficiales.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
