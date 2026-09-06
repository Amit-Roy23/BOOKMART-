import type { College, CollegeInsights } from "@/types/college";
import type { MockListing } from "@/types";

const COLLEGES: College[] = [
  {
    id: "srcc",
    name: "Shri Ram College of Commerce",
    university: "University of Delhi",
    students: 248,
    booksListed: 532,
    totalViews: 1800,
  },
  {
    id: "st-xaviers",
    name: "St. Xavier's College",
    university: "University of Mumbai",
    students: 312,
    booksListed: 487,
    totalViews: 1620,
  },
  {
    id: "loyola",
    name: "Loyola College",
    university: "University of Madras",
    students: 289,
    booksListed: 441,
    totalViews: 1490,
  },
  {
    id: "christ",
    name: "Christ University",
    university: "Bengaluru",
    students: 401,
    booksListed: 398,
    totalViews: 1340,
  },
  {
    id: "hindu",
    name: "Hindu College",
    university: "University of Delhi",
    students: 226,
    booksListed: 365,
    totalViews: 1210,
  },
  {
    id: "presidency",
    name: "Presidency College",
    university: "University of Calcutta",
    students: 198,
    booksListed: 312,
    totalViews: 980,
  },
  {
    id: "fergusson",
    name: "Fergusson College",
    university: "Savitribai Phule Pune University",
    students: 174,
    booksListed: 287,
    totalViews: 870,
  },
  {
    id: "jmc",
    name: "Jesus and Mary College",
    university: "University of Delhi",
    students: 163,
    booksListed: 254,
    totalViews: 760,
  },
];

const COLLEGE_BOOKS: MockListing[] = [
  {
    id: "ci-1",
    title: "Atomic Habits",
    author: "James Clear",
    price: 350,
    condition: "Like New",
    sellerName: "Arjun Mehta",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    distance: "0.5 km",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    college: "Shri Ram College of Commerce",
    description: "An easy and proven way to build good habits and break bad ones.",
  },
  {
    id: "ci-2",
    title: "Ikigai",
    author: "Hector Garcia",
    price: 160,
    condition: "Good Condition",
    sellerName: "Neha Sharma",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    distance: "0.7 km",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    college: "Shri Ram College of Commerce",
    description: "The Japanese secret to a long and happy life.",
  },
  {
    id: "ci-3",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    price: 220,
    condition: "Like New",
    sellerName: "Rohit Verma",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    distance: "0.9 km",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400",
    college: "Shri Ram College of Commerce",
    description: "What the rich teach their kids about money.",
  },
  {
    id: "ci-4",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 180,
    condition: "Good Condition",
    sellerName: "Diya Patel",
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    distance: "1.1 km",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    college: "Shri Ram College of Commerce",
    description: "A magical fable about following your dream.",
  },
  {
    id: "ci-5",
    title: "Deep Work",
    author: "Cal Newport",
    price: 190,
    condition: "Like New",
    sellerName: "Karan Singh",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    distance: "1.3 km",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    college: "Shri Ram College of Commerce",
    description: "Rules for focused success in a distracted world.",
  },
  {
    id: "ci-6",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 150,
    condition: "Good Condition",
    sellerName: "Ishita Bansal",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    distance: "1.5 km",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
    college: "Shri Ram College of Commerce",
    description: "The landmark bestseller on achieving personal success.",
  },
];

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function getColleges(): College[] {
  return COLLEGES;
}

export async function fetchCollegeInsights(collegeId?: string): Promise<CollegeInsights> {
  const college = collegeId ? COLLEGES.find((c) => c.id === collegeId) ?? null : COLLEGES[0];
  const topColleges = [...COLLEGES]
    .filter((c) => c.id !== college?.id)
    .sort((a, b) => b.booksListed - a.booksListed)
    .slice(0, 5);
  return delay({ college, books: COLLEGE_BOOKS, topColleges });
}
