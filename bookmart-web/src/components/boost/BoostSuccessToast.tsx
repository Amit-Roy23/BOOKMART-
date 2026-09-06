"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface BoostSuccessToastProps {
  open: boolean;
  message?: string;
  onClose: () => void;
}

export function BoostSuccessToast({ open, message = "Books boosted successfully!", onClose }: BoostSuccessToastProps) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-xl bg-white border border-slate-200 shadow-lg px-4 py-3 animate-fade-in"
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />
      <span className="text-sm font-semibold text-slate-800">{message}</span>
    </div>
  );
}
