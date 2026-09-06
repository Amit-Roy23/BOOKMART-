"use client";

import { ZoomIn, ZoomOut, Locate } from "lucide-react";

export default function MapControls() {
  return (
    <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2">
      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-lg" aria-label="Zoom in">
        <ZoomIn size={18} />
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-lg" aria-label="Zoom out">
        <ZoomOut size={18} />
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-lg" aria-label="Locate me">
        <Locate size={18} />
      </button>
    </div>
  );
}
