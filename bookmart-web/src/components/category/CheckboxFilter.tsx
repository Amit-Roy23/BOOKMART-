"use client";

import { cn } from "@/lib/utils";

interface CheckboxFilterProps {
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function CheckboxFilter({
  label,
  count,
  checked = false,
  onChange,
}: CheckboxFilterProps) {
  return (
    <label
      className="
        group
        flex
        cursor-pointer
        items-center
        justify-between
        rounded-xl
        px-2
        py-2
        transition-colors
        hover:bg-gray-50
      "
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="
            h-5
            w-5
            rounded
            border-gray-300
            text-emerald-600
            focus:ring-emerald-500
          "
        />

        <span
          className={cn(
            "text-sm transition",
            checked
              ? "font-medium text-gray-900"
              : "text-gray-600"
          )}
        >
          {label}
        </span>
      </div>

      {count !== undefined && (
        <span
          className="
            rounded-full
            bg-gray-100
            px-2.5
            py-1
            text-xs
            font-medium
            text-gray-500
          "
        >
          {count}
        </span>
      )}
    </label>
  );
}
