import type { MockListing } from "@/types";

export interface College {
  id: string;
  name: string;
  university: string;
  students: number;
  booksListed: number;
  totalViews: number;
}

export interface CollegeInsights {
  college: College | null;
  books: MockListing[];
  topColleges: College[];
}
