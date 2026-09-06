import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

export const CARD_CLASS =
  "bg-white rounded-[16px] border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6";

export const INPUT_CLASS =
  "w-full rounded-[12px] border border-slate-200 bg-white py-3 px-4 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-primary focus:ring-4 focus:ring-brand-light";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn(CARD_CLASS, className)}>{children}</section>;
}

export function CardHeader({
  icon,
  title,
  action,
  tooltip,
}: {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  tooltip?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-brand-primary">{icon}</span>}
        <h2 className="text-[22px] font-bold text-slate-900 leading-tight tracking-tight">
          {title}
        </h2>
        {tooltip && <Tooltip label={tooltip} />}
      </div>
      {action}
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700 mb-1.5"
    >
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

export function HelpTooltip({ label }: { label: string }) {
  return (
    <Tooltip label={label} />
  );
}

export function Tooltip({ label }: { label: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={label}
        className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        <HelpCircle size={16} aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
