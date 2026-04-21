import { getDashboardData } from "@/lib/analytics/dashboard";

const panelDescriptions = [
  {
    eyebrow: "Attention map",
    title: "See how visitors move through Ascension",
    copy:
      "This dashboard stays tightly focused on recruiter and portfolio behavior: who engages, what gets opened, where interest converts, and which work samples pull attention."
  },
  {
    eyebrow: "Shared contract",
    title: "Built on the same event model as the portfolio app",
    copy:
      "The analytics website reads the same `analytics_events` and `analytics_sessions` records produced by Ascension, which keeps reporting aligned with the source app."
  }
];

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function MetricCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{helper}</p>
    </article>
  );
}

function EmptyState({
  title,
  copy
}: {
  title: string;
  copy: string;
}) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{copy}</p>
    </div>
  );
}

function RankedList({
  title,
  items,
  emptyTitle,
  emptyCopy
}: {
  title: string;
  items: { label: string; value: number; delta?: string }[];
  emptyTitle: string;
  emptyCopy: string;
}) {
  const maxValue = Math.max(1, ...items.map((item) => item.value));

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>Top signals</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState title={emptyTitle} copy={emptyCopy} />
      ) : (
        <div className="rank-list">
          {items.map((item) => (
            <article className="rank-row" key={item.label}>
              <div className="rank-copy">
                <strong>{item.label}</strong>
                <span>{item.value} events</span>
              </div>

              <div className="rank-meta">
                {item.delta ? <span className="delta-chip">{item.delta}</span> : null}
                <div className="bar-track" aria-hidden="true">
                  <div
                    className="bar-fill"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function EngagementPanel({
  interactionRate,
  engagedVisitors,
  totalVisitors,
  averageSessionMinutes
}: {
  interactionRate: number;
  engagedVisitors: number;
  totalVisitors: number;
  averageSessionMinutes: number;
}) {
  const inactiveVisitors = Math.max(totalVisitors - engagedVisitors, 0);
  const averageSessionProgress = Math.min((averageSessionMinutes / 10) * 100, 100);

  return (
    <section className="panel engagement-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Engagement quality</p>
          <h2>Visitor intent breakdown</h2>
        </div>
        <span className="panel-note">{formatPercent(interactionRate)} interaction rate</span>
      </div>

      <div className="engagement-grid">
        <article className="engagement-card">
          <span>Engaged visitors</span>
          <strong>{engagedVisitors}</strong>
          <div className="bar-track" aria-hidden="true">
            <div className="bar-fill" style={{ width: `${Math.min(interactionRate, 100)}%` }} />
          </div>
        </article>

        <article className="engagement-card">
          <span>Passive visitors</span>
          <strong>{inactiveVisitors}</strong>
          <div className="bar-track" aria-hidden="true">
            <div className="bar-fill passive-fill" style={{ width: `${Math.max(100 - interactionRate, 0)}%` }} />
          </div>
        </article>

        <article className="engagement-card">
          <span>Average session quality</span>
          <strong>{averageSessionMinutes.toFixed(1)} min</strong>
          <div className="bar-track" aria-hidden="true">
            <div className="bar-fill" style={{ width: `${averageSessionProgress}%` }} />
          </div>
        </article>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const { note, snapshot, source } = await getDashboardData();
  const { audience, cta, devices, liveFeed, projects, referrers, sections, timeline } =
    snapshot;
  const maxTimelineValue = Math.max(1, ...timeline.map((entry) => entry.value));

  return (
    <main className="dashboard-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Ascension Analytics</p>
          <h1>Portfolio intelligence with a product dashboard feel.</h1>
          <p className="hero-text">
            The dashboard now combines live analytics reads, product-style summary panels,
            and validation views so you can spot both user behavior and data health in one
            place.
          </p>
          <div className="hero-badges">
            <span>Source: portfolio</span>
            <span>Backed by `analytics_events`</span>
            <span>{source === "live" ? "Live Supabase connected" : "Mock fallback active"}</span>
          </div>
        </div>

        <aside className="hero-aside">
          <p>Snapshot generated</p>
          <strong>{formatDate(snapshot.generatedAt)}</strong>
          <span>{note}</span>
        </aside>
      </section>

      <section className={`status-banner ${source === "live" ? "status-live" : "status-mock"}`}>
        <strong>{source === "live" ? "Live reporting mode" : "Fallback reporting mode"}</strong>
        <p>{note}</p>
      </section>

      <section className="panel-grid intro-grid">
        {panelDescriptions.map((panel) => (
          <article className="panel tone-panel" key={panel.title}>
            <p className="eyebrow">{panel.eyebrow}</p>
            <h2>{panel.title}</h2>
            <p>{panel.copy}</p>
          </article>
        ))}
      </section>

      <section className="metrics-strip">
        <MetricCard
          label="Total visitors"
          value={audience.totalVisitors.toString()}
          helper="Distinct anonymous visitors from recorded sessions."
        />
        <MetricCard
          label="Engaged visitors"
          value={audience.engagedVisitors.toString()}
          helper="Visitors who emitted `graph_interaction_started`."
        />
        <MetricCard
          label="Interaction rate"
          value={formatPercent(audience.interactionRate)}
          helper="Engaged visitors divided by total visitors."
        />
        <MetricCard
          label="Avg session"
          value={`${audience.averageSessionMinutes} min`}
          helper="Average time between `started_at` and `last_seen_at`."
        />
      </section>

      <section className="panel-grid analytics-grid">
        <EngagementPanel
          interactionRate={audience.interactionRate}
          engagedVisitors={audience.engagedVisitors}
          totalVisitors={audience.totalVisitors}
          averageSessionMinutes={audience.averageSessionMinutes}
        />

        <section className="panel timeline-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Event timeline</p>
              <h2>Weekly interaction pulse</h2>
            </div>
            <span className="panel-note">
              {source === "live"
                ? "Computed from live event data"
                : "Mock chart until Supabase is configured"}
            </span>
          </div>

          {timeline.every((entry) => entry.value === 0) ? (
            <EmptyState
              title="No recent event volume"
              copy="Once Ascension records activity for the recent window, this chart will start showing the daily interaction pulse."
            />
          ) : (
            <div className="timeline-chart" aria-label="Weekly interaction chart">
              {timeline.map((entry) => (
                <div className="timeline-bar" key={entry.label}>
                  <span>{entry.value}</span>
                  <div
                    className="timeline-bar-fill"
                    style={{ height: `${(entry.value / maxTimelineValue) * 100}%` }}
                  />
                  <label>{entry.label}</label>
                </div>
              ))}
            </div>
          )}
        </section>

        <RankedList
          title="Section opens"
          items={sections}
          emptyTitle="No section opens yet"
          emptyCopy="Section analytics will appear here when users begin opening portfolio categories."
        />
        <RankedList
          title="Project attention"
          items={projects}
          emptyTitle="No project attention yet"
          emptyCopy="Project ranking data will appear after portfolio visitors start opening project details."
        />
        <RankedList
          title="CTA performance"
          items={cta}
          emptyTitle="No CTA clicks yet"
          emptyCopy="Recruiter and outbound action metrics will populate once CTA events are stored."
        />
        <RankedList
          title="Traffic sources"
          items={referrers}
          emptyTitle="No referrer data yet"
          emptyCopy="Referrer breakdowns will appear once sessions are recorded with inbound sources."
        />
        <RankedList
          title="Device mix"
          items={devices}
          emptyTitle="No device mix yet"
          emptyCopy="Device distribution will appear after session records accumulate."
        />
      </section>

      <section className="panel live-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Live feed</p>
            <h2>Recent event payloads</h2>
          </div>
          <span className="panel-note">
            {source === "live"
              ? "Useful for validating real ingestion activity"
              : "Useful for validating the dashboard structure before live reads are enabled"}
          </span>
        </div>

        {liveFeed.length === 0 ? (
          <EmptyState
            title="No recent events yet"
            copy="The recent event feed will populate once live analytics events are available for this source."
          />
        ) : (
          <div className="event-table">
            <div className="event-table-head">
              <span>Event</span>
              <span>Visitor</span>
              <span>Device</span>
              <span>Referrer</span>
              <span>Timestamp</span>
            </div>

            {liveFeed.map((entry) => (
              <article className="event-row" key={`${entry.sessionId}-${entry.timestamp}`}>
                <div>
                  <strong>{entry.event}</strong>
                  <p>{JSON.stringify(entry.metadata ?? {})}</p>
                </div>
                <span>{entry.visitorId.slice(0, 8)}</span>
                <span>{entry.deviceType}</span>
                <span>{entry.referrer ?? "Direct"}</span>
                <span>{formatDate(entry.timestamp)}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
