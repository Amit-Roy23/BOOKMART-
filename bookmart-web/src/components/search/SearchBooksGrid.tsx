"use client";

import SearchBookCard from "./SearchBookCard";

interface SearchBooksGridProps {
  books: {
    id: string;
    title: string;
    author: string;
    publisher: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviewCount: number;
    condition: string;
    language: string;
    format: string;
    available: boolean;
    seller: {
      name: string;
      avatar: string;
      rating: number;
      verified: boolean;
    };
    distance: string;
    favourite: boolean;
    category: string;
    subject: string;
  }[];
}

export default function SearchBooksGrid({ books }: SearchBooksGridProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <SearchBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
