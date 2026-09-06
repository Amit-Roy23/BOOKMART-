export type DateRange = {
  from: Date;
  to: Date;
  label?: string;
};

export type KPIMetric = {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: "eye" | "bookmark" | "message" | "deal";
  bgColor: string;
  iconColor: string;
};

export type ChartDataPoint = {
  date: string;
  views: number;
  previous: number;
};

export type ChartMetric = "views" | "transactions";

export type InsightItem = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  metric: string;
  trend?: string;
  trendUp?: boolean;
};

export type ActiveListing = {
  id: string;
  title: string;
  status: "active" | "attention";
};

export type TopPerformer = {
  id: string;
  rank: number;
  title: string;
  category: string;
  views: number;
  bookmarks: number;
  messages: number;
  revenue: number;
  soldCount: number;
  coverImage?: string;
};

export type ActivityItem = {
  id: string;
  icon: string;
  title: string;
  timestamp: string;
};

export type AnalyticsData = {
  kpis: KPIMetric[];
  chartData: ChartDataPoint[];
  insights: InsightItem[];
  activeListings: ActiveListing[];
  topPerformers: TopPerformer[];
  recentActivity: ActivityItem[];
};
