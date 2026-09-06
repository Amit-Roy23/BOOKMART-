"use client";

import { useFormContext } from "react-hook-form";
import { Check, Star, BookOpen, AlertTriangle, X } from "lucide-react";
import type { Condition, EditListingFormValues } from "@/types/listing";
import { CONDITIONS } from "@/types/listing";
import { Card, CardHeader } from "./Card";
import { cn } from "@/lib/utils";

const ICONS: Record<Condition, typeof Star> = {
  like_new: Star,
  good: BookOpen,
  fair: AlertTriangle,
  poor: X,
};

export default function ConditionSelector() {
  const { setValue, watch } = useFormContext<EditListingFormValues>();
  const selected = watch("condition");

  return (
    <Card>
      <CardHeader
        icon={<Check size={22} aria-hidden="true" />}
        title="Condition"
        tooltip="The physical condition of the book as buyers will receive it."
      />
      <div
        role="radiogroup"
        aria-label="Book condition"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {CONDITIONS.map((condition) => {
          const isSelected = selected === condition.value;
          const Icon = ICONS[condition.value];
          return (
            <button
              key={condition.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() =>
                setValue("condition", condition.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-[16px] border-2 p-4 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
                isSelected
                  ? "border-brand-primary bg-brand-primary text-white shadow-[0_2px_8px_rgba(0,128,128,0.25)]"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-primary"
              )}
            >
              <Icon
                size={22}
                className={cn(
                  "transition-colors duration-200",
                  isSelected ? "text-white" : "text-slate-400"
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-bold",
                  isSelected ? "text-white" : "text-slate-700"
                )}
              >
                {isSelected && <Check size={14} aria-hidden="true" />}
                {condition.label}
              </span>
              <span
                className={cn(
                  "text-xs",
                  isSelected ? "text-white/80" : "text-slate-500"
                )}
              >
                {condition.description}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
