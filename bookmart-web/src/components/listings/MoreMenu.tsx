"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  ExternalLink,
  Zap,
  Copy,
  CheckCircle,
  Archive,
  Trash,
} from "lucide-react";

export interface MoreMenuProps {
  onView: () => void;
  onBoost: () => void;
  onDuplicate: () => void;
  onMarkSold: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function MoreMenu(props: MoreMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = [
    { label: "View Listing", icon: <ExternalLink className="w-4 h-4" />, onClick: props.onView },
    { label: "Boost Listing", icon: <Zap className="w-4 h-4" />, onClick: props.onBoost },
    { label: "Duplicate", icon: <Copy className="w-4 h-4" />, onClick: props.onDuplicate },
    { label: "Mark as Sold", icon: <CheckCircle className="w-4 h-4" />, onClick: props.onMarkSold },
    { label: "Archive", icon: <Archive className="w-4 h-4" />, onClick: props.onArchive },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-xl border border-slate-200 w-9 h-9 text-slate-600 hover:bg-brand-light hover:border-brand-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 animate-fade-in"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-brand-light hover:text-brand-primary transition-colors text-left"
            >
              <span className="text-slate-400" aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="h-px bg-slate-100 my-1" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              props.onDelete();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-left"
          >
            <Trash className="w-4 h-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
