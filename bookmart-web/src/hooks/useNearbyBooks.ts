"use client";

import { useMemo, useState } from "react";
import { nearbyBooks } from "@/data/nearbyBooks";
import { NearbyBook } from "@/types/nearby-book";

export type DistanceFilter = "all" | "20km" | "50km";
export type SortOption = "nearest" | "rating" | "price-low" | "price-high";

interface UseNearbyBooksReturn {
  books: ReturnType<typeof useMemo>;
  distanceFilter: DistanceFilter;
  setDistanceFilter: (filter: DistanceFilter) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  location: string;
  setLocation: (location: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resetFilters: () => void;
}

export function useNearbyBooks(): UseNearbyBooksReturn {
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>("20km");
  const [sortOption, setSortOption] = useState<SortOption>("nearest");
  const [location, setLocation] = useState("Current Location");
  const [isLoading, setIsLoading] = useState(false);

  const books = useMemo(() => {
    let filtered = [...nearbyBooks];

    if (distanceFilter === "20km") {
      filtered = filtered.filter((book: NearbyBook) => parseFloat(book.distance) <= 20);
    } else if (distanceFilter === "50km") {
      filtered = filtered.filter((book: NearbyBook) => parseFloat(book.distance) <= 50);
    }

    filtered.sort((a: NearbyBook, b: NearbyBook) => {
      if (sortOption === "nearest") {
        return parseFloat(a.distance) - parseFloat(b.distance);
      } else if (sortOption === "rating") {
        return b.rating - a.rating;
      } else if (sortOption === "price-low") {
        return a.price - b.price;
      } else if (sortOption === "price-high") {
        return b.price - a.price;
      }
      return 0;
    });

    return filtered;
  }, [distanceFilter, sortOption]);

  function resetFilters() {
    setDistanceFilter("20km");
    setSortOption("nearest");
    setLocation("Current Location");
  }

  return {
    books,
    distanceFilter,
    setDistanceFilter,
    sortOption,
    setSortOption,
    location,
    setLocation,
    isLoading,
    setIsLoading,
    resetFilters,
  };
}
