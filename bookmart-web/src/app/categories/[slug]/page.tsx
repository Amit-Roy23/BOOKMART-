import { Metadata } from "next";
import { notFound } from "next/navigation";
import { books } from "@/data/books";
import CategoryBanner from "@/components/category/CategoryBanner";
import Breadcrumb from "@/components/category/Breadcrumb";
import CategoryHeader from "@/components/category/CategoryHeader";
import FilterSidebar from "@/components/category/FilterSidebar";
import Toolbar from "@/components/category/Toolbar";
import BookGrid from "@/components/category/BookGrid";
import { Header } from "@/components/layout/Header";

const CATEGORIES: Record<string, { title: string; description: string }> = {
  "science-fiction": {
    title: "Science Fiction",
    description:
      "Explore a curated collection of pre-owned Science Fiction books from verified students and trusted sellers near you.",
  },
  romance: {
    title: "Romance",
    description:
      "Discover heartwarming romance novels from fellow readers in your community.",
  },
  "self-help": {
    title: "Self Help",
    description:
      "Find life-changing self-help books at unbeatable prices from verified sellers.",
  },
  business: {
    title: "Business",
    description:
      "Build your business acumen with second-hand books from entrepreneurs and students.",
  },
  biographies: {
    title: "Biographies",
    description:
      "Read about the lives of extraordinary people through pre-owned biography copies.",
  },
  history: {
    title: "History",
    description:
      "Journey through time with affordable history books from local collectors.",
  },
  philosophy: {
    title: "Philosophy",
    description:
      "Explore deep philosophical works from students and academic bookstores.",
  },
  "exam-prep": {
    title: "Exam Prep",
    description:
      "Prepare for your exams with cheap second-hand prep books from toppers.",
  },
  "young-adult": {
    title: "Young Adult",
    description:
      "Discover engaging YA fiction from fellow young readers near you.",
  },
  poetry: {
    title: "Poetry",
    description:
      "Immerse yourself in beautiful poetry collections from established and emerging poets.",
  },
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) {
    return { title: "Category Not Found | Bookmart" };
  }

  return {
    title: `${category.title} Books | Bookmart`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) {
    notFound();
  }

  const filteredBooks = books.filter(
    (book) => book.category?.toLowerCase() === category.title.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.title },
        ]}
      />

      <CategoryBanner
        title={`Discover ${category.title} Books`}
        subtitle={
          category.description ||
          "Buy affordable second-hand books from verified students and trusted sellers near you."
        }
      />

      <CategoryHeader
        title={category.title}
        description={category.description}
        totalBooks={filteredBooks.length || 1248}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-[280px] shrink-0">
          <FilterSidebar />
        </aside>

        <div className="flex-1 min-w-0">
          <Toolbar totalBooks={filteredBooks.length || 1248} />
          <BookGrid />
        </div>
      </div>
      </div>
    </main>
  );
}
