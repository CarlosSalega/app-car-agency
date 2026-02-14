import Image from "next/image";
import Link from "next/link";

import { FOOTER_CONTENT } from "@/data/footer";

export function FooterContact() {
  const { logo, brand, description, sections, copyright } = FOOTER_CONTENT;

  return (
    <footer className="border-border bg-card/50 border-t pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={logo.className}
                />
                <span className={brand.className}>{brand.text}</span>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">{sections.links.title}</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {sections.links.items.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">{sections.contact.title}</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {sections.contact.items.map((item, index) => (
                <li key={index}>
                  {item.label}:{" "}
                  {Array.isArray(item.value)
                    ? item.value.map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < item.value.length - 1 && <br />}
                        </span>
                      ))
                    : item.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} {copyright.companyName}.
            <br />
            {copyright.text}
          </p>
        </div>
      </div>
    </footer>
  );
}
