"use client";

import { memo } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Listing } from "@/types/listings";
import { ListingMetrics } from "./ListingMetrics";
import { ListingStatusBadge } from "./ListingStatusBadge";
import { ListingActions } from "./ListingActions";

export interface ListingRowProps {
  listing: Listing;
  onEdit: () => void;
  onView: () => void;
  onBoost: () => void;
  onDuplicate: () => void;
  onMarkSold: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

function ListingRowBase({
  listing,
  onEdit,
  onView,
  onBoost,
  onDuplicate,
  onMarkSold,
  onArchive,
  onDelete,
}: ListingRowProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative w-[70px] h-[95px] rounded-lg overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="70px"
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate">{listing.title}</h3>
          <p className="text-sm text-slate-400">{listing.author}</p>
          <p className="text-base font-extrabold text-brand-primary mt-1">{formatPrice(listing.price)}</p>
        </div>
      </div>

      <ListingMetrics
        views={listing.views}
        interested={listing.interested}
        messages={listing.messages}
      />

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <ListingStatusBadge status={listing.status} />
        <ListingActions
          onEdit={onEdit}
          onView={onView}
          onBoost={onBoost}
          onDuplicate={onDuplicate}
          onMarkSold={onMarkSold}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export const ListingRow = memo(ListingRowBase);
