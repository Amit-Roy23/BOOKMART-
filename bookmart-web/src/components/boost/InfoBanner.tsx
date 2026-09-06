import { TrendingUp } from "lucide-react";

export function InfoBanner() {
  return (
    <section className="bg-gradient-to-br from-brand-light to-teal-primary/10 rounded-2xl shadow-sm p-6 flex items-start gap-4 mb-10">
      <div className="w-12 h-12 rounded-full bg-white text-brand-primary flex items-center justify-center shrink-0 shadow-sm">
        <TrendingUp className="w-6 h-6" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-slate-700 leading-relaxed">
        Your boosted books will appear at the top of search results and in relevant categories.
      </p>
    </section>
  );
}
