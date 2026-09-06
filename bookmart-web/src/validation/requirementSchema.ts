import { z } from "zod";

export const requirementSchema = z
  .object({
    bookDetails: z
      .string()
      .min(3, "Book details must be at least 3 characters")
      .max(150, "Book details must not exceed 150 characters"),
    condition: z.string().min(1, "Please select a condition"),
    minPrice: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
        "Minimum price must be positive"
      ),
    maxPrice: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
        "Maximum price must be positive"
      ),
    notes: z
      .string()
      .max(500, "Notes must not exceed 500 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice) {
        const min = parseFloat(data.minPrice);
        const max = parseFloat(data.maxPrice);
        if (!isNaN(min) && !isNaN(max) && max < min) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Maximum price cannot be less than minimum price",
      path: ["maxPrice"],
    }
  );

export type RequirementFormData = z.infer<typeof requirementSchema>;
