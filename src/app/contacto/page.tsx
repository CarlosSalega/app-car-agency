import { Header } from "@/components/header";
import { FooterContact } from "@/components/footer-contact";
import ContactSection from "@/components/contact-section";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[520px] flex-col items-center justify-center">
        <ContactSection />
      </main>
      <FooterContact />
    </>
  );
}
