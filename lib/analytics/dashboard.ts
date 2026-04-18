import { dashboardSnapshot as mockDashboardSnapshot } from "@/lib/analytics/mock-data";
import {
  AnalyticsEvent,
  DashboardSnapshot,
  DeviceType,
  RankedMetric,
  TimeSeriesPoint
} from "@/lib/analytics/types";

type DashboardDataSource = "live" | "mock";

export type DashboardLoadResult = {
  snapshot: DashboardSnapshot;
  source: DashboardDataSource;
  note: string;
};

type AnalyticsEventRow = {
  event_name: string;
  session_id: string;
  visitor_id: string;
  occurred_at: string;
  path: string;
  source: string;
  device_type: DeviceType;
  referrer: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
};

type AnalyticsSessionRow = {
  id: string;
  visitor_id: string;
  started_at: string;
  last_seen_at: string;
  landing_path: string;
  referrer: string | null;
  device_type: DeviceType;
  source: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getNumericEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function titleCase(value: string) {
  return value
    .split(/[_.\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function groupCounts<T>(items: T[], getKey: (item: T) => string | null | undefined) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);
    if (!key) {
      continue;
    }

    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function toRankedMetrics(
  counts: Map<string, number>,
  transformLabel: (label: string) => string = titleCase,
  limit = 5
): RankedMetric[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({
      label: transformLabel(label),
      value
    }));
}

function buildTimeline(events: AnalyticsEventRow[]): TimeSeriesPoint[] {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC"
  });
  const dailyCounts = new Map<string, number>();
  const today = new Date();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - offset)
    );
    dailyCounts.set(day.toISOString().slice(0, 10), 0);
  }

  for (const event of events) {
    const dayKey = event.occurred_at.slice(0, 10);
    if (dailyCounts.has(dayKey)) {
      dailyCounts.set(dayKey, (dailyCounts.get(dayKey) ?? 0) + 1);
    }
  }

  return [...dailyCounts.entries()].map(([dayKey, value]) => ({
    label: formatter.format(new Date(`${dayKey}T00:00:00.000Z`)),
    value
  }));
}

function computeAverageSessionMinutes(sessions: AnalyticsSessionRow[]) {
  if (sessions.length === 0) {
    return 0;
  }

  const totalMinutes = sessions.reduce((sum, session) => {
    const started = new Date(session.started_at).getTime();
    const lastSeen = new Date(session.last_seen_at).getTime();
    const durationMinutes = Math.max(0, (lastSeen - started) / 60000);

    return sum + durationMinutes;
  }, 0);

  return Number((totalMinutes / sessions.length).toFixed(1));
}

function toAnalyticsEvent(row: AnalyticsEventRow): AnalyticsEvent {
  return {
    event: row.event_name,
    sessionId: row.session_id,
    visitorId: row.visitor_id,
    timestamp: row.occurred_at,
    path: row.path,
    source: "portfolio",
    deviceType: row.device_type,
    referrer: row.referrer,
    userAgent: row.user_agent,
    metadata: row.metadata ?? {}
  };
}

function buildSnapshot(events: AnalyticsEventRow[], sessions: AnalyticsSessionRow[]): DashboardSnapshot {
  const totalVisitors = new Set(sessions.map((session) => session.visitor_id)).size;
  const engagedVisitors = new Set(
    events
      .filter((event) => event.event_name === "graph_interaction_started")
      .map((event) => event.visitor_id)
  ).size;
  const interactionRate =
    totalVisitors === 0 ? 0 : Number(((engagedVisitors / totalVisitors) * 100).toFixed(1));

  const ctaEvents = new Set([
    "hire_me_opened",
    "resume_clicked",
    "linkedin_clicked",
    "github_profile_clicked",
    "project_github_clicked",
    "project_live_demo_clicked",
    "email_clicked"
  ]);

  const sections = toRankedMetrics(
    groupCounts(
      events.filter((event) => event.event_name === "section_opened"),
      (event) => String(event.metadata?.section ?? "")
    )
  );
  const projects = toRankedMetrics(
    groupCounts(
      events.filter((event) => event.event_name === "project_opened"),
      (event) => String(event.metadata?.title ?? event.metadata?.projectId ?? "")
    )
  );
  const cta = toRankedMetrics(
    groupCounts(
      events.filter((event) => ctaEvents.has(event.event_name)),
      (event) => event.event_name
    )
  );
  const referrers = toRankedMetrics(
    groupCounts(sessions, (session) => {
      if (!session.referrer) {
        return "Direct";
      }

      try {
        return new URL(session.referrer).hostname.replace(/^www\./, "");
      } catch {
        return session.referrer;
      }
    })
  );
  const devices = toRankedMetrics(
    groupCounts(sessions, (session) => session.device_type),
    titleCase,
    4
  );

  return {
    generatedAt: new Date().toISOString(),
    audience: {
      totalVisitors,
      engagedVisitors,
      interactionRate,
      averageSessionMinutes: computeAverageSessionMinutes(sessions)
    },
    cta,
    sections,
    projects,
    referrers,
    devices,
    timeline: buildTimeline(events),
    liveFeed: events.slice(0, 10).map(toAnalyticsEvent)
  };
}

async function fetchSupabaseRows<T>(path: string, serviceRoleKey: string) {
  const response = await fetch(path, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  return (await response.json()) as T[];
}

export async function getDashboardData(): Promise<DashboardLoadResult> {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      snapshot: mockDashboardSnapshot,
      source: "mock",
      note: "Mock data is showing because this repo does not have Supabase read credentials configured yet."
    };
  }

  const source = process.env.ANALYTICS_SOURCE ?? "portfolio";
  const eventLimit = getNumericEnv("ANALYTICS_EVENT_FETCH_LIMIT", 5000);
  const sessionLimit = getNumericEnv("ANALYTICS_SESSION_FETCH_LIMIT", 5000);
  const baseUrl = `${supabaseUrl}/rest/v1`;
  const eventQuery =
    `${baseUrl}/analytics_events?` +
    "select=event_name,session_id,visitor_id,occurred_at,path,source,device_type,referrer,user_agent,metadata" +
    `&source=eq.${encodeURIComponent(source)}` +
    "&order=occurred_at.desc" +
    `&limit=${eventLimit}`;
  const sessionQuery =
    `${baseUrl}/analytics_sessions?` +
    "select=id,visitor_id,started_at,last_seen_at,landing_path,referrer,device_type,source" +
    `&source=eq.${encodeURIComponent(source)}` +
    "&order=started_at.desc" +
    `&limit=${sessionLimit}`;

  try {
    const [events, sessions] = await Promise.all([
      fetchSupabaseRows<AnalyticsEventRow>(eventQuery, serviceRoleKey),
      fetchSupabaseRows<AnalyticsSessionRow>(sessionQuery, serviceRoleKey)
    ]);

    return {
      snapshot: buildSnapshot(events, sessions),
      source: "live",
      note: `Live Supabase data loaded from ${source} analytics storage.`
    };
  } catch (error) {
    console.error("Unable to load live analytics data", error);

    return {
      snapshot: mockDashboardSnapshot,
      source: "mock",
      note: "Live query failed, so the dashboard fell back to mock data for now."
    };
  }
}
