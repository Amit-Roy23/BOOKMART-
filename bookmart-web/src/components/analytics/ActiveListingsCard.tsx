"use client";

import type { ActiveListing } from "@/types/analytics";
import { ChevronRight } from "lucide-react";

interface ActiveListingsCardProps {
  listings: ActiveListing[];
}

export default function ActiveListingsCard({ listings }: ActiveListingsCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Active Listings</h2>
          <p className="text-xs text-slate-500 mt-1">
            {listings.length} Active • {listings.filter((l) => l.status === "attention").length} needs attention
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-slate-900">{listings.length}</span>
          <ChevronRight size={20} className="text-slate-400" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  listing.status === "attention" ? "bg-orange-500" : "bg-emerald-500"
                }`}
                aria-label={listing.status === "attention" ? "Needs attention" : "Active"}
              />
              <span className="text-sm font-semibold text-slate-800">{listing.title}</span>
            </div>
            <span className="text-xs text-slate-500 capitalize">{listing.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
