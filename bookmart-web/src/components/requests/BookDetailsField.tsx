"use client";

import { UseFormReturn } from "react-hook-form";
import { RequirementFormData } from "@/types/requirement";
import { BookOpen } from "lucide-react";
import FormSection from "./FormSection";

interface BookDetailsFieldProps {
  form: UseFormReturn<RequirementFormData>;
}

export default function BookDetailsField({ form }: BookDetailsFieldProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection
      title="Book details"
      description="Enter title, author or ISBN (if you know)"
      iconBgColor="#F5F3FF"
      icon={<BookOpen className="h-6 w-6 text-purple-600" />}
    >
      <div>
        <label htmlFor="bookDetails" className="sr-only">
          Book Details
        </label>
        <input
          id="bookDetails"
          type="text"
          placeholder="E.g. The Power of Habit"
          {...register("bookDetails")}
          className="w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
        />
        {errors.bookDetails && (
          <p className="mt-1.5 text-sm text-red-600">{errors.bookDetails.message}</p>
        )}
      </div>
    </FormSection>
  );
}
