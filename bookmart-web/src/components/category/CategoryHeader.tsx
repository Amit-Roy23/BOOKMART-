"use client";

import {
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

import Breadcrumb from "./Breadcrumb";

interface CategoryHeaderProps {
  title?: string;
  description?: string;
  totalBooks?: number;
  totalSellers?: number;
  totalUniversities?: number;
}

export default function CategoryHeader({
  title = "Science Fiction",
  description = "Explore a curated collection of pre-owned Science Fiction books from verified students and bookstores near you.",
  totalBooks = 1248,
  totalSellers = 328,
  totalUniversities = 48,
}: CategoryHeaderProps) {
  return (
    <section className="mb-8">
      <Breadcrumb
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Categories",
            href: "/categories",
          },
          {
            label: title,
          },
        ]}
      />

      <div className="flex flex-col justify-between gap-8 rounded-3xl border border-gray-200 bg-white p-8 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            📚 Popular Category
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-500">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1">
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <div className="rounded-xl bg-emerald-100 p-3">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalBooks.toLocaleString()}
              </p>

              <p className="text-sm text-gray-500">
                Books Available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <div className="rounded-xl bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalSellers}
              </p>

              <p className="text-sm text-gray-500">
                Verified Sellers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <div className="rounded-xl bg-purple-100 p-3">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalUniversities}
              </p>

              <p className="text-sm text-gray-500">
                Universities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
