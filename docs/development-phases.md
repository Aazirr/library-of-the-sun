# Ascension Analytics Development Phases

## Purpose

This document breaks the project into manageable phases so we can build in a logical order and avoid getting lost mid-development.

The general rule is simple:

Data trust comes before dashboard polish.

## Phase 0: Foundation And Planning

Goal:
Establish the contract, boundaries, and build order.

Deliverables:

- [x] shared analytics spec
- [x] project scope document
- [x] architecture document
- [x] phased roadmap
- [ ] initial repo structure for the analytics app

Exit criteria:

- [x] event model is agreed on
- [x] initial V1 scope is stable
- [x] development sequence is clear

## Phase 1: Portfolio Tracking Foundation

Goal:
Make the Ascension portfolio emit reliable analytics events.

Deliverables:

- [ ] shared tracking helper
- [ ] `session_started`
- [ ] `graph_interaction_started`
- [ ] section open tracking
- [ ] project open tracking
- [ ] CTA click tracking
- [ ] device type normalization
- [ ] session and visitor ID management

Exit criteria:

- [ ] all V1 portfolio interactions emit valid payloads
- [ ] events follow the shared contract
- [ ] UI components no longer handcraft analytics payloads

## Phase 2: Ingestion API And Storage

Goal:
Accept analytics events safely and persist them in PostgreSQL.

Deliverables:

- [ ] `POST /api/track`
- [ ] payload validation
- [ ] server-side normalization where needed
- [ ] `analytics_events` table
- [ ] `analytics_sessions` table
- [ ] indexes for expected query patterns
- [ ] local and production environment configuration

Exit criteria:

- [ ] valid events are stored successfully
- [ ] malformed events are rejected predictably
- [ ] raw metadata is preserved
- [ ] database writes are stable enough for dashboard development

## Phase 3: Query Layer And Metrics Definition

Goal:
Turn raw events into clear product metrics.

Deliverables:

- [ ] overview query set
- [ ] engagement query set
- [ ] section ranking query
- [ ] project ranking query
- [ ] CTA query set
- [ ] device and referrer breakdown queries
- [ ] timeline query
- [ ] recent event feed query

Exit criteria:

- [ ] every V1 dashboard card is backed by a real query
- [ ] metric definitions are written down and consistent
- [ ] query results match manual spot checks

## Phase 4: Dashboard UI

Goal:
Ship a private dashboard that surfaces the most useful portfolio insights.

Deliverables:

- [ ] overview metrics section
- [ ] engagement charts
- [ ] section and project rankings
- [ ] CTA analytics view
- [ ] device and referrer panels
- [ ] recent event feed
- [ ] loading, empty, and error states

Exit criteria:

- [ ] dashboard is usable on desktop and mobile
- [ ] all V1 metrics render from real data
- [ ] dashboard helps answer the success questions from scope

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

1. [ ] finalize the tracking helper contract in the portfolio app
2. [ ] implement `POST /api/track`
3. [ ] create the database schema
4. [ ] verify raw events with a recent-event feed
5. [ ] build the first real overview dashboard from live data
