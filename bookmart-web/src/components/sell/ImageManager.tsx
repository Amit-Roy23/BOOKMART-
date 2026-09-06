"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ListingFormData, ListingImage } from "@/types/listing";
import ImagePreviewGrid from "./ImagePreviewGrid";

const MAX_IMAGES = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { setValue, watch, formState } = useFormContext<ListingFormData>();
  const images = watch("images") || [];
  const errors = formState.errors;

  const processFiles = async (files: File[]) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const selected = files.slice(0, remaining);
    const invalid = selected.find((file) => !ACCEPTED_TYPES.includes(file.type));
    if (invalid) return;

    const processed: ListingImage[] = await Promise.all(
      selected.map(
        (file) =>
          new Promise<ListingImage>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                file,
                preview: reader.result as string,
                name: file.name,
                size: file.size,
              });
            };
            reader.readAsDataURL(file);
          })
      )
    );
    setValue("images", [...images, ...processed], { shouldValidate: true });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleRemove = (id: string) => {
    setValue(
      "images",
      images.filter((img) => img.id !== id),
      { shouldValidate: true }
    );
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setValue("images", next, { shouldValidate: true });
  };

  const isFull = images.length >= MAX_IMAGES;

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFilePicker}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed p-8 transition-colors duration-200 ${
          isDragOver
            ? "border-brand-primary bg-brand-light"
            : isFull
              ? "border-slate-100 bg-slate-50"
              : "border-slate-200 bg-white hover:border-brand-primary hover:bg-brand-light"
        }`}
        style={{ minHeight: "280px" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openFilePicker();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
        {!isFull ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-light text-brand-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-900">Capture Image</p>
            <p className="mt-1 text-sm text-slate-500">
              or drag and drop images here
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Supports JPG, PNG, WEBP. Max {MAX_IMAGES} images.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-900">Maximum limit reached</p>
            <p className="mt-1 text-sm text-slate-500">
              Remove an image to add more.
            </p>
          </div>
        )}
      </div>

      {errors.images && (
        <p className="mt-1.5 text-sm text-red-600">{errors.images.message as string}</p>
      )}

      {images.length > 0 && (
        <ImagePreviewGrid images={images} onRemove={handleRemove} onReorder={handleReorder} />
      )}
    </div>
  );
}
