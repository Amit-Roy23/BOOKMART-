"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface NearbyFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string>) => void;
}

export default function NearbyFilterDrawer({ isOpen, onClose, onApply }: NearbyFilterDrawerProps) {
  const [distance, setDistance] = useState("all");
  const [condition, setCondition] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [availability, setAvailability] = useState("all");

  if (!isOpen) return null;

  function handleApply() {
    onApply({ distance, condition: condition.join(","), language: language.join(","), availability });
    onClose();
  }

  function handleReset() {
    setDistance("all");
    setCondition([]);
    setLanguage([]);
    setAvailability("all");
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md rounded-l-[20px] bg-white p-6 shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Filters</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Distance</h4>
            <div className="space-y-2">
              {["all", "5km", "10km", "20km"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="distance"
                    checked={distance === option}
                    onChange={() => setDistance(option)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className={`text-sm ${distance === option ? "font-medium text-slate-900" : "text-slate-600"}`}>
                    {option === "all" ? "All Distances" : `Within ${option}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Availability</h4>
            <div className="space-y-2">
              {["all", "available", "out-of-stock"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === option}
                    onChange={() => setAvailability(option)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className={`text-sm ${availability === option ? "font-medium text-slate-900" : "text-slate-600"}`}>
                    {option === "all" ? "All" : option === "available" ? "Available" : "Out of Stock"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Condition</h4>
            <div className="space-y-2">
              {["Like New", "Good", "Fair", "Poor"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={condition.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCondition([...condition, option]);
                      } else {
                        setCondition(condition.filter((c) => c !== option));
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm text-slate-600">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={handleReset} className="flex-1 rounded-[12px] border border-slate-200 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-primary hover:text-primary">
            Reset
          </button>
          <button onClick={handleApply} className="flex-1 rounded-[12px] bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
