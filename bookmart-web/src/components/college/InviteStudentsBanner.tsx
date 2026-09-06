"use client";

import { Users, Share2 } from "lucide-react";

interface InviteStudentsBannerProps {
  onInvite: () => void;
}

export function InviteStudentsBanner({ onInvite }: InviteStudentsBannerProps) {
  return (
    <section
      className="bg-gradient-to-br from-brand-light to-teal-primary/10 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
      aria-label="Invite students"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-14 h-14 rounded-full bg-white/70 text-brand-primary flex items-center justify-center shrink-0">
          <Users className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Invite More Students</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md">
            Help more students from your college discover and buy &amp; sell books.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onInvite}
        className="sm:ml-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary text-white px-5 py-3 text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        <Share2 className="w-4 h-4" aria-hidden="true" />
        Invite Now
      </button>
    </section>
  );
}
