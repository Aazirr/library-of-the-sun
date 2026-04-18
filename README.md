# Ascension Analytics

Starter analytics dashboard for the Ascension portfolio webapp.

## What This Includes

- Next.js App Router starter
- typed analytics models based on [docs/shared-analytics-spec.md](docs/shared-analytics-spec.md)
- a first dashboard UI for visitors, engagement, sections, projects, CTA activity, referrers, and a recent event feed
- mock analytics data shaped like the eventual ingestion payloads

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Next Build Steps

1. Add a real data source for `analytics_events` and `analytics_sessions`.
2. Replace mock dashboard aggregates with SQL-backed queries.
3. Add filtering by date range, device type, and referrer.
4. Add authentication before exposing production analytics.

## Shared Contract

The source of truth for the event model and ingestion contract lives in [docs/shared-analytics-spec.md](docs/shared-analytics-spec.md).
