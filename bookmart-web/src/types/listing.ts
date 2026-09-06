import { z } from "zod";

export const listingSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      preview: z.string(),
      name: z.string(),
      size: z.number(),
    })
  ),
  title: z.string().min(3).max(150),
  author: z.string().min(1),
  isbn: z.string().optional().or(z.literal("")),
  edition: z.string().optional().or(z.literal("")),
  publisher: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  condition: z.enum(["like_new", "good", "fair", "poor"]),
  price: z.string().refine(
    (val) => !Number.isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "Enter a valid positive price" }
  ),
  negotiable: z.boolean().optional(),
  description: z.string().optional().or(z.literal("")),
});

export type ListingFormData = z.infer<typeof listingSchema>;
export type Condition = z.infer<typeof listingSchema>["condition"];

export interface ListingImage {
  id: string;
  file?: File;
  preview: string;
  name: string;
  size: number;
}

export interface ListingDraft {
  id: string;
  data: ListingFormData;
  createdAt: Date;
}

export const CONDITIONS: { value: Condition; label: string; description: string }[] = [
  { value: "like_new", label: "Like New", description: "No visible wear" },
  { value: "good", label: "Good", description: "Minor wear only" },
  { value: "fair", label: "Fair", description: "Noticeable wear" },
  { value: "poor", label: "Poor", description: "Heavily used" },
];

export type ListingVisibility = "everyone" | "college";

export type ListingLifecycleStatus = "active" | "paused" | "sold";

export const VISIBILITY_OPTIONS: {
  value: ListingVisibility;
  label: string;
  description: string;
}[] = [
  {
    value: "everyone",
    label: "Everyone",
    description: "Visible to all Bookmart users",
  },
  {
    value: "college",
    label: "My College Only",
    description: "Only students from your college",
  },
];

export const STATUS_OPTIONS: {
  value: ListingLifecycleStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "active",
    label: "Active",
    description: "Listing is live and visible to buyers",
  },
  {
    value: "paused",
    label: "Pause Listing",
    description: "Hide from search without deleting",
  },
  {
    value: "sold",
    label: "Mark as Sold",
    description: "Mark the book as sold",
  },
];

export const BOOK_CATEGORIES = [
  "Self Help",
  "Fiction",
  "Non-Fiction",
  "Academic & Textbooks",
  "School Books",
  "Competitive Exams",
  "Biography",
  "Science & Technology",
  "Children's Books",
  "Comics & Graphic Novels",
  "Poetry",
  "History",
];

export const MAX_LISTING_IMAGES = 5;
export const MAX_DESCRIPTION_LENGTH = 500;

export const COLLEGES: { id: string; name: string; university: string }[] = [
  {
    id: "srcc",
    name: "Shri Ram College of Commerce",
    university: "University of Delhi",
  },
  { id: "hindu", name: "Hindu College", university: "University of Delhi" },
  { id: "stephens", name: "St. Stephen's College", university: "University of Delhi" },
  {
    id: "lsr",
    name: "Lady Shri Ram College",
    university: "University of Delhi",
  },
  { id: "hansraj", name: "Hansraj College", university: "University of Delhi" },
];

const isValidIsbn = (value?: string) => {
  if (!value) return true;
  const cleaned = value.replace(/[\s-]/g, "");
  return /^(?:\d{9}[\dX]|\d{13})$/.test(cleaned);
};

const isPositiveNumber = (value?: string) =>
  !!value && !Number.isNaN(parseFloat(value)) && parseFloat(value) > 0;

export const editListingSchema = z.object({
  images: z
    .array(
      z.object({
        id: z.string(),
        preview: z.string(),
        name: z.string(),
        size: z.number(),
      })
    )
    .min(1, "Add at least one photo"),
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Select a category"),
  isbn: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(isValidIsbn, "Enter a valid 10 or 13 digit ISBN"),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`)
    .optional()
    .or(z.literal("")),
  condition: z.enum(["like_new", "good", "fair", "poor"]),
  price: z
    .string()
    .refine(isPositiveNumber, { message: "Enter a valid positive price" }),
  originalPrice: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || isPositiveNumber(value),
      "Enter a valid positive price"
    ),
  visibility: z.enum(["everyone", "college"]),
  status: z.enum(["active", "paused", "sold"]),
  college: z
    .object({ id: z.string(), name: z.string() })
    .nullable(),
});

export type EditListingFormValues = z.infer<typeof editListingSchema>;

export interface EditListingPerformance {
  views: number;
  interested: number;
  whatsappClicks: number;
  listedOn: string;
  boostRank: number;
  boostCategory: string;
}

export interface EditListing {
  id: string;
  images: ListingImage[];
  title: string;
  author: string;
  category: string;
  isbn: string;
  description: string;
  condition: Condition;
  price: string;
  originalPrice: string;
  visibility: ListingVisibility;
  status: ListingLifecycleStatus;
  college: { id: string; name: string } | null;
  performance: EditListingPerformance;
}
