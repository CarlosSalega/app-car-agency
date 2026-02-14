import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { CONTACT_LINKS } from "@/data/contact";

export default function ContactSection() {
  return (
    <section className="mx-auto my-auto h-full max-w-[480px] px-4 py-12">
      <div className="prose mb-6 max-w-none">
        <h2 className="text-3xl font-semibold">Contacto</h2>
        <p className="text-muted-foreground">Elegí la forma que prefieras para comunicarte con nosotros.</p>
      </div>

      <div className="grid gap-3">
        {CONTACT_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={link.label}
          >
            <Button
              className="bg-muted/80 hover:bg-muted/20 hover:text-accent hover:border-accent h-12 w-full justify-start rounded-lg py-4 pl-6 text-center text-base font-medium transition-transform duration-150 hover:scale-105 sm:pl-24 md:pl-30"
              variant="outline"
            >
              {link.icon && <span className="mr-3 flex items-center">{link.icon}</span>}
              {link.label}
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
