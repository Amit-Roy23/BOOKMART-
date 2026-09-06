"use client";

interface AuthorsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AuthorsSearch({ value, onChange }: AuthorsSearchProps) {
  return (
    <div className="relative w-full sm:w-[260px] shrink-0">
      <input
        type="text"
        placeholder="Search authors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[12px] border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
    </div>
  );
}
