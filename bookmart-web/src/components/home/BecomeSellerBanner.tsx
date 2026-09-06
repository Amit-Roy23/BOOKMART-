import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function BecomeSellerBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20" aria-label="Become a seller CTA">
      <div className="bg-gradient-to-br from-teal-primary to-teal-primary/80 rounded-2xl overflow-hidden relative">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-8 lg:p-12">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">
              Sell Your Old Books in Minutes
            </h2>
            <p className="text-teal-primary/80 font-medium mb-6 max-w-md">
              Turn your old books into cash. List your books in seconds and reach thousands of students
              in your college and nearby areas.
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 bg-white text-teal-primary font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
            >
              Start Selling <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1 relative h-64 lg:h-auto w-full lg:min-h-[240px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <svg width="300" height="300" viewBox="0 0 300 300" fill="none" className="text-white">
                <circle cx="150" cy="150" r="120" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
                <path d="M150 80V180M90 150H190M120 120L180 180" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute bottom-8 right-8 w-32 h-40 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20" />
            <div className="absolute top-12 left-12 w-24 h-32 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 transform rotate-[15deg]" />
          </div>
        </div>
      </div>
    </section>
  );
}