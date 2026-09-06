"use client";

import { useState, useEffect } from "react";

export type DistanceFilter = "all" | "5km" | "10km" | "20km";
export type CategoryFilter = "all" | "Fiction" | "Non-fiction" | "Kids" | "Science" | "Comics & Manga" | "Stationery" | "Others";

interface UseNearbyMapReturn {
  selectedSellerId: string | null;
  setSelectedSellerId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: CategoryFilter;
  setActiveCategory: (category: CategoryFilter) => void;
  distanceFilter: DistanceFilter;
  setDistanceFilter: (filter: DistanceFilter) => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;
  userLocation: { lat: number; lng: number } | null;
}

const DEFAULT_LOCATION = { lat: 22.5726, lng: 88.3639 };

export function useNearbyMap(): UseNearbyMapReturn {
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>("all");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(DEFAULT_LOCATION);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation(DEFAULT_LOCATION);
        }
      );
    }
  }, []);

  return {
    selectedSellerId,
    setSelectedSellerId,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    distanceFilter,
    setDistanceFilter,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    selectedBookId,
    setSelectedBookId,
    userLocation,
  };
}
