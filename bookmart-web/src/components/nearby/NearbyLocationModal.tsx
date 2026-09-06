"use client";

import { useState } from "react";

interface NearbyLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
}

export default function NearbyLocationModal({
  isOpen,
  onClose,
  onSelectLocation,
}: NearbyLocationModalProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Change Location</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[12px] border border-slate-200 py-3 pl-4 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        </div>

        <div className="space-y-2 mb-4">
          <button
            onClick={() => onSelectLocation("Current Location")}
            className="w-full flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="text-lg">📍</span>
            <div>
              <p className="text-sm font-bold text-slate-900">Use Current Location</p>
              <p className="text-xs text-slate-500">Detect automatically</p>
            </div>
          </button>

          <button
            onClick={() => onSelectLocation("Delhi, India")}
            className="w-full flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="text-lg">🏙️</span>
            <div>
              <p className="text-sm font-bold text-slate-900">Delhi, India</p>
              <p className="text-xs text-slate-500">Recent</p>
            </div>
          </button>

          <button
            onClick={() => onSelectLocation("Mumbai, India")}
            className="w-full flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span className="text-lg">🏙️</span>
            <div>
              <p className="text-sm font-bold text-slate-900">Mumbai, India</p>
              <p className="text-xs text-slate-500">Recent</p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-[12px] border border-slate-200 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-primary hover:text-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
