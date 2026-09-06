"use client";

import type { ListingImage } from "@/types/listing";
import { Trash2 } from "lucide-react";

export default function ImagePreviewGrid({
  images,
  onRemove,
  onReorder,
}: {
  images: ListingImage[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.preview}
            alt={`Upload ${index + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onRemove(image.id)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600 shadow-sm transition-colors hover:bg-white"
              aria-label={`Remove image ${index + 1}`}
            >
              <Trash2 size={16} />
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => onReorder(index, index - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-white disabled:opacity-40"
                aria-label="Move left"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                disabled={index === images.length - 1}
                onClick={() => onReorder(index, index + 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-white disabled:opacity-40"
                aria-label="Move right"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
