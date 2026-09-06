"use client";

import { useFormContext } from "react-hook-form";
import type { ListingFormData } from "@/types/listing";

export default function PriceSection() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ListingFormData>();
  const negotiable = watch("negotiable");

  const formatNumber = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, "");
    return numeric;
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1.5">
          Enter your expected price (₹) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
          <input
            id="price"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 250 or 250.00"
            {...register("price", {
              onChange: (e) => {
                const formatted = formatNumber(e.target.value);
                if (formatted !== e.target.value) {
                  e.target.value = formatted;
                }
              },
            })}
            className="w-full rounded-[12px] border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
          />
        </div>
        {errors.price && (
          <p className="mt-1.5 text-sm text-red-600">{errors.price.message as string}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="negotiable"
          type="checkbox"
          checked={negotiable}
          onChange={(e) => setValue("negotiable", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
        />
        <label htmlFor="negotiable" className="text-sm font-medium text-slate-700">
          Price is negotiable
        </label>
      </div>
    </div>
  );
}
