import { Rocket } from "lucide-react";

interface BoostHeaderProps {
  title?: string;
  subtitle?: string;
}

export function BoostHeader({
  title = "Boost Listing",
  subtitle = "Increase visibility and reach more students interested in buying.",
}: BoostHeaderProps) {
  return (
    <header className="relative mb-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-base text-slate-500 mt-2">{subtitle}</p>
      </div>
      <div
        className="pointer-events-none absolute right-0 top-0 hidden md:flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-light text-brand-primary animate-float"
        aria-hidden="true"
      >
        <Rocket className="w-9 h-9" />
      </div>
    </header>
  );
}
