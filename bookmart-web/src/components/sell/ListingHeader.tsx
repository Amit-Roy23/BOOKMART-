import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/category/Breadcrumb";

export default function ListingHeader() {
  return (
    <div className="mb-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sell Book" },
        ]}
      />
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Listing
      </Link>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              List Your Book
            </h1>
          </div>
          <p className="text-base text-slate-500 max-w-lg">
            Fill in the details below to list your book for other students.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-light/50 px-3 py-1.5 text-xs font-bold text-brand-primary">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary" />
            Simple & Free
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
            <span className="flex h-2 w-2 rounded-full bg-slate-700" />
            Instant Alerts
          </span>
        </div>
      </div>
    </div>
  );
}
