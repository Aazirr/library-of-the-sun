# Ascension Analytics Architecture

## Overview

Ascension Analytics has four core layers:

1. Ascension portfolio app
2. ingestion API
3. PostgreSQL analytics storage
4. analytics dashboard webapp

The shared analytics spec defines the contract between those layers.

## System Goal

The architecture should make these things true:

- the portfolio app emits consistent events
- ingestion validates and normalizes those events
- raw data is stored without losing useful metadata
- dashboard queries are built on one stable source of truth

## High-Level Flow

```txt
Portfolio UI
  -> shared tracking helper
  -> POST /api/track
  -> ingestion validation + enrichment
  -> analytics_events / analytics_sessions tables
  -> dashboard queries + aggregated views
  -> analytics UI
```

## Layer Responsibilities

### 1. Portfolio App

Responsibilities:

- detect meaningful interactions
- call one shared tracking helper
- attach event-specific metadata only
- avoid direct database access
- treat analytics delivery as best effort

The portfolio app should never let analytics concerns leak across the UI codebase. Components should call a helper, not assemble raw analytics payloads by hand.

### 2. Shared Tracking Helper

Responsibilities:

- expose a small API like `track(event, metadata)`
- attach standard fields such as `sessionId`, `visitorId`, `timestamp`, `path`, `source`, and `deviceType`
- send events to the ingestion endpoint
- handle failures quietly without breaking the portfolio UX

This helper is the client-side enforcement point for the event contract.

### 3. Ingestion API

Responsibilities:

- validate required fields
- reject malformed payloads
- normalize input where needed
- enrich server-controlled fields if necessary
- write to storage

This layer exists so the dashboard does not depend on trusting client input blindly.

## Recommended API Surface

```txt
POST /api/track
GET /api/dashboard/overview
GET /api/dashboard/feed
```

The `POST /api/track` route is the first priority. The dashboard read endpoints can come later if the app does not read directly from the database.

### 4. Database

Responsibilities:

- store raw events
- store session-level records
- support indexed querying
- preserve JSON metadata for event-specific fields

Primary tables from the shared contract:

- `analytics_events`
- `analytics_sessions`

## Storage Strategy

Use raw-event storage first.

That means:

- keep every accepted event
- compute derived metrics from raw data
- add materialized views or summary tables only when query cost justifies them

This keeps early development flexible and reduces the risk of locking into the wrong rollup model too soon.

## Analytics Dashboard

Responsibilities:

- read trusted analytics data
- present portfolio-specific metrics
- support comparisons by timeframe, device, and referrer
- expose both overview-level and validation-level views
- recover visitor/session summaries from raw events if historical session rows are incomplete

The dashboard should have two mental modes:

1. Decision mode
   - summary cards
   - top sections
   - top projects
   - CTA performance
   - trends over time

2. Validation mode
   - recent event feed
   - raw payload inspection
   - ingestion health checks

## Query Model

The dashboard should start with direct SQL-backed aggregate queries such as:

- distinct visitors over a date range
- distinct engaged visitors based on `graph_interaction_started`
- event counts grouped by `event_name`
- section counts grouped by `metadata.section`
- project counts grouped by `metadata.projectId`
- CTA counts by explicit event names
- referrer counts
- device counts

For resilience, the dashboard may derive session-level summaries from `analytics_events` when
`analytics_sessions` is partially missing. That fallback is for read robustness only. The
producer app should still keep writing both raw events and session rows.

## Security And Privacy

- Keep the dashboard private.
- Do not store PII in analytics metadata.
- Do not depend on exact IP storage for product insights.
- Keep visitor identity anonymous and persistent only as needed for analytics continuity.

## Recommended Future Enhancements

Once the core pipeline is stable, the architecture can expand with:

- date-range filtering
- cached aggregate endpoints
- materialized views for heavy queries
- authenticated dashboard access
- alerting for ingestion failures

## Architecture Guardrails

- Do not let the dashboard invent new event meanings that are absent from the spec.
- Do not let UI components bypass the tracking helper.
- Do not optimize storage prematurely before real query patterns exist.
- Do not mix private analytics concerns into the public portfolio surface.
