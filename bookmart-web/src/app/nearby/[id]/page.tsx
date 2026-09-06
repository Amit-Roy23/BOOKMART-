"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";

export default function NearbyBookDetailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Nearby Books", href: "/nearby" },
              { label: "Book Details" },
            ]}
          />
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Book Details</h1>
          <p className="text-slate-500 mt-2">Nearby book details coming soon.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
