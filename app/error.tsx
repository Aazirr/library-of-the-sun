"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="dashboard-shell">
      <section className="panel error-panel">
        <p className="eyebrow">Dashboard error</p>
        <h1>We couldn’t load the analytics dashboard.</h1>
        <p className="hero-text">
          The app hit an unexpected error while assembling the dashboard view. You can
          retry now, and if it keeps failing, check the Supabase read configuration and
          server logs.
        </p>
        <div className="error-actions">
          <button type="button" className="retry-button" onClick={reset}>
            Retry dashboard
          </button>
        </div>
        <div className="error-meta">
          <strong>Error message</strong>
          <p>{error.message || "Unknown dashboard error"}</p>
        </div>
      </section>
    </main>
  );
}
