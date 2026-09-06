"use client";

import { PlanCard } from "./PlanCard";
import type { BoostPlan, PlanId } from "@/types/boost";

interface PricingPlansProps {
  plans: BoostPlan[];
  selectedPlanId: PlanId;
  onSelect: (id: PlanId) => void;
}

export function PricingPlans({ plans, selectedPlanId, onSelect }: PricingPlansProps) {
  return (
    <section aria-labelledby="choose-plan-heading">
      <h2 id="choose-plan-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
        1. Choose Your Plan
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-2 snap-x scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible">
        {plans.map((plan) => (
          <div key={plan.id} className="snap-center shrink-0 w-[260px] md:w-auto">
            <PlanCard
              plan={plan}
              selected={plan.id === selectedPlanId}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
