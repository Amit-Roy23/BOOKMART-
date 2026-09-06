"use client";

import { MapPin, Navigation } from "lucide-react";

interface NearbyFiltersProps {
  distanceFilter: string;
  onDistanceChange: (filter: string) => void;
  onUseMyLocation: () => void;
}

export default function NearbyFilters({
  distanceFilter,
  onDistanceChange,
  onUseMyLocation,
}: NearbyFiltersProps) {
  const filters = [
    { label: "Nearest To You", value: "nearest" },
    { label: "Upto 20KM", value: "20km" },
    { label: "Upto 50KM", value: "50km" },
  ];

  return (
    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onUseMyLocation}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary hover:text-primary"
        >
          <MapPin size={16} className="text-primary" />
          Use my location
        </button>

        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onDistanceChange(filter.value)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                distanceFilter === filter.value
                  ? "bg-primary text-white"
                  : "border border-slate-200 text-slate-700 hover:border-primary hover:text-primary"
              }`}
            >
              {filter.value === "nearest" && <Navigation size={14} className="inline mr-1.5" />}
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
