"use client";

import { UseFormReturn } from "react-hook-form";
import { RequirementFormData } from "@/types/requirement";
import { Tag } from "lucide-react";
import FormSection from "./FormSection";

interface PriceRangeFieldsProps {
  form: UseFormReturn<RequirementFormData>;
}

export default function PriceRangeFields({ form }: PriceRangeFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormSection
      title="Price range"
      description="Set your preferred price range"
      iconBgColor="#D1FAE5"
      icon={<Tag className="h-6 w-6 text-green-600" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-slate-700 mb-1.5">
            Min price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
            <input
              id="minPrice"
              type="number"
              placeholder="0"
              {...register("minPrice")}
              className="w-full rounded-[12px] border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
            />
          </div>
          {errors.minPrice && <p className="mt-1.5 text-sm text-red-600">{errors.minPrice.message}</p>}
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-slate-700 mb-1.5">
            Max price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
            <input
              id="maxPrice"
              type="number"
              placeholder="5000"
              {...register("maxPrice")}
              className="w-full rounded-[12px] border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
            />
          </div>
          {errors.maxPrice && <p className="mt-1.5 text-sm text-red-600">{errors.maxPrice.message}</p>}
        </div>
      </div>
    </FormSection>
  );
}
