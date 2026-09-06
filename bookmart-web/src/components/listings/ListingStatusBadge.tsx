"use client";

import type { ListingStatus } from "@/types/listings";

const STATUS_MAP: Record<ListingStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-50 text-emerald-600" },
  sold: { label: "Sold", className: "bg-slate-100 text-slate-600" },
  draft: { label: "Draft", className: "bg-amber-50 text-amber-600" },
  expired: { label: "Expired", className: "bg-rose-50 text-rose-600" },
  pending: { label: "Pending Review", className: "bg-sky-50 text-sky-600" },
};

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  const { label, className } = STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {label}
    </span>
  );
}
