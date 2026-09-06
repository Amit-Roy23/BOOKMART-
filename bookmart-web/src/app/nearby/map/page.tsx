import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";
import NearbyMapPageClient from "@/components/nearby-map/NearbyMapPageClient";

export const metadata: Metadata = {
  title: "Nearby Books - Map View | Bookmart",
  description: "Discover nearby books and sellers on an interactive map view.",
};

export default function NearbyMapPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Nearby Books", href: "/nearby" },
              { label: "Map View" },
            ]}
          />
          <NearbyMapPageClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
