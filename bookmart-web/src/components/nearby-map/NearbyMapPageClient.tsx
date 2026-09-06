"use client";

import { useState, useMemo } from "react";
import { useNearbyMap } from "@/hooks/useNearbyMap";
import NearbySearchBar from "./NearbySearchBar";
import NearbyCategoryTabs from "./NearbyCategoryTabs";
import NearbyFilterDrawer from "./NearbyFilterDrawer";
import SellerInformationPanel from "./SellerInformationPanel";
import NearbyBooksCarousel from "./NearbyBooksCarousel";
import NearbySkeleton from "./NearbySkeleton";
import NearbyEmptyState from "./NearbyEmptyState";
import NearbyMapWrapper from "./NearbyMapWrapper";
import { sellers } from "@/data/nearbySellers";
import { nearbyMapBooks } from "@/data/nearbyMapBooks";

const CATEGORIES = ["All", "Fiction", "Non-fiction", "Kids", "Science", "Comics & Manga", "Stationery", "Others"];

export default function NearbyMapPageClient() {
  const {
    selectedSellerId,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    selectedBookId,
    setSelectedBookId,
  } = useNearbyMap();

  const [isLoading] = useState(false);

  const filteredBooks = useMemo(() => {
    let books = [...nearbyMapBooks];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.sellerName.toLowerCase().includes(q) ||
          book.category.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "all") {
      books = books.filter((book) => book.category === activeCategory);
    }

    if (selectedSellerId) {
      books = books.filter((book) => book.sellerId === selectedSellerId);
    }

    return books;
  }, [searchQuery, activeCategory, selectedSellerId]);

  const selectedSeller = sellers.find((s) => s.id === selectedSellerId) || null;

  if (isLoading) {
    return <NearbySkeleton />;
  }

  if (filteredBooks.length === 0 && !selectedSellerId) {
    return <NearbyEmptyState />;
  }

  return (
    <>
      <NearbySearchBar value={searchQuery} onChange={setSearchQuery} />
      <NearbyCategoryTabs
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onOpenFilters={() => setIsFilterDrawerOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <NearbyMapWrapper sellers={sellers} />
        </div>
        <div className="lg:col-span-4">
          <SellerInformationPanel seller={selectedSeller} />
        </div>
      </div>

      <NearbyBooksCarousel
        books={filteredBooks}
        selectedBookId={selectedBookId}
        onBookSelect={setSelectedBookId}
      />

      <NearbyFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApply={() => {}}
      />
    </>
  );
}
