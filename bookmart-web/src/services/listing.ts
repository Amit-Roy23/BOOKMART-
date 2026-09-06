export type ListingFormData = {
  images: { id: string; preview: string; name: string; size: number }[];
  title: string;
  author: string;
  isbn?: string;
  edition?: string;
  publisher?: string;
  language?: string;
  category?: string;
  condition: "like_new" | "good" | "fair" | "poor";
  price: string;
  negotiable?: boolean;
  description?: string;
};

export async function submitListing(): Promise<{ id: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  if (Math.random() < 0.05) {
    throw new Error("Upload failed. Please try again.");
  }
  return { id: `listing_${Date.now()}` };
}

export async function compressImage(file: File): Promise<{ file: File; preview: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        file,
        preview: reader.result as string,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
