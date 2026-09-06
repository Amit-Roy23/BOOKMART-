"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Images, Plus, X, Crop } from "lucide-react";
import type { EditListingFormValues, ListingImage } from "@/types/listing";
import { MAX_LISTING_IMAGES } from "@/types/listing";
import { Card, CardHeader } from "./Card";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [isFileOver, setIsFileOver] = useState(false);

  const { setValue, watch, formState } = useFormContext<EditListingFormValues>();
  const images = watch("images") || [];
  const error = formState.errors.images;
  const remaining = MAX_LISTING_IMAGES - images.length;

  const readFile = (file: File) =>
    new Promise<ListingImage>((resolve) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          file,
          preview: reader.result as string,
          name: file.name,
          size: file.size,
        });
      reader.readAsDataURL(file);
    });

  const addFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => ACCEPTED_TYPES.includes(f.type));
    if (!arr.length) return;
    const room = MAX_LISTING_IMAGES - images.length;
    const slice = arr.slice(0, room);
    if (!slice.length) return;
    const processed = await Promise.all(slice.map(readFile));
    setValue("images", [...images, ...processed], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeImage = (id: string) =>
    setValue(
      "images",
      images.filter((i) => i.id !== id),
      { shouldValidate: true, shouldDirty: true }
    );

  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setValue("images", next, { shouldValidate: true, shouldDirty: true });
  };

  const openFilePicker = () => inputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const title = `Book Photos (Max ${MAX_LISTING_IMAGES})`;

  return (
    <Card>
      <CardHeader
        icon={<Images size={22} aria-hidden="true" />}
        title={title}
        action={
          <span className="text-sm font-medium text-slate-400">
            {images.length}/{MAX_LISTING_IMAGES}
          </span>
        }
      />

      <div
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            setIsFileOver(true);
          }
        }}
        onDragLeave={() => setIsFileOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex gap-3 overflow-x-auto pb-1 scrollbar-hide",
          isFileOver && "rounded-[12px] ring-2 ring-brand-primary ring-offset-2"
        )}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={(e) => {
              dragIndex.current = index;
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnter={() => setOverIndex(index)}
            onDragOver={(e) => {
              if (dragIndex.current !== null) e.preventDefault();
            }}
            onDrop={(e) => {
              if (dragIndex.current !== null) {
                e.preventDefault();
                e.stopPropagation();
                reorder(dragIndex.current, index);
                dragIndex.current = null;
                setOverIndex(null);
              }
            }}
            onDragEnd={() => {
              dragIndex.current = null;
              setOverIndex(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                reorder(index, Math.min(index + 1, images.length - 1));
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                reorder(index, Math.max(index - 1, 0));
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Photo ${index + 1}${index === 0 ? ", cover image" : ""}. Press arrow keys to reorder, or use the remove button.`}
            className={cn(
              "group relative h-28 w-28 shrink-0 snap-start overflow-hidden rounded-[12px] border bg-slate-50 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary sm:h-32 sm:w-32",
              overIndex === index && dragIndex.current !== null
                ? "border-brand-primary ring-2 ring-brand-primary"
                : "border-slate-200"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.preview}
              alt={`Listing photo ${index + 1}`}
              draggable={false}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {index === 0 && (
              <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                <Crop size={10} aria-hidden="true" />
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(image.id)}
              aria-label={`Remove photo ${index + 1}`}
              className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity duration-200 hover:bg-rose-500 focus-visible:opacity-100 group-hover:opacity-100"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}

        {remaining > 0 &&
          Array.from({ length: remaining }).map((_, i) => (
            <button
              key={`slot-${i}`}
              type="button"
              onClick={openFilePicker}
              className="flex h-28 w-28 shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-[12px] border-2 border-dashed border-slate-200 text-slate-400 transition-colors duration-200 hover:border-brand-primary hover:bg-brand-light hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:h-32 sm:w-32"
              aria-label="Add photo"
            >
              <Plus size={22} aria-hidden="true" />
              <span className="text-xs font-semibold">Add Photo</span>
            </button>
          ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        aria-hidden="true"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            addFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">{error.message as string}</p>
      )}

      <p className="mt-3 text-xs text-slate-400">
        Drag &amp; drop to reorder photos
      </p>
    </Card>
  );
}
