"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ErrorState, BookCardSkeleton } from "@/components/ui/skeletons";
import { GraduationCap, Search } from "lucide-react";
import { useCollegeInsights } from "@/hooks/useCollegeInsights";
import { getColleges } from "@/services/college";
import type { College } from "@/types/college";
import { SelectedCollegeCard } from "@/components/college/SelectedCollegeCard";
import { CollegeStatistics } from "@/components/college/CollegeStatistics";
import { CollegeBooksSection } from "@/components/college/CollegeBooksSection";
import { TopCollegesTable } from "@/components/college/TopCollegesTable";
import { InviteStudentsBanner } from "@/components/college/InviteStudentsBanner";
import { Modal } from "@/components/college/Modal";

function CollegeInsightsLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading college insights">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[104px] animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[112px] animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[280px] animate-pulse" />
      <div className="bg-gradient-to-br from-brand-light to-teal-primary/10 rounded-2xl h-[120px] animate-pulse" />
    </div>
  );
}

function EmptyState({ onChoose }: { onChoose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-20 h-20 rounded-full bg-brand-light text-brand-primary flex items-center justify-center mb-5">
        <GraduationCap className="w-10 h-10" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Select Your College</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        Choose your college to explore books and insights from your campus community.
      </p>
      <button
        type="button"
        onClick={onChoose}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-primary text-white px-5 py-3 text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        Choose College
      </button>
    </div>
  );
}

export default function CollegeInsightsPage() {
  const { data, loading, error, reload } = useCollegeInsights();
  const [changeOpen, setChangeOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const colleges = getColleges();

  const handleSelectCollege = (college: College) => {
    setChangeOpen(false);
    reload(college.id);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">College Insights</h1>
            <p className="text-base text-slate-500 mt-2">
              See how many students from your college are using BookMart.
            </p>
          </header>

          {loading ? (
            <CollegeInsightsLoading />
          ) : error ? (
            <ErrorState message={error} retry={() => reload()} />
          ) : !data?.college ? (
            <EmptyState onChoose={() => setChangeOpen(true)} />
          ) : (
            <div className="space-y-8">
              <SelectedCollegeCard college={data.college} onChange={() => setChangeOpen(true)} />
              <CollegeStatistics college={data.college} />
              <CollegeBooksSection books={data.books} />
              <TopCollegesTable colleges={data.topColleges} onSelect={handleSelectCollege} />
              <InviteStudentsBanner onInvite={() => setInviteOpen(true)} />
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Modal open={changeOpen} onClose={() => setChangeOpen(false)} title="Change College">
        <ul className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {colleges.map((college) => (
            <li key={college.id}>
              <button
                type="button"
                onClick={() => handleSelectCollege(college)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 text-left hover:border-brand-primary hover:bg-brand-light transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{college.name}</p>
                  <p className="text-xs text-slate-400 truncate">{college.university}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Students">
        <p className="text-sm text-slate-500 mb-4">
          Share this link with classmates to grow your college community on BookMart.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
            <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">bookmart.app/invite/srcc-arjun</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </Modal>
    </>
  );
}
