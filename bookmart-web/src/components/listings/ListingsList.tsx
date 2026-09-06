"use client";

import { ListingRow } from "./ListingRow";
import type { Listing } from "@/types/listings";

export interface ListingsListProps {
  listings: Listing[];
  onEdit: (listing: Listing) => void;
  onView: (listing: Listing) => void;
  onBoost: (listing: Listing) => void;
  onDuplicate: (listing: Listing) => void;
  onMarkSold: (listing: Listing) => void;
  onArchive: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
}

export function ListingsList(props: ListingsListProps) {
  return (
    <section aria-label="Your listings" className="space-y-4">
      {props.listings.map((listing) => (
        <ListingRow
          key={listing.id}
          listing={listing}
          onEdit={() => props.onEdit(listing)}
          onView={() => props.onView(listing)}
          onBoost={() => props.onBoost(listing)}
          onDuplicate={() => props.onDuplicate(listing)}
          onMarkSold={() => props.onMarkSold(listing)}
          onArchive={() => props.onArchive(listing)}
          onDelete={() => props.onDelete(listing)}
        />
      ))}
    </section>
  );
}
