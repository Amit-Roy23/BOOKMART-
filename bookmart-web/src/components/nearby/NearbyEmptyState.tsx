"use client";

import { MapPin } from "lucide-react";

interface NearbyEmptyStateProps {
  onUseLocation: () => void;
  onIncreaseRadius: () => void;
}

export default function NearbyEmptyState({ onUseLocation, onIncreaseRadius }: NearbyEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <MapPin className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-900">No books found nearby</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        Try increasing your search radius or changing your location.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onUseLocation}
          className="rounded-[12px] bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          Use Current Location
        </button>
        <button
          onClick={onIncreaseRadius}
          className="rounded-[12px] border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-primary hover:text-primary"
        >
          Increase Radius
        </button>
      </div>
    </div>
  );
}
