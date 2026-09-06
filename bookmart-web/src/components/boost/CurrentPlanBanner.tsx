"use client";

import { Crown } from "lucide-react";

interface CurrentPlanBannerProps {
  planName: string;
  boostLimit: number;
  onManage: () => void;
}

export function CurrentPlanBanner({ planName, boostLimit, onManage }: CurrentPlanBannerProps) {
  return (
    <section className="mt-6 bg-brand-primary/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 border border-brand-primary/10">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-full bg-white text-brand-primary flex items-center justify-center shrink-0">
          <Crown className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Your Current Plan: {planName}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            You can boost up to {boostLimit} books per day.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onManage}
        className="sm:ml-auto shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-brand-primary hover:border-brand-primary hover:bg-brand-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        Manage Plan
      </button>
    </section>
  );
}
