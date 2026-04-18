export type DeviceType = "mobile" | "desktop" | "tablet" | "unknown";

export type AnalyticsEvent = {
  event: string;
  sessionId: string;
  visitorId: string;
  timestamp: string;
  path: string;
  source: "portfolio";
  deviceType: DeviceType;
  referrer?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
};

export type TimeSeriesPoint = {
  label: string;
  value: number;
};

export type RankedMetric = {
  label: string;
  value: number;
  delta?: string;
};

export type DashboardSnapshot = {
  generatedAt: string;
  audience: {
    totalVisitors: number;
    engagedVisitors: number;
    interactionRate: number;
    averageSessionMinutes: number;
  };
  cta: RankedMetric[];
  sections: RankedMetric[];
  projects: RankedMetric[];
  referrers: RankedMetric[];
  devices: RankedMetric[];
  timeline: TimeSeriesPoint[];
  liveFeed: AnalyticsEvent[];
};
