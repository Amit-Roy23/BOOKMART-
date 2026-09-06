import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";
import AuthorsPageClient from "@/components/authors/AuthorsPageClient";

export const metadata: Metadata = {
  title: "Authors | Bookmart",
  description: "Discover writers, poets, playwrights and more. Explore their books and works.",
};

export default function AuthorsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Authors" },
            ]}
          />
          <AuthorsPageClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
