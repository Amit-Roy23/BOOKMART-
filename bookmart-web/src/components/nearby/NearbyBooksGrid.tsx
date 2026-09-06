"use client";

import NearbyBookCard from "./NearbyBookCard";

interface NearbyBooksGridProps {
  books: {
    id: string;
    title: string;
    author: string;
    image: string;
    rating: number;
    reviewCount: number;
    condition: string;
    seller: {
      name: string;
      avatar: string;
      rating: number;
      verified: boolean;
    };
    distance: string;
    discount: number;
    price: number;
    originalPrice: number;
    favourite: boolean;
    badge?: string;
  }[];
}

export default function NearbyBooksGrid({ books }: NearbyBooksGridProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <NearbyBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
