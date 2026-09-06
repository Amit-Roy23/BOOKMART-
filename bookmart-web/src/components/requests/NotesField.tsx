"use client";

import { UseFormReturn } from "react-hook-form";
import { RequirementFormData } from "@/types/requirement";
import { Pencil } from "lucide-react";
import FormSection from "./FormSection";

interface NotesFieldProps {
  form: UseFormReturn<RequirementFormData>;
}

export default function NotesField({ form }: NotesFieldProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const notes = form.watch("notes") || "";
  const charCount = notes.length;

  return (
    <FormSection
      title="Additional notes"
      description="Any specific edition, format, or notes (optional)"
      iconBgColor="#FCE7F3"
      icon={<Pencil className="h-6 w-6 text-pink-600" />}
    >
      <div>
        <label htmlFor="notes" className="sr-only">
          Additional Notes
        </label>
        <textarea
          id="notes"
          placeholder="E.g. paperback edition, 2nd ed., latest version..."
          rows={5}
          {...register("notes")}
          maxLength={500}
          className="w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light resize-y"
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.notes && <p className="text-sm text-red-600">{errors.notes.message}</p>}
          <p className="text-xs text-slate-400 ml-auto">{charCount}/500</p>
        </div>
      </div>
    </FormSection>
  );
}
