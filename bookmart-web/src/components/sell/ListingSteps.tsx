import { BookOpen, MousePointerClick, Tag } from "lucide-react";

export default function ListingSteps({ step }: { step: number }) {
  const steps = [
    { label: "Photos", icon: BookOpen },
    { label: "Basic Info", icon: MousePointerClick },
    { label: "Condition & Price", icon: Tag },
  ];

  return (
    <div className="relative mb-10">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-100" />
      </div>
      <ol className="relative flex items-center justify-between">
        {steps.map((s, index) => (
          <li key={s.label} className="flex flex-1 items-center last:flex-initial">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  step >= index + 1 ? "bg-brand-primary" : "bg-slate-200 text-slate-500"
                }`}
              >
                {index + 1}
              </span>
              <span className={`hidden sm:inline-flex text-sm font-semibold items-center gap-2 ${step >= index + 1 ? "text-slate-900" : "text-slate-400"}`}>
                <s.icon size={16} />
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className="ml-2 h-px flex-1 bg-slate-100 hidden sm:block" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
