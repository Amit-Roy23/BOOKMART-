"use client";

import type { TopPerformer } from "@/types/analytics";

interface TopPerformersTableProps {
  performers: TopPerformer[];
}

export default function TopPerformersTable({ performers }: TopPerformersTableProps) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-bold text-slate-900">Top Performers</h2>
        <button
          type="button"
          className="text-sm font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-t border-slate-100 text-xs text-slate-500">
              <th className="px-6 py-3 font-semibold">Rank</th>
              <th className="px-6 py-3 font-semibold">Book</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold text-right">Views</th>
              <th className="px-6 py-3 font-semibold text-right">Bookmarks</th>
              <th className="px-6 py-3 font-semibold text-right">Messages</th>
              <th className="px-6 py-3 font-semibold text-right">Revenue</th>
              <th className="px-6 py-3 font-semibold text-right">Sold</th>
            </tr>
          </thead>
          <tbody>
            {performers.map((book) => (
              <tr key={book.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-slate-900">#{book.rank}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{book.title}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{book.category}</td>
                <td className="px-6 py-4 text-sm text-slate-900 text-right">{book.views}</td>
                <td className="px-6 py-4 text-sm text-slate-900 text-right">{book.bookmarks}</td>
                <td className="px-6 py-4 text-sm text-slate-900 text-right">{book.messages}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">₹{book.revenue}</td>
                <td className="px-6 py-4 text-sm text-slate-900 text-right">{book.soldCount} Sold</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
