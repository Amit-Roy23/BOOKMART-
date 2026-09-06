"use client";

import FilterAccordion from "./FilterAccordion";

interface SearchFiltersProps {
  availability: string;
  onAvailabilityChange: (value: any) => void;
  condition: string;
  onConditionChange: (value: any) => void;
  priceFilter: string;
  onPriceFilterChange: (value: any) => void;
  language: string;
  onLanguageChange: (value: any) => void;
  format: string;
  onFormatChange: (value: any) => void;
  onClearAll: () => void;
}

export default function SearchFilters({
  availability,
  onAvailabilityChange,
  condition,
  onConditionChange,
  priceFilter,
  onPriceFilterChange,
  language,
  onLanguageChange,
  format,
  onFormatChange,
  onClearAll,
}: SearchFiltersProps) {
  return (
    <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-brand-primary hover:underline transition-colors"
        >
          Clear All
        </button>
      </div>

      <FilterAccordion title="Availability">
        <div className="space-y-2">
          {["all", "available", "out-of-stock"].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={availability === option}
                onChange={() => onAvailabilityChange(option)}
                className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className={`text-sm ${availability === option ? "font-medium text-slate-900" : "text-slate-600"}`}>
                {option === "all" ? "All" : option === "available" ? "Available" : "Out of Stock"}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Condition">
        <div className="space-y-2">
          {["all", "like-new", "good", "fair", "poor"].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="condition"
                checked={condition === option}
                onChange={() => onConditionChange(option)}
                className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className={`text-sm ${condition === option ? "font-medium text-slate-900" : "text-slate-600"}`}>
                {option === "all" ? "All" : option === "like-new" ? "Like New" : option.charAt(0).toUpperCase() + option.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Price">
        <div className="space-y-2">
          {[
            { value: "all", label: "All Prices" },
            { value: "under-500", label: "Under ₹500" },
            { value: "under-1000", label: "Under ₹1,000" },
            { value: "under-2000", label: "Under ₹2,000" },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={priceFilter === option.value}
                onChange={() => onPriceFilterChange(option.value)}
                className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className={`text-sm ${priceFilter === option.value ? "font-medium text-slate-900" : "text-slate-600"}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Language">
        <div className="space-y-2">
          {["all", "english", "hindi", "bengali", "marathi", "tamil"].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="language"
                checked={language === option}
                onChange={() => onLanguageChange(option)}
                className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className={`text-sm ${language === option ? "font-medium text-slate-900" : "text-slate-600"}`}>
                {option === "all" ? "All" : option.charAt(0).toUpperCase() + option.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Format" defaultOpen={false}>
        <div className="space-y-2">
          {["all", "paperback", "hardcover", "ebook"].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="format"
                checked={format === option}
                onChange={() => onFormatChange(option)}
                className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className={`text-sm ${format === option ? "font-medium text-slate-900" : "text-slate-600"}`}>
                {option === "all" ? "All" : option.charAt(0).toUpperCase() + option.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>
    </div>
  );
}
