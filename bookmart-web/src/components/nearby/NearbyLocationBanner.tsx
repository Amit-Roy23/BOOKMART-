"use client";

import { MapPin, ChevronRight } from "lucide-react";

interface NearbyLocationBannerProps {
  radius: string;
  onLocationChange: () => void;
}

export default function NearbyLocationBanner({ radius, onLocationChange }: NearbyLocationBannerProps) {
  return (
    <div className="mt-10 rounded-[16px] border border-green-100 bg-green-50/50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-slate-600">
            Showing books available within <span className="font-bold text-slate-900">{radius}</span> of your location
          </p>
        </div>
        <button
          onClick={onLocationChange}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline transition-colors"
        >
          Change location
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
