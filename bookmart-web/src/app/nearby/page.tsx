import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";
import NearbyPageClient from "@/components/nearby/NearbyPageClient";
import { nearbyBooks } from "@/data/nearbyBooks";

export default function NearbyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Nearby Books" },
            ]}
          />
          <NearbyPageClient initialBooks={nearbyBooks} />
        </div>
      </main>
      <Footer />
    </>
  );
}
