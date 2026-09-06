"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";
import { ErrorState } from "@/components/ui/skeletons";
import { Modal } from "@/components/college/Modal";
import { BookOpen, PackageOpen, Rocket } from "lucide-react";
import { useBoostPlan } from "@/hooks/useBoostPlan";
import { BoostHeader } from "@/components/boost/BoostHeader";
import { InfoBanner } from "@/components/boost/InfoBanner";
import { PricingPlans } from "@/components/boost/PricingPlans";
import { CurrentPlanBanner } from "@/components/boost/CurrentPlanBanner";
import { BoostUsage } from "@/components/boost/BoostUsage";
import { BookSelectionList } from "@/components/boost/BookSelectionList";
import { BoostSummarySidebar } from "@/components/boost/BoostSummarySidebar";
import { BoostSuccessToast } from "@/components/boost/BoostSuccessToast";
import type { PlanId } from "@/types/boost";

function BoostLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" aria-busy="true" aria-label="Loading boost listing">
      <div className="lg:col-span-7 space-y-10">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
      <div className="lg:col-span-5">
        <div className="h-[520px] animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

function EmptyState({ onList }: { onList: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-20 h-20 rounded-full bg-brand-light text-brand-primary flex items-center justify-center mb-5">
        <PackageOpen className="w-10 h-10" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">No Books Available</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        List your first book before boosting it.
      </p>
      <button
        type="button"
        onClick={onList}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-primary text-white px-5 py-3 text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        List a Book
      </button>
    </div>
  );
}

export default function BoostListingPage() {
  const {
    data,
    loading,
    error,
    reload,
    selectedPlanId,
    setSelectedPlanId,
    selectedBookIds,
    toggleBook,
    usageToday,
    boosting,
    success,
    dismissSuccess,
    submitBoost,
    selectedPlan,
    limit,
    remaining,
    canSubmit,
  } = useBoostPlan();

  const [addOpen, setAddOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const handleSelectPlan = (id: PlanId) => setSelectedPlanId(id);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <BoostLoading />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <ErrorState message={error} retry={reload} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!data || data.books.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <EmptyState onList={() => setAddOpen(true)} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Dashboard", href: "/dashboard/analytics" },
              { label: "Boost Listing" },
            ]}
          />

          <BoostHeader />
          <InfoBanner />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-10">
              <PricingPlans
                plans={data.plans}
                selectedPlanId={selectedPlanId}
                onSelect={handleSelectPlan}
              />
              <CurrentPlanBanner
                planName={data.currentSubscription.planName}
                boostLimit={data.currentSubscription.boostLimit}
                onManage={() => setManageOpen(true)}
              />
              <BoostUsage usageToday={usageToday} limit={limit} remaining={remaining} />
              <BookSelectionList
                books={data.books}
                selectedBookIds={selectedBookIds}
                limit={limit}
                onToggle={toggleBook}
                onAdd={() => setAddOpen(true)}
              />
            </div>

            <BoostSummarySidebar
              books={data.books}
              selectedBookIds={selectedBookIds}
              planName={selectedPlan?.name ?? data.currentSubscription.planName}
              price={selectedPlan?.price ?? 0}
              boostLimit={limit}
              durationDays={data.durationDays}
              boosting={boosting}
              canSubmit={canSubmit}
              onBoost={submitBoost}
            />
          </div>
        </div>
      </main>
      <Footer />

      <BoostSuccessToast open={success} onClose={dismissSuccess} />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add More Books">
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-14 h-14 rounded-full bg-brand-light text-brand-primary flex items-center justify-center">
            <BookOpen className="w-7 h-7" aria-hidden="true" />
          </div>
          <p className="text-sm text-slate-500 max-w-xs">
            Listing more books lets you boost them and reach more buyers on BookMart.
          </p>
          <button
            type="button"
            onClick={() => setAddOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            List a Book
          </button>
        </div>
      </Modal>

      <Modal open={manageOpen} onClose={() => setManageOpen(false)} title="Manage Plan">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-light/40 mb-4">
          <div className="w-10 h-10 rounded-full bg-white text-brand-primary flex items-center justify-center">
            <Rocket className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{data.currentSubscription.planName}</p>
            <p className="text-xs text-slate-500">
              Boost up to {data.currentSubscription.boostLimit} books per day
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Manage your subscription, billing, and auto-renew from your account settings.
        </p>
        <button
          type="button"
          onClick={() => setManageOpen(false)}
          className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-brand-primary hover:border-brand-primary hover:bg-brand-light transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          Go to Billing
        </button>
      </Modal>
    </>
  );
}
