import { MapPin, Instagram, PhoneCall, Mail } from "lucide-react";

import { WhatsAppIcon } from "@/components/ui/whatsapp";
export type ContactLink = {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const CONTACT_LINKS: ContactLink[] = [
  {
    id: "telefono",
    label: "Llamanos",
    href: "tel:+54 9 123 456-7890",
    icon: <PhoneCall className="size-7" />,
  },
  {
    id: "whatsapp",
    label: "Mensaje de WhatsApp",
    href: "https://api.whatsapp.com/send?phone=5491234567890&text=%C2%BFBuscas%20vender%20o%20comprar%20tu%20auto%3F",
    icon: <WhatsAppIcon className="size-7" />,
  },
  {
    id: "email",
    label: "Envianos un email",
    href: "mailto:contacto@tuagencia.com.ar",
    icon: <Mail className="size-7" />,
  },
  {
    id: "instagram",
    label: "Seguinos en Instagram",
    href: "https://www.instagram.com/",
    icon: <Instagram className="size-7" />,
  },
  {
    id: "ubicacion",
    label: "Ver nuestra ubicación",
    href: "https://www.google.com/maps/",
    icon: <MapPin className="size-7" />,
  },
];
