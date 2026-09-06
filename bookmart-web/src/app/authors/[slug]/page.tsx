import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";
import AuthorHero from "@/components/author/AuthorHero";
import AuthorBiography from "@/components/author/AuthorBiography";
import AuthorBooksSection from "@/components/author/AuthorBooksSection";
import { authors } from "@/data/authors";

interface AuthorDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);

  if (!author) {
    return { title: "Author Not Found | Bookmart" };
  }

  return {
    title: `${author.name} | Bookmart`,
    description: author.bio,
  };
}

export default async function AuthorDetailsPage({ params }: AuthorDetailsPageProps) {
  const { slug } = await params;
  const author = authors.find((a) => a.slug === slug);

  if (!author) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Authors", href: "/authors" },
              { label: author.name },
            ]}
          />

          <AuthorHero author={author} />

          <div className="border-t border-slate-200 my-8" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <AuthorBiography about={author.about || author.bio} />
            </div>
            <div className="lg:col-span-8">
              {author.books && author.books.length > 0 ? (
                <AuthorBooksSection authorName={author.name} books={author.books} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">No books available</h3>
                  <p className="mt-2 text-sm text-slate-500 max-w-sm">
                    This author does not have any books listed yet.
                  </p>
                  <Link
                    href="/authors"
                    className="mt-6 rounded-[12px] bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    Return to Authors
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
