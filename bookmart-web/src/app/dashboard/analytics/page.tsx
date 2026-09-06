"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import DateRangePicker from "@/components/analytics/DateRangePicker";
import MetricCard from "@/components/analytics/MetricCard";
import PerformanceChart from "@/components/analytics/PerformanceChart";
import ChartMetricPill from "@/components/analytics/ChartMetricPill";
import ActivityInsightsCard from "@/components/analytics/ActivityInsightsCard";
import ActiveListingsCard from "@/components/analytics/ActiveListingsCard";
import TopPerformersTable from "@/components/analytics/TopPerformersTable";
import RecentActivityCard from "@/components/analytics/RecentActivityCard";
import { dummyAnalyticsData, DEFAULT_DATE_RANGE } from "@/services/analytics";
import type { ChartMetric, DateRange } from "@/types/analytics";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [chartMetric, setChartMetric] = useState<ChartMetric>("views");

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-9 space-y-6">
            <AnalyticsHeader
              title="Analytics"
              subtitle="Track your performance and activities"
              dateRangeLabel={dateRange.label || DEFAULT_DATE_RANGE.label || ""}
            />

            <DateRangePicker value={dateRange} onChange={setDateRange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dummyAnalyticsData.kpis.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>

            <PerformanceChart
              data={dummyAnalyticsData.chartData}
              metric={chartMetric}
              onMetricChange={setChartMetric}
            />

            <div className="flex flex-wrap items-center gap-3">
              <ChartMetricPill label="Total Views" value={553} />
              <ChartMetricPill label="Unique Visitors" value={242} />
              <ChartMetricPill label="Book Clicks" value={82} />
              <ChartMetricPill label="Messages" value={67} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActiveListingsCard listings={dummyAnalyticsData.activeListings} />
              <ActivityInsightsCard insights={dummyAnalyticsData.insights} />
            </div>

            <TopPerformersTable performers={dummyAnalyticsData.topPerformers} />

            <RecentActivityCard items={dummyAnalyticsData.recentActivity} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
