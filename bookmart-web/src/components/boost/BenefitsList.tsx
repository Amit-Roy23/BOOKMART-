import { Check } from "lucide-react";

const BENEFITS = [
  "Top placement in search results",
  "Highlighted in relevant categories",
  "More visibility to interested buyers",
  "Better chance to sell faster",
];

export function BenefitsList() {
  return (
    <ul className="space-y-3">
      {BENEFITS.map((benefit) => (
        <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-600">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
            <Check className="w-3 h-3" aria-hidden="true" />
          </span>
          {benefit}
        </li>
      ))}
    </ul>
  );
}
