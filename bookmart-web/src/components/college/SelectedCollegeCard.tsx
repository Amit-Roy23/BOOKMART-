"use client";

import { Building2 } from "lucide-react";
import type { College } from "@/types/college";

interface SelectedCollegeCardProps {
  college: College;
  onChange: () => void;
}

export function SelectedCollegeCard({ college, onChange }: SelectedCollegeCardProps) {
  return (
    <section
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
      aria-label="Selected college"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-14 h-14 rounded-full bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
          <Building2 className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">{college.name}</h2>
          <p className="text-sm text-slate-500 truncate">{college.university}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        className="sm:ml-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-brand-primary hover:border-brand-primary hover:bg-brand-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        Change College
      </button>
    </section>
  );
}
