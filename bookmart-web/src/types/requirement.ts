export type RequirementFormData = {
  bookDetails: string;
  condition: string;
  minPrice?: string;
  maxPrice?: string;
  notes?: string;
};

export interface Requirement {
  id: string;
  bookDetails: string;
  condition: string;
  priceRange: {
    min: number;
    max: number;
  };
  notes: string;
  createdAt: Date;
  status: "open" | "fulfilled" | "closed";
}
