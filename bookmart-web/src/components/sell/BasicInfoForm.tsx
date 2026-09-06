"use client";

import { useFormContext } from "react-hook-form";
import type { ListingFormData } from "@/types/listing";

export default function BasicInfoForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ListingFormData>();

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
          Book Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Introduction to Algorithms"
          {...register("title")}
          className="w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-red-600">{errors.title.message as string}</p>
        )}
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-1.5">
          Author <span className="text-red-500">*</span>
        </label>
        <input
          id="author"
          type="text"
          placeholder="e.g. Thomas H. Cormen"
          {...register("author")}
          className="w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
        />
        {errors.author && (
          <p className="mt-1.5 text-sm text-red-600">{errors.author.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-slate-700 mb-1.5">
            ISBN
          </label>
          <input
            id="isbn"
            type="text"
            placeholder="e.g. 978-0262033848"
            {...register("isbn")}
            className="w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
          />
        </div>

        <div>
          <label htmlFor="edition" className="block text-sm font-medium text-slate-700 mb-1.5">
            Edition
          </label>
          <input
            id="edition"
            type="text"
            placeholder="e.g. 3rd Edition"
            {...register("edition")}
            className="w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-slate-700 mb-1.5">
            Publisher
          </label>
          <input
            id="publisher"
            type="text"
            placeholder="e.g. MIT Press"
            {...register("publisher")}
            className="w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1.5">
            Language
          </label>
          <input
            id="language"
            type="text"
            placeholder="e.g. English"
            {...register("language")}
            className="w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light"
          />
        </div>
      </div>
    </div>
  );
}
