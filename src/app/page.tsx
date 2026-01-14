import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LatestArrivals } from "@/components/latest-arrivals";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="px-4 py-16 md:px-8">
        <LatestArrivals />
      </main>
      <Footer />
    </>
  );
}
