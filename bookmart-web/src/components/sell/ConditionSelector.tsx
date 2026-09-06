"use client";

import { useFormContext } from "react-hook-form";
import type { ListingFormData, Condition } from "@/types/listing";
import { Star, BookOpen, AlertTriangle, X } from "lucide-react";

const CONDITIONS = [
  {
    value: "like_new" as Condition,
    label: "Like New",
    description: "No visible wear",
    icon: Star,
  },
  {
    value: "good" as Condition,
    label: "Good",
    description: "Minor wear only",
    icon: BookOpen,
  },
  {
    value: "fair" as Condition,
    label: "Fair",
    description: "Noticeable wear",
    icon: AlertTriangle,
  },
  {
    value: "poor" as Condition,
    label: "Poor",
    description: "Heavily used",
    icon: X,
  },
];

export default function ConditionSelector() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ListingFormData>();
  const selected = watch("condition");

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CONDITIONS.map((condition) => {
          const isSelected = selected === condition.value;
          const Icon = condition.icon;
          return (
            <button
              key={condition.value}
              type="button"
              onClick={() => setValue("condition", condition.value, { shouldValidate: true })}
              className={`flex flex-col items-center justify-center gap-2 rounded-[16px] border-2 p-4 transition-all duration-200 ${
                isSelected
                  ? "border-brand-primary bg-brand-light"
                  : "border-slate-200 bg-white hover:border-brand-primary"
              }`}
            >
              <Icon
                size={24}
                className={`transition-colors duration-200 ${
                  isSelected ? "text-brand-primary" : "text-slate-400"
                }`}
              />
              <span className={`text-sm font-bold ${isSelected ? "text-brand-primary" : "text-slate-700"}`}>
                {condition.label}
              </span>
              <span className="text-xs text-slate-500">{condition.description}</span>
            </button>
          );
        })}
      </div>
      {errors.condition && (
        <p className="mt-2 text-sm text-red-600">{errors.condition.message as string}</p>
      )}
    </div>
  );
}
