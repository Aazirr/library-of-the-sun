# Ascension Analytics

Starter analytics dashboard for the Ascension portfolio webapp.

## What This Includes

- Next.js App Router starter
- typed analytics models based on [docs/shared-analytics-spec.md](docs/shared-analytics-spec.md)
- a first dashboard UI for visitors, engagement, sections, projects, CTA activity, referrers, and a recent event feed
- a server-side live query layer for Supabase-backed analytics reads
- mock analytics fallback data when local read credentials are not configured
- event-derived recovery for visitor and session summaries when `analytics_sessions` is incomplete

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Live Data Setup

Create `.env.local` with:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANALYTICS_SOURCE=portfolio
```

If these values are missing, the dashboard will fall back to mock data so the UI still works locally.

When live reads are configured, the dashboard prefers `analytics_sessions` for visitor/session
metrics but can infer missing session rows from `analytics_events` so older ingestion gaps do not
force the overview cards to zero.

## Next Build Steps

1. Add date-range filtering so the dashboard can focus on recent windows instead of raw fetch limits.
2. Move heavy aggregations into SQL views or cached endpoints if query volume grows.
3. Add authentication before exposing production analytics.
4. Add dashboard-specific empty and error states for lower-volume environments.

## Shared Contract

The source of truth for the event model and ingestion contract lives in [docs/shared-analytics-spec.md](docs/shared-analytics-spec.md).
