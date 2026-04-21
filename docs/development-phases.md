# Ascension Analytics Development Phases

## Purpose

This document breaks the project into manageable phases so we can build in a logical order and avoid getting lost mid-development.

The general rule is simple:

Data trust comes before dashboard polish.

## Current Status

- Active phase: Phase 5 - Hardening And Launch Readiness
- Last completed phase: Phase 4 - Dashboard UI
- Current focus: harden the analytics website for real use with validation, access control, and launch readiness checks

Current verification status:

- `Ascension` local `/api/track` route accepts valid events and returns `202`
- payload normalization is working in the local fallback path
- `Ascension` production is already writing live analytics data to Supabase
- `Library of the Sun` now has a live-read dashboard data layer with mock fallback when local read credentials are missing

## Repo Context

- Producer app repo: `Ascension`
- Analytics dashboard repo: `Library of the Sun`
- Shared contract: [Shared Analytics Spec](./shared-analytics-spec.md)

## Phase 0: Foundation And Planning

Goal:
Establish the contract, boundaries, and build order.

Deliverables:

- [x] shared analytics spec
- [x] project scope document
- [x] architecture document
- [x] phased roadmap
- [x] initial repo structure for the analytics app

Exit criteria:

- [x] event model is agreed on
- [x] initial V1 scope is stable
- [x] development sequence is clear

## Phase 1: Portfolio Tracking Foundation

Goal:
Make the Ascension portfolio emit reliable analytics events.

Deliverables:

- [x] shared tracking helper
- [x] `session_started`
- [x] `graph_interaction_started`
- [x] section open tracking
- [x] project open tracking
- [x] CTA click tracking
- [x] device type normalization
- [x] session and visitor ID management

Exit criteria:

- [x] all V1 portfolio interactions emit valid payloads
- [x] events follow the shared contract
- [x] UI components no longer handcraft analytics payloads

## Phase 2: Ingestion API And Storage

Goal:
Accept analytics events safely and persist them in PostgreSQL.

Deliverables:

- [x] `POST /api/track`
- [x] payload validation
- [x] server-side normalization where needed
- [x] `analytics_events` table
- [x] `analytics_sessions` table
- [x] indexes for expected query patterns
- [x] local and production environment configuration

Exit criteria:

- [x] valid events are stored successfully
- [x] malformed events are rejected predictably
- [x] raw metadata is preserved
- [x] database writes are stable enough for dashboard development

## Phase 3: Query Layer And Metrics Definition

Goal:
Turn raw events into clear product metrics.

Deliverables:

- [x] overview query set
- [x] engagement query set
- [x] section ranking query
- [x] project ranking query
- [x] CTA query set
- [x] device and referrer breakdown queries
- [x] timeline query
- [x] recent event feed query

Exit criteria:

- [x] every V1 dashboard card is backed by a real query
- [x] metric definitions are written down and consistent
- [x] query results match manual spot checks

## Phase 4: Dashboard UI

Goal:
Ship a private dashboard that surfaces the most useful portfolio insights.

Deliverables:

- [x] overview metrics section
- [x] engagement charts
- [x] section and project rankings
- [x] CTA analytics view
- [x] device and referrer panels
- [x] recent event feed
- [x] loading, empty, and error states

Exit criteria:

- [x] dashboard is usable on desktop and mobile
- [x] all V1 metrics render from real data
- [x] dashboard helps answer the success questions from scope

## Phase 5: Hardening And Launch Readiness

Goal:
Make the analytics system trustworthy in real use.

Deliverables:

- [ ] private access control
- [ ] monitoring and logging for ingestion errors
- [ ] query performance review
- [ ] data validation checks
- [ ] basic deployment checklist
- [ ] post-launch metrics review

Exit criteria:

- [ ] production environment is stable
- [ ] private analytics data is protected
- [ ] performance is acceptable for normal use

## Phase 6: Post-V1 Expansion

Possible extensions after V1:

- [ ] date-range and compare-mode filters
- [ ] saved views
- [ ] materialized summary views
- [ ] conversion funnels for recruiter actions
- [ ] release annotations for portfolio changes
- [ ] smarter insight summaries

These should only start after the ingestion pipeline and V1 dashboard are already dependable.

## Suggested Immediate Next Step

When we resume implementation, the next practical build order should be:

1. [x] finalize the tracking helper contract in the portfolio app
2. [x] wire `session_started` into portfolio app initialization
3. [x] wire `track()` into the first graph interaction event
4. [x] wire `track()` into section and project open events
5. [x] wire `track()` into recruiter CTA clicks
6. [x] implement `POST /api/track`
7. [x] create the database schema
8. [x] verify raw events with a recent-event feed
9. [x] build the first real overview dashboard from live data
