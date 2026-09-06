"use client";

import { RotateCcw, Search } from "lucide-react";

import CheckboxFilter from "./CheckboxFilter";
import FilterSection from "./FilterSection";
import PriceSlider from "./PriceSlider";

export default function FilterSidebar() {
  return (
    <aside
      className="
        sticky
        top-24
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Filters
        </h2>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            px-3
            py-2
            text-sm
            font-medium
            text-emerald-600
            transition
            hover:bg-emerald-50
          "
        >
          <RotateCcw size={16} />

          Reset
        </button>
      </div>

      <div className="relative mb-8">
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search filters..."
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            py-3
            pl-11
            pr-4
            text-sm
            outline-none
            transition
            focus:border-emerald-500
            focus:ring-4
            focus:ring-emerald-100
          "
        />
      </div>

      <FilterSection title="Availability">
        <CheckboxFilter
          label="Available"
          count={328}
          checked
        />

        <CheckboxFilter
          label="Out of Stock"
          count={29}
        />
      </FilterSection>

      <FilterSection title="Condition">
        <CheckboxFilter
          label="Like New"
          count={86}
        />

        <CheckboxFilter
          label="Excellent"
          count={143}
        />

        <CheckboxFilter
          label="Good"
          count={210}
        />

        <CheckboxFilter
          label="Fair"
          count={58}
        />

        <CheckboxFilter
          label="Poor"
          count={18}
        />
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceSlider />
      </FilterSection>

      <FilterSection title="Language">
        <CheckboxFilter
          label="English"
          count={564}
        />

        <CheckboxFilter
          label="Hindi"
          count={122}
        />

        <CheckboxFilter
          label="Bengali"
          count={96}
        />

        <CheckboxFilter
          label="Tamil"
          count={41}
        />
      </FilterSection>

      <FilterSection title="Minimum Rating">
        <CheckboxFilter
          label="★★★★★"
          count={87}
        />

        <CheckboxFilter
          label="★★★★☆ & up"
          count={211}
        />

        <CheckboxFilter
          label="★★★☆☆ & up"
          count={412}
        />
      </FilterSection>

      <FilterSection title="Delivery">
        <CheckboxFilter
          label="Pickup Only"
          count={203}
        />

        <CheckboxFilter
          label="Home Delivery"
          count={187}
        />

        <CheckboxFilter
          label="Courier"
          count={92}
        />
      </FilterSection>

      <FilterSection title="Seller">
        <CheckboxFilter
          label="Verified Sellers"
          count={246}
        />

        <CheckboxFilter
          label="Students"
          count={192}
        />

        <CheckboxFilter
          label="Book Stores"
          count={53}
        />
      </FilterSection>
    </aside>
  );
}
