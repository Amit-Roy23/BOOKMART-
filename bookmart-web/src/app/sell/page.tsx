"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useBookListing } from "@/hooks/use-book-listing";
import { CheckCircle2 } from "lucide-react";
import ListingHeader from "@/components/sell/ListingHeader";
import ListingSteps from "@/components/sell/ListingSteps";
import ImageManager from "@/components/sell/ImageManager";
import BasicInfoForm from "@/components/sell/BasicInfoForm";
import ConditionSelector from "@/components/sell/ConditionSelector";
import PriceSection from "@/components/sell/PriceSection";
import ListingSubmitButton from "@/components/sell/ListingSubmitButton";
import Link from "next/link";

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
        <div className="rounded-[20px] border border-slate-100 bg-white p-12 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Book listed successfully!</h2>
          <p className="mt-2 text-sm text-slate-500">Your listing is now live. Buyers will be able to find and purchase your book.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/listings"
              className="rounded-[12px] bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-primary/90"
            >
              View My Listings
            </Link>
            <button
              onClick={onReset}
              className="rounded-[12px] border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              List Another Book
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FormContents() {
  const { form } = useBookListing();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!form) return null;

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      await form.handleSubmit(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (Math.random() < 0.05) throw new Error("Upload failed");
      })();
      form.reset();
      window.location.reload();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-6">
          <div className="rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">Step 1 — Book Photos</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add clear photos of your book (cover, back, pages, etc.)
                </p>
              </div>
              <ImageManager />
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">Step 2 — Basic Info</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Provide the essential details about your book.
                </p>
              </div>
              <BasicInfoForm />
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">Step 3 — Condition & Price</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tell us about your book&apos;s condition and your expected price.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">Condition</h3>
                  <ConditionSelector />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">Expected Price</h3>
                  <PriceSection />
                </div>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="rounded-[12px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <ListingSubmitButton
              isSubmitting={form.formState.isSubmitting}
              isValid={form.formState.isValid}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default function SellBookPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (submitSuccess) {
    return <SuccessState onReset={() => setSubmitSuccess(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <ListingHeader />
        <ListingSteps step={1} />
        <FormContents />
      </div>
      <Footer />
    </div>
  );
}
