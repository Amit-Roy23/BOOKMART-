import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { NearestBooksRow } from "@/components/book/NearestBookCard";
import { CollegeFeedRow } from "@/components/book/CollegeBookCard";
import { PopularAuthorsRow } from "@/components/book/AuthorCard";
import { StatisticsSection } from "@/components/home/StatisticsSection";
import { BecomeSellerBanner } from "@/components/home/BecomeSellerBanner";
import { Footer } from "@/components/layout/Footer";
import { MockListing, MockAuthor } from "@/types";

const NEAREST_BOOKS: MockListing[] = [
  {
    id: "1",
    title: "Ikigai",
    author: "Hector Garcia",
    price: 160,
    condition: "Good Condition",
    sellerName: "Arjun Mehta",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    distance: "0.5 km",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
  },
  {
    id: "2",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    price: 220,
    condition: "Like New",
    sellerName: "Neha Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    distance: "0.7 km",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400",
  },
  {
    id: "3",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 180,
    condition: "Good Condition",
    sellerName: "Rohit Verma",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
  },
  {
    id: "4",
    title: "Atomic Habits",
    author: "James Clear",
    price: 250,
    condition: "Like New",
    sellerName: "Karan Singh",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    distance: "1.4 km",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
  },
  {
    id: "5",
    title: "Deep Work",
    author: "Cal Newport",
    price: 190,
    condition: "Good Condition",
    sellerName: "Ishita Bansal",
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    distance: "1.6 km",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
  },
  {
    id: "6",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 150,
    condition: "Good Condition",
    sellerName: "Vivek Tiwari",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    distance: "1.8 km",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
  },
];

const FROM_YOUR_COLLEGE: MockListing[] = [
  {
    id: "c1",
    title: "Fingersmith",
    author: "Sarah Waters",
    price: 200,
    condition: "Good Condition",
    sellerName: "Amit Roy",
    sellerAvatar: "",
    description:
      "Widely celebrated for its intricate 'Dickensian' plot, atmosphere and unforgettable characters.",
    image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=400",
  },
  {
    id: "c2",
    title: "The Skin and Its Girl",
    author: "Sarah Cypher",
    price: 180,
    condition: "Like New",
    sellerName: "Amit Roy",
    sellerAvatar: "",
    description:
      "Widely celebrated for its intricate 'Dickensian' plot, atmosphere and unforgettable characters.",
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400",
  },
  {
    id: "c3",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    price: 220,
    condition: "Good Condition",
    sellerName: "Diya Patel",
    sellerAvatar: "",
    description: "Explores the history of our species from ancient times to the present.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
  },
  {
    id: "c4",
    title: "The Power of Your Subconscious Mind",
    author: "Joseph Murphy",
    price: 160,
    condition: "Good Condition",
    sellerName: "Rohit Verma",
    sellerAvatar: "",
    description: "Unlock the power within and achieve success and happiness.",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
  },
];

const POPULAR_AUTHORS: MockAuthor[] = [
  {
    name: "Joe Abercrombie",
    booksCount: 12,
    rating: 5,
    bio: "British author of epic fantasy fiction, known for his gritty and morally complex characters.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
  },
  {
    name: "Chetan Bhagat",
    booksCount: 9,
    rating: 4,
    bio: "India's best-selling English author known for his relatable stories and contemporary fiction.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300",
  },
  {
    name: "Robert Kiyosaki",
    booksCount: 7,
    rating: 5,
    bio: "Entrepreneur and author of the personal finance classic Rich Dad Poor Dad.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
  },
  {
    name: "Margaret Atwood",
    booksCount: 15,
    rating: 5,
    bio: "Acclaimed author of literary fiction, poetry, and feminist themes.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
  },
  {
    name: "Dan Brown",
    booksCount: 6,
    rating: 4,
    bio: "Bestselling author of thrillers including The Da Vinci Code.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
  },
  {
    name: "Arundhati Roy",
    booksCount: 5,
    rating: 5,
    bio: "Author, activist, and essayist known for her powerful storytelling.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300",
  },
];

export default function BookmartHomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">
      <Header />
      <main id="main-content" className="focus:outline-none">
        <HeroBanner />
        <CategoriesSection />
        <NearestBooksRow books={NEAREST_BOOKS} title="Books Near You" />
        <CollegeFeedRow books={FROM_YOUR_COLLEGE} title="From Your College" />
        <PopularAuthorsRow authors={POPULAR_AUTHORS} title="Popular Authors" />
        <StatisticsSection />
        <BecomeSellerBanner />
      </main>
      <Footer />
    </div>
  );
}
