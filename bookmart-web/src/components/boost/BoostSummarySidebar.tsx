"use client";

import Image from "next/image";
import { PlanDetails } from "./PlanDetails";
import { BenefitsList } from "./BenefitsList";
import { BoostButton } from "./BoostButton";
import type { BoostBook } from "@/types/boost";

interface BoostSummarySidebarProps {
  books: BoostBook[];
  selectedBookIds: string[];
  planName: string;
  price: number;
  boostLimit: number;
  durationDays: number;
  boosting: boolean;
  canSubmit: boolean;
  onBoost: () => void;
}

export function BoostSummarySidebar({
  books,
  selectedBookIds,
  planName,
  price,
  boostLimit,
  durationDays,
  boosting,
  canSubmit,
  onBoost,
}: BoostSummarySidebarProps) {
  const selectedBooks = books.filter((b) => selectedBookIds.includes(b.id));
  const first = selectedBooks[0];
  const count = selectedBooks.length;

  return (
    <aside className="lg:sticky lg:top-24 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-6">
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Boost Summary</h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="relative w-[48px] h-[64px] rounded-lg overflow-hidden bg-slate-100 shrink-0">
            {first ? (
              <Image src={first.image} alt={first.title} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="absolute inset-0 bg-slate-100" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {first ? first.title : "No books selected"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {count > 0 ? `${count} book${count === 1 ? "" : "s"} selected` : "Select a book to boost"}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3">Boosted books will be visible for 24 hours.</p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <PlanDetails
          planName={planName}
          boostLimit={boostLimit}
          durationDays={durationDays}
          price={price}
        />
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-sm font-extrabold text-slate-900 mb-3">What You Get</h3>
        <BenefitsList />
      </div>

      <div className="border-t border-slate-100 pt-6">
        <BoostButton
          disabled={!canSubmit}
          loading={boosting}
          count={count}
          onClick={onBoost}
        />
      </div>
    </aside>
  );
}
