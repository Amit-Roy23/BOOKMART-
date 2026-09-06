"use client";

import { Loader2, Rocket } from "lucide-react";

interface BoostButtonProps {
  disabled: boolean;
  loading: boolean;
  count: number;
  onClick: () => void;
}

export function BoostButton({ disabled, loading, count, onClick }: BoostButtonProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full h-14 rounded-xl bg-brand-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : (
          <Rocket className="w-5 h-5" aria-hidden="true" />
        )}
        {loading ? "Boosting..." : "Boost Now"}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-3">
        <Rocket className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
        {count} boost{count === 1 ? "" : "s"} will be used
      </p>
    </div>
  );
}
