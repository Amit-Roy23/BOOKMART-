"use client";

import { Users, BookOpen, Eye } from "lucide-react";
import { formatCompact } from "@/lib/utils";
import type { College } from "@/types/college";
import { StatisticCard } from "./StatisticCard";

interface CollegeStatisticsProps {
  college: College;
}

export function CollegeStatistics({ college }: CollegeStatisticsProps) {
  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      aria-label="College statistics"
    >
      <StatisticCard
        icon={<Users className="w-6 h-6" aria-hidden="true" />}
        value={formatCompact(college.students)}
        label="Students on BookMart"
        subtitle="From your college"
      />
      <StatisticCard
        icon={<BookOpen className="w-6 h-6" aria-hidden="true" />}
        value={formatCompact(college.booksListed)}
        label="Books Listed"
        subtitle="By your college"
      />
      <StatisticCard
        icon={<Eye className="w-6 h-6" aria-hidden="true" />}
        value={formatCompact(college.totalViews)}
        label="Total Views"
        subtitle="On college books"
      />
    </section>
  );
}
