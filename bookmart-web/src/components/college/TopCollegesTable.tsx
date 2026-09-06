"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatCompact } from "@/lib/utils";
import type { College } from "@/types/college";

interface TopCollegesTableProps {
  colleges: College[];
  onSelect?: (college: College) => void;
  viewAllHref?: string;
}

export function TopCollegesTable({ colleges, onSelect, viewAllHref = "/college-insights" }: TopCollegesTableProps) {
  return (
    <section aria-labelledby="top-colleges-heading">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="top-colleges-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Top Colleges
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Colleges with the most active listings</p>
        </div>
        <Link
          href={viewAllHref}
          className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary rounded px-2 py-1"
        >
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="hidden sm:table w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold text-slate-500 border-b border-slate-100">
              <th scope="col" className="w-16 py-4 pl-6">Rank</th>
              <th scope="col" className="py-4">College</th>
              <th scope="col" className="py-4 pr-6 text-right">Books Listed</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((college, index) => (
              <tr
                key={college.id}
                onClick={() => onSelect?.(college)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(college);
                  }
                }}
                className="border-b border-slate-50 last:border-0 cursor-pointer hover:bg-brand-light/40 transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                <td className="py-4 pl-6">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {index + 1}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{college.name}</p>
                      <p className="text-xs text-slate-400 truncate">{college.university}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-6 text-right text-sm font-semibold text-slate-700">
                  {formatCompact(college.booksListed)} Books
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="sm:hidden divide-y divide-slate-50">
          {colleges.map((college, index) => (
            <li
              key={college.id}
              onClick={() => onSelect?.(college)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(college);
                }
              }}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-brand-light/40 transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600 shrink-0">
                {index + 1}
              </span>
              <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{college.name}</p>
                <p className="text-xs text-slate-400 truncate">{college.university}</p>
              </div>
              <span className="text-xs font-semibold text-slate-700 shrink-0">
                {formatCompact(college.booksListed)} Books
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
