import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";
import BookGallery from "@/components/book-details/BookGallery";
import PurchaseCard from "@/components/book-details/PurchaseCard";
import RatingDistribution from "@/components/book-details/RatingDistribution";
import ReviewCard from "@/components/book-details/ReviewCard";
import WhyReadCard from "@/components/book-details/WhyReadCard";
import { Star, Heart } from "lucide-react";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

interface BookData {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  discount: number;
  condition: string;
  language: string;
  pages: number;
  published: string;
  format: string;
  rating: number;
  reviewCount: number;
  totalRatings: number;
  totalReviews: number;
  averageRating: number;
  seller: {
    name: string;
    verified: boolean;
    distance: string;
  };
  stock: number;
  available: boolean;
  favourite: boolean;
  images: string[];
  description: string;
  whyReadPoints: string[];
  ratingDistribution: { stars: number; percentage: number }[];
  reviewsList: {
    reviewerName: string;
    rating: number;
    reviewText: string;
    date: string;
    verifiedPurchase: boolean;
  }[];
}

const BOOKS: Record<string, BookData> = {
  "1": {
    id: "1",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    price: 390,
    originalPrice: 650,
    discount: 40,
    condition: "Like New",
    language: "English",
    pages: 371,
    published: "2003",
    format: "Paperback",
    rating: 4.8,
    reviewCount: 230,
    totalRatings: 1248,
    totalReviews: 328,
    averageRating: 4.0,
    seller: {
      name: "Arjun Mehta",
      verified: true,
      distance: "0.6 km",
    },
    stock: 5,
    available: true,
    favourite: false,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    description:
      "The Kite Runner is the first novel by Afghan-American author Khaled Hosseini. Published in 2003 by Riverhead Books, it tells the story of Amir, a young boy from the Wazir Akbar Khan district of Kabul. The story is set against a backdrop of tumultuous events, from the fall of Afghanistan's monarchy through the Soviet invasion and the rise of the Taliban.",
    whyReadPoints: [
      "A powerful story of friendship, betrayal and redemption.",
      "Beautifully written and emotionally gripping.",
      "Provides a deeply personal look at Afghanistan's history.",
      "Explores themes of guilt, redemption, and the complexity of human relationships.",
    ],
    ratingDistribution: [
      { stars: 5, percentage: 52 },
      { stars: 4, percentage: 28 },
      { stars: 3, percentage: 12 },
      { stars: 2, percentage: 5 },
      { stars: 1, percentage: 3 },
    ],
    reviewsList: [
      {
        reviewerName: "Priya Sharma",
        rating: 5,
        reviewText:
          "Absolutely masterpiece! Khaled Hosseini weaves a tale that stays with you long after you finish reading. The emotional depth is unmatched.",
        date: "2024-12-15",
        verifiedPurchase: true,
      },
      {
        reviewerName: "Rahul Verma",
        rating: 4,
        reviewText:
          "A compelling story with beautiful prose. The characters feel real and the historical context adds immense value.",
        date: "2024-11-28",
        verifiedPurchase: true,
      },
      {
        reviewerName: "Ananya Iyer",
        rating: 5,
        reviewText:
          "One of the best books I've ever read. Heartbreaking yet hopeful. A must-read for everyone.",
        date: "2024-10-10",
        verifiedPurchase: false,
      },
      {
        reviewerName: "Vikram Patel",
        rating: 4,
        reviewText:
          "Devastating and beautiful. Hosseini's writing is lyrical and the story is both specific and universal.",
        date: "2024-09-22",
        verifiedPurchase: true,
      },
    ],
  },
  "2": {
    id: "2",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 250,
    originalPrice: 499,
    discount: 50,
    condition: "Excellent",
    language: "English",
    pages: 197,
    published: "1988",
    format: "Paperback",
    rating: 4.7,
    reviewCount: 180,
    totalRatings: 980,
    totalReviews: 245,
    averageRating: 4.3,
    seller: {
      name: "Neha Kapoor",
      verified: true,
      distance: "1.2 km",
    },
    stock: 3,
    available: true,
    favourite: true,
    images: [
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    description:
      "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller. The story follows the journey of an Andalusian shepherd boy named Santiago.",
    whyReadPoints: [
      "A timeless tale about following your dreams.",
      "Simple yet profound wisdom woven into an engaging story.",
      "Inspiring for anyone at a crossroads in life.",
    ],
    ratingDistribution: [
      { stars: 5, percentage: 60 },
      { stars: 4, percentage: 25 },
      { stars: 3, percentage: 10 },
      { stars: 2, percentage: 3 },
      { stars: 1, percentage: 2 },
    ],
    reviewsList: [
      {
        reviewerName: "Karan Singh",
        rating: 5,
        reviewText: "Life-changing book. Every page feels like a gentle nudge towards your dreams.",
        date: "2024-12-01",
        verifiedPurchase: true,
      },
      {
        reviewerName: "Ishita Bansal",
        rating: 4,
        reviewText: "Beautifully written. A quick read that leaves a lasting impression.",
        date: "2024-11-15",
        verifiedPurchase: true,
      },
      {
        reviewerName: "Rohit Verma",
        rating: 5,
        reviewText: "A book that teaches you to listen to your heart. Highly recommend.",
        date: "2024-10-20",
        verifiedPurchase: false,
      },
    ],
  },
  "3": {
    id: "3",
    title: "Ikigai",
    author: "Hector Garcia",
    price: 160,
    originalPrice: 350,
    discount: 54,
    condition: "Good Condition",
    language: "English",
    pages: 208,
    published: "2016",
    format: "Paperback",
    rating: 4.5,
    reviewCount: 120,
    totalRatings: 750,
    totalReviews: 189,
    averageRating: 4.1,
    seller: {
      name: "Arjun Mehta",
      verified: true,
      distance: "0.6 km",
    },
    stock: 2,
    available: true,
    favourite: false,
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    description:
      "Ikigai: The Japanese Secret to a Long and Happy Life is a book by Hector Garcia and Francesc Miralles. It explores the concept of ikigai, which translates to 'a reason for being' or 'a reason to wake up in the morning'.",
    whyReadPoints: [
      "Discover the Japanese secret to longevity and happiness.",
      "Practical insights for finding purpose in daily life.",
      "Combines philosophy with actionable lifestyle advice.",
    ],
    ratingDistribution: [
      { stars: 5, percentage: 55 },
      { stars: 4, percentage: 30 },
      { stars: 3, percentage: 10 },
      { stars: 2, percentage: 3 },
      { stars: 1, percentage: 2 },
    ],
    reviewsList: [
      {
        reviewerName: "Sneha Gupta",
        rating: 4,
        reviewText: "A gentle reminder to live intentionally. Loved the Japanese anecdotes.",
        date: "2024-11-05",
        verifiedPurchase: true,
      },
      {
        reviewerName: "Amit Roy",
        rating: 5,
        reviewText: "This book changed my perspective on daily habits and purpose.",
        date: "2024-10-18",
        verifiedPurchase: true,
      },
    ],
  },
  "4": {
    id: "4",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    price: 220,
    originalPrice: 450,
    discount: 51,
    condition: "Like New",
    language: "English",
    pages: 336,
    published: "1997",
    format: "Paperback",
    rating: 4.6,
    reviewCount: 150,
    totalRatings: 890,
    totalReviews: 210,
    averageRating: 4.2,
    seller: {
      name: "Neha Sharma",
      verified: true,
      distance: "0.7 km",
    },
    stock: 4,
    available: true,
    favourite: true,
    images: [
      "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    ],
    description:
      "Rich Dad Poor Dad is a 1997 book written by Robert Kiyosaki and Sharon Lechter. It advocates the importance of financial literacy, financial independence, and building wealth through investing in assets.",
    whyReadPoints: [
      "Mindset shift from working for money to making money work for you.",
      "Practical financial lessons wrapped in simple stories.",
      "Timeless principles for building wealth.",
    ],
    ratingDistribution: [
      { stars: 5, percentage: 58 },
      { stars: 4, percentage: 22 },
      { stars: 3, percentage: 12 },
      { stars: 2, percentage: 5 },
      { stars: 1, percentage: 3 },
    ],
    reviewsList: [
      {
        reviewerName: "Rohit Verma",
        rating: 5,
        reviewText: "Essential reading for anyone interested in financial freedom.",
        date: "2024-12-10",
        verifiedPurchase: true,
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(BOOKS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: BookDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = BOOKS[id];

  if (!book) {
    return { title: "Book Not Found | Bookmart" };
  }

  return {
    title: `${book.title} by ${book.author} | Bookmart`,
    description: book.description,
  };
}

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { id } = await params;
  const book = BOOKS[id];

  if (!book) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Books", href: "/books" },
              { label: book.author },
              { label: book.title },
            ]}
          />

          {/* Main Layout */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Gallery ≈30% */}
            <div className="lg:col-span-4">
              <BookGallery images={book.images} title={book.title} />
            </div>

            {/* Center Column - Book Info ≈42% */}
            <div className="lg:col-span-5 space-y-6">
              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-[40px] md:text-[48px] font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                    {book.title}
                  </h1>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-primary">{book.author}</span>
                    {book.seller.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        <Star size={10} className="fill-blue-500 text-blue-500" />
                        Verified Author
                      </span>
                    )}
                  </div>
                </div>

                <button className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shrink-0">
                  <Heart size={14} className={book.favourite ? "fill-rose-500 text-rose-500" : ""} />
                  Wishlist
                </button>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={star <= Math.round(book.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-900">{book.averageRating}</span>
                <span className="text-sm text-slate-500 font-medium">
                  ({book.totalRatings.toLocaleString()} ratings)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-sm text-slate-500">{book.totalReviews} reviews</span>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="text-base">📖</span>
                  {book.format}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-base">📅</span>
                  Published {book.published}
                </span>
                <span className="flex items-center gap-2 text-slate-900 font-medium">
                  <span className="text-base">🌐</span>
                  {book.language}
                </span>
                <span className="flex items-center gap-2 text-slate-900 font-medium">
                  <span className="text-base">📄</span>
                  {book.pages} pages
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200" />

              {/* About */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900">About the book</h2>
                <div className="mt-4 max-w-prose">
                  <p className="text-base text-slate-600 leading-relaxed line-clamp-5">
                    {book.description}
                  </p>
                  <button className="mt-3 text-sm font-bold text-primary hover:underline transition-all">
                    Read more
                  </button>
                </div>
              </div>

              {/* Why Read */}
              <WhyReadCard points={book.whyReadPoints} />
            </div>

            {/* Right Column - Purchase Card ≈28% */}
            <div className="lg:col-span-3">
              <PurchaseCard book={book} />
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mt-16 rounded-[20px] border border-slate-100 bg-white p-8 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left - Rating Distribution */}
              <div className="lg:col-span-4">
                <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">Reviews ({book.totalReviews})</h2>
                <div className="mt-8">
                  <RatingDistribution
                    average={book.averageRating}
                    totalRatings={book.totalRatings}
                    totalReviews={book.totalReviews}
                    distribution={book.ratingDistribution}
                  />
                </div>
              </div>

              {/* Right - Reviews List */}
              <div className="lg:col-span-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[22px] font-bold text-slate-900">Recent Reviews</h3>
                  <button className="flex items-center gap-2 rounded-[12px] border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-all duration-200 hover:border-primary hover:text-primary">
                    Write a review
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {book.reviewsList.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
