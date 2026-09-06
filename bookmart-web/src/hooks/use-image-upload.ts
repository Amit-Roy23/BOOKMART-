import { useCallback, useState } from "react";
import type { ListingImage } from "@/types/listing";

const MAX_IMAGES = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function useImageUpload() {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return [];
    }
    const selected = fileArray.slice(0, remaining);
    const invalid = selected.find((file) => !ACCEPTED_TYPES.includes(file.type));
    if (invalid) {
      setError("Only JPG, PNG, and WEBP files are supported");
      return [];
    }
    setError(null);
    return selected;
  }, [images.length]);

  const processFiles = useCallback(async (files: File[]) => {
    setIsUploading(true);
    const processed = await Promise.all(
      files.map(
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
    setImages((prev) => [...prev, ...processed]);
    setIsUploading(false);
  }, []);

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const selected = validateFiles(files);
      if (selected.length === 0) return;
      await processFiles(selected);
    },
    [validateFiles, processFiles]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setError(null);
  }, []);

  const reorderImages = useCallback((startIndex: number, endIndex: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [removed] = next.splice(startIndex, 1);
      next.splice(endIndex, 0, removed);
      return next;
    });
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  return {
    images,
    isUploading,
    error,
    addFiles,
    removeImage,
    reorderImages,
    clearImages,
    hasImages: images.length > 0,
  };
}
