"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/category/Breadcrumb";
import { ErrorState } from "@/components/ui/skeletons";
import { Modal } from "@/components/college/Modal";
import { PackageOpen } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { LISTING_TABS } from "@/services/listings";
import type { Listing } from "@/types/listings";
import { ListingsHeader } from "@/components/listings/ListingsHeader";
import { StatisticsCards } from "@/components/listings/StatisticsCards";
import { ListingsSearch } from "@/components/listings/ListingsSearch";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { ListingsList } from "@/components/listings/ListingsList";
import { BottomCTABanner } from "@/components/listings/BottomCTABanner";

function ListingsLoading() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading listings">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-10 bg-slate-100 rounded-xl animate-pulse max-w-md" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
    </div>
  );
}

function EmptyState({ onList }: { onList: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-20 h-20 rounded-full bg-brand-light text-brand-primary flex items-center justify-center mb-5">
        <PackageOpen className="w-10 h-10" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">No Listings Yet</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        You haven&apos;t listed any books yet. Start selling by creating your first listing.
      </p>
      <button
        type="button"
        onClick={onList}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-primary text-white px-5 py-3 text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        List Your First Book
      </button>
    </div>
  );
}

export default function MyListingsPage() {
  const {
    data,
    loading,
    error,
    reload,
    query,
    setQuery,
    filter,
    setFilter,
    filtered,
    counts,
  } = useListings();

  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  const tabs = LISTING_TABS.map((t) => ({
    id: t.id,
    label: t.label,
    count: counts[t.id] ?? 0,
  }));

  const handleEdit = () => {
    window.location.href = "/sell";
  };
  const handleView = (l: Listing) => {
    window.location.href = `/books/${l.id}`;
  };
  const handleBoost = () => {
    window.location.href = "/dashboard/boost-listing";
  };
  const handleList = () => {
    window.location.href = "/sell";
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Dashboard", href: "/dashboard/analytics" },
              { label: "My Active Listings" },
            ]}
          />

          {loading ? (
            <>
              <ListingsHeader />
              <ListingsLoading />
            </>
          ) : error ? (
            <ErrorState message={error} retry={reload} />
          ) : !data || data.listings.length === 0 ? (
            <>
              <ListingsHeader />
              <EmptyState onList={handleList} />
            </>
          ) : (
            <>
              <ListingsHeader />

              <StatisticsCards
                totalListings={data.stats.totalListings}
                totalViews={data.stats.totalViews}
                interested={data.stats.interested}
              />

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <ListingFilters tabs={tabs} active={filter} onChange={setFilter} />
                <ListingsSearch value={query} onChange={setQuery} />
              </div>

              <div className="mt-6">
                {filtered.length > 0 ? (
                  <ListingsList
                    listings={filtered}
                    onEdit={handleEdit}
                    onView={handleView}
                    onBoost={handleBoost}
                    onDuplicate={() => {}}
                    onMarkSold={() => {}}
                    onArchive={() => {}}
                    onDelete={(l) => setDeleteTarget(l)}
                  />
                ) : (
                  <p className="text-center text-sm text-slate-500 py-16">
                    No listings match your search or filter.
                  </p>
                )}
              </div>

              <div className="mt-10">
                <BottomCTABanner />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Listing"
      >
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-800">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
