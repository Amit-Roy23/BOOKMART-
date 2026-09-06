"use client";

import { Modal } from "@/components/college/Modal";
import { Building2, Check } from "lucide-react";
import { COLLEGES } from "@/types/listing";
import { cn } from "@/lib/utils";

export function CollegeSelectorModal({
  open,
  onClose,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selectedId?: string;
  onSelect: (id: string, name: string) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Select Your College">
      <p className="mb-4 text-sm text-slate-500">
        Choose the college this listing should be visible to.
      </p>
      <ul className="max-h-72 space-y-2 overflow-y-auto scrollbar-hide">
        {COLLEGES.map((college) => {
          const isSelected = college.id === selectedId;
          return (
            <li key={college.id}>
              <button
                type="button"
                onClick={() => onSelect(college.id, college.name)}
                aria-pressed={isSelected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[12px] border p-3 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
                  isSelected
                    ? "border-brand-primary bg-brand-light"
                    : "border-slate-200 hover:border-brand-primary hover:bg-brand-light"
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary">
                  <Building2 size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-900">
                    {college.name}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {college.university}
                  </span>
                </span>
                {isSelected && (
                  <Check size={18} className="text-brand-primary" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-[12px] border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
