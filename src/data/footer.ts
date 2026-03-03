export const FOOTER_CONTENT = {
  logo: {
    src: "/logo.png",
    alt: "logo",
    className: "size-16 border-2 rounded-full",
    width: 64,
    height: 64,
  },
  brand: {
    text: "AutoWeb Argentina",
    className: "font-bold text-foreground uppercase",
  },
  description: "Tu lugar de confianza para autos usados y 0km.",
  sections: {
    links: {
      title: "Enlaces",
      items: [
        { label: "Inicio", href: "/" },
        { label: "Catálogo", href: "/autos" },
        { label: "Admin", href: "/admin" },
      ],
    },
    contact: {
      title: "Contacto",
      items: [
        { label: "Email", value: "contacto@autowebargentina.com.ar" },
        { label: "Tel", value: "+54 9 123 456-7890" },
        {
          label: "Dirección",
          value: ["Calle 123 - Buenos Aires", "Provincia de Buenos Aires, Argentina"],
        },
      ],
    },
  },
  copyright: {
    companyName: "AutoWeb Argentina",
    text: "Derechos reservados.",
  },
};
