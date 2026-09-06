"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, BookOpen, MousePointerClick, Tag, Pencil, ChevronRight } from "lucide-react";
import Link from "next/link";
import { requirementSchema } from "@/validation/requirementSchema";
import type { RequirementFormData } from "@/types/requirement";
import BookDetailsField from "@/components/requests/BookDetailsField";
import ConditionSelector from "@/components/requests/ConditionSelector";
import PriceRangeFields from "@/components/requests/PriceRangeFields";
import NotesField from "@/components/requests/NotesField";

export default function PostRequirementPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RequirementFormData>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      bookDetails: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      notes: "",
    },
  });

  const { reset } = form;

  async function onSubmit(data: RequirementFormData) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Requirement submitted:", data);
      setSubmitSuccess(true);
      reset();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-12">
          <div className="rounded-[20px] border border-slate-100 bg-white p-12 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">Requirement posted successfully!</h2>
            <p className="mt-2 text-sm text-slate-500">Nearby sellers will be notified. We&apos;ll let you know when someone responds.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/requests"
                className="rounded-[12px] bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-primary/90"
              >
                View My Requirements
              </Link>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="rounded-[12px] border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                Post Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 md:px-6 py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
            </li>
            <li><ChevronRight size={14} /></li>
            <li>
              <Link href="/requests" className="hover:text-brand-primary transition-colors">Requirements</Link>
            </li>
            <li><ChevronRight size={14} /></li>
            <li className="font-semibold text-slate-900">Post a Requirement</li>
          </ol>
        </nav>

        <div className="rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Post a Requirement
                </h1>
                <p className="mt-2 text-base text-slate-500 max-w-lg">
                  Tell us what you&apos;re looking for and we&apos;ll connect you with nearby sellers who have it.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-brand-light/50 px-3 py-1.5 text-xs font-bold text-brand-primary">
                  <span className="flex h-2 w-2 rounded-full bg-brand-primary" />
                  Simple & Free
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                  <span className="flex h-2 w-2 rounded-full bg-slate-700" />
                  Instant Alerts
                </div>
              </div>
            </div>

            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-100" />
              </div>
              <ol className="relative flex items-center justify-between">
                {[
                  { label: "Book Details", icon: BookOpen },
                  { label: "Condition", icon: MousePointerClick },
                  { label: "Price Range", icon: Tag },
                  { label: "Notes", icon: Pencil },
                ].map((step, index) => (
                  <li key={step.label} className="flex flex-1 items-center last:flex-initial">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="hidden sm:inline-flex text-sm font-semibold text-slate-700 items-center gap-2">
                        <step.icon size={16} />
                        {step.label}
                      </span>
                    </div>
                    {index < 3 && <span className="ml-2 h-px flex-1 bg-slate-100 hidden sm:block" />}
                  </li>
                ))}
              </ol>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                  <BookDetailsField form={form} />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                  <ConditionSelector form={form} />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                  <PriceRangeFields form={form} />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                  <NotesField form={form} />
                </div>
              </div>

              {submitError && (
                <div className="rounded-[12px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <div className="flex items-center justify-end gap-4 pt-2">
                <Link
                  href="/requests"
                  className="rounded-[12px] border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,128,128,0.25)]"
                >
                  <Send size={16} />
                  {isSubmitting ? "Posting..." : "Post Requirement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
