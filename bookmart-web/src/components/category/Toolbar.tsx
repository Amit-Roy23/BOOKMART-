"use client";

import { Grid2X2, List, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ToolbarProps {
  totalBooks?: number;
}

export default function Toolbar({
  totalBooks = 1248,
}: ToolbarProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section className="mb-8 rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {totalBooks.toLocaleString()} Books Found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Showing the best matches near your location
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            text-sm
            font-medium
            transition
            hover:bg-gray-50
            lg:hidden
          "
          >
            <SlidersHorizontal size={18} />

            Filters
          </button>

          <div className="relative">
            <select
              className="
              appearance-none
              rounded-xl
              border
              border-gray-300
              bg-white
              py-3
              pl-4
              pr-10
              text-sm
              font-medium
              outline-none
              transition
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-100
            "
            >
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
              <option>Nearest First</option>
            </select>

            <ChevronDown
              size={18}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />
          </div>

          <div className="flex overflow-hidden rounded-xl border border-gray-300">
            <button
              onClick={() => setView("grid")}
              className={`
                flex h-11 w-11 items-center justify-center transition
                ${
                  view === "grid"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                }
              `}
            >
              <Grid2X2 size={18} />
            </button>

            <button
              onClick={() => setView("list")}
              className={`
                flex h-11 w-11 items-center justify-center transition
                ${
                  view === "list"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                }
              `}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
