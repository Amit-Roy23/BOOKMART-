import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";
import SearchPageClient from "@/components/search/SearchPageClient";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q || "";
  return {
    title: query ? `Search results for "${query}" | Bookmart` : "Search | Bookmart",
    description: query ? `Search results for ${query} on Bookmart` : "Search for books on Bookmart",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q || "";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Search", href: "/search" },
              ...(query ? [{ label: query }] : []),
            ]}
          />
          <SearchPageClient initialQuery={query} />
        </div>
      </main>
      <Footer />
    </>
  );
}
