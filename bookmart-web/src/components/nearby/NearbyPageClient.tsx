"use client";

import { useState } from "react";
import type { NearbyBook } from "@/types/nearby-book";
import NearbyHero from "./NearbyHero";
import NearbyFilters from "./NearbyFilters";
import NearbyBooksGrid from "./NearbyBooksGrid";
import NearbyLocationBanner from "./NearbyLocationBanner";
import NearbyLocationModal from "./NearbyLocationModal";
import NearbySkeleton from "./NearbySkeleton";
import NearbyEmptyState from "./NearbyEmptyState";

interface NearbyPageClientProps {
  initialBooks: NearbyBook[];
}

export default function NearbyPageClient({ initialBooks }: NearbyPageClientProps) {
  const [books] = useState(initialBooks);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("Current Location");
  const [distanceFilter, setDistanceFilter] = useState("20km");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleUseMyLocation() {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation("Your Current Location");
        setIsLoading(false);
      },
      () => {
        setError("Unable to retrieve your location. Please enable location permissions.");
        setIsLoading(false);
      }
    );
  }

  function handleDistanceChange(filter: string) {
    setDistanceFilter(filter);
  }

  function handleLocationSelect(selectedLocation: string) {
    setLocation(selectedLocation);
    setIsModalOpen(false);
  }

  return (
    <>
      <NearbyHero location={location} />

      <NearbyFilters
        distanceFilter={distanceFilter}
        onDistanceChange={handleDistanceChange}
        onUseMyLocation={handleUseMyLocation}
      />

      {error && (
        <div className="mb-6 rounded-[12px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <NearbySkeleton />
      ) : books.length === 0 ? (
        <NearbyEmptyState
          onUseLocation={handleUseMyLocation}
          onIncreaseRadius={() => setDistanceFilter("50km")}
        />
      ) : (
        <NearbyBooksGrid books={books} />
      )}

      <NearbyLocationBanner
        radius={distanceFilter === "50km" ? "50KM" : "20KM"}
        onLocationChange={() => setIsModalOpen(true)}
      />

      <NearbyLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleLocationSelect}
      />
    </>
  );
}
