const MAX_BYTES = 5 * 1024 * 1024; // backend limit per image
const MAX_DIMENSION = 1600;

/**
 * Downscale large photos (phone cameras easily exceed the backend's 5 MB limit)
 * to a JPEG of at most MAX_DIMENSION px on the long side.
 */
export async function prepareImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed.');
  if (file.size <= 1.5 * 1024 * 1024) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.85)
  );
  if (!blob) return file;
  if (blob.size > MAX_BYTES) throw new Error('Image is too large. Please use a photo under 5 MB.');
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
}
