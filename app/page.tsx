import { dashboardSnapshot } from "@/lib/analytics/mock-data";

const panelDescriptions = [
  {
    eyebrow: "Attention map",
    title: "See how visitors move through Ascension",
    copy:
      "This first cut focuses on the questions from your shared analytics spec: who engages, what gets opened, where interest converts, and which portfolio pieces pull the most attention."
  },
  {
    eyebrow: "Shared contract",
    title: "Built to match your event model from day one",
    copy:
      "Every surface here is shaped around the same `analytics_events` contract you defined, which keeps the eventual ingestion API, Postgres tables, and dashboard queries aligned."
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

function RankedList({
  title,
  items
}: {
  title: string;
  items: { label: string; value: number; delta?: string }[];
}) {
  const maxValue = Math.max(...items.map((item) => item.value));

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>Top signals</h2>
        </div>
      </div>

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
    </section>
  );
}

export default function HomePage() {
  const { audience, cta, devices, liveFeed, projects, referrers, sections, timeline } =
    dashboardSnapshot;
  const maxTimelineValue = Math.max(...timeline.map((entry) => entry.value));

  return (
    <main className="dashboard-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Ascension Analytics</p>
          <h1>Portfolio intelligence with a product dashboard feel.</h1>
          <p className="hero-text">
            A starter analytics workspace for your portfolio app, designed around
            event-driven engagement instead of generic pageview reporting.
          </p>
          <div className="hero-badges">
            <span>Source: portfolio</span>
            <span>Backed by `analytics_events`</span>
            <span>Ready for Supabase or Postgres</span>
          </div>
        </div>

        <aside className="hero-aside">
          <p>Snapshot generated</p>
          <strong>{formatDate(dashboardSnapshot.generatedAt)}</strong>
          <span>Current view uses mock data shaped from your shared analytics spec.</span>
        </aside>
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
          helper="Anonymous visitors during the current sample window."
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
          helper="Estimated session duration for engaged traffic."
        />
      </section>

      <section className="panel-grid analytics-grid">
        <section className="panel timeline-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Event timeline</p>
              <h2>Weekly interaction pulse</h2>
            </div>
            <span className="panel-note">Mock chart, ready for SQL-backed aggregation</span>
          </div>

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
        </section>

        <RankedList title="Section opens" items={sections} />
        <RankedList title="Project attention" items={projects} />
        <RankedList title="CTA performance" items={cta} />
        <RankedList title="Traffic sources" items={referrers} />
        <RankedList title="Device mix" items={devices} />
      </section>

      <section className="panel live-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Live feed</p>
            <h2>Recent event payloads</h2>
          </div>
          <span className="panel-note">Useful for validating ingestion while wiring the API</span>
        </div>

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
      </section>
    </main>
  );
}
