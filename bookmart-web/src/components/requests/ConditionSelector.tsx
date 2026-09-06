"use client";

import { UseFormReturn } from "react-hook-form";
import { RequirementFormData } from "@/types/requirement";
import { MousePointerClick } from "lucide-react";
import FormSection from "./FormSection";

interface ConditionSelectorProps {
  form: UseFormReturn<RequirementFormData>;
}

const CONDITIONS = ["New", "Like New", "Good", "Average"];

export default function ConditionSelector({ form }: ConditionSelectorProps) {
  const {
    setValue,
    formState: { errors },
  } = form;

  const selectedCondition = form.watch("condition");

  return (
    <FormSection
      title="Condition"
      description="Select condition or give your preference"
      iconBgColor="#FEF9C3"
      icon={<MousePointerClick className="h-6 w-6 text-yellow-600" />}
    >
      <div className="flex flex-wrap gap-3">
        {CONDITIONS.map((condition) => (
          <button
            key={condition}
            type="button"
            onClick={() => setValue("condition", condition)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              selectedCondition === condition
                ? "bg-brand-primary text-white"
                : "border border-slate-200 text-slate-700 hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            {condition}
          </button>
        ))}
      </div>
      {errors.condition && <p className="mt-1.5 text-sm text-red-600">{errors.condition.message}</p>}
    </FormSection>
  );
}
