import { memo } from "react";
import { Check, BadgeCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { BoostPlan } from "@/types/boost";

interface PlanCardProps {
  plan: BoostPlan;
  selected: boolean;
  onSelect: (id: BoostPlan["id"]) => void;
}

function PlanCardBase({ plan, selected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      aria-pressed={selected}
      className={`relative flex flex-col items-center text-center rounded-2xl border-2 bg-white p-7 shadow-sm transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
        selected
          ? "border-brand-primary bg-brand-primary/5 -translate-y-1"
          : "border-slate-200 hover:-translate-y-1 hover:border-brand-primary"
      }`}
    >
      {selected && (
        <span className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white shadow-sm">
          <Check className="w-4 h-4" aria-hidden="true" />
        </span>
      )}

      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-brand-primary px-3 py-0.5 text-[10px] font-bold text-white">
          <BadgeCheck className="w-3 h-3" aria-hidden="true" />
          {plan.badge}
        </span>
      )}

      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{plan.name}</h3>
      <p className="text-xs text-slate-500 mt-1.5 min-h-[32px]">{plan.description}</p>
      <p className="text-3xl font-extrabold text-slate-900 mt-4">
        {formatPrice(plan.price)}
        <span className="text-sm font-medium text-slate-400"> / month</span>
      </p>
    </button>
  );
}

export const PlanCard = memo(PlanCardBase);
