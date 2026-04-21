function SkeletonCard() {
  return (
    <article className="metric-card skeleton-card" aria-hidden="true">
      <span className="skeleton-line skeleton-short" />
      <strong className="skeleton-line skeleton-tall" />
      <p className="skeleton-line skeleton-wide" />
    </article>
  );
}

export default function Loading() {
  return (
    <main className="dashboard-shell">
      <section className="hero">
        <div className="hero-copy skeleton-panel">
          <p className="eyebrow">Ascension Analytics</p>
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-copy" />
          <div className="skeleton-line skeleton-copy" />
        </div>

        <aside className="hero-aside skeleton-panel">
          <div className="skeleton-line skeleton-short" />
          <div className="skeleton-line skeleton-copy" />
          <div className="skeleton-line skeleton-wide" />
        </aside>
      </section>

      <section className="metrics-strip">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </section>

      <section className="panel skeleton-panel loading-panel">
        <p className="eyebrow">Loading dashboard</p>
        <h2>Fetching analytics signals</h2>
        <p>
          Pulling overview metrics, rankings, and recent event activity from the analytics
          store.
        </p>
      </section>
    </main>
  );
}
