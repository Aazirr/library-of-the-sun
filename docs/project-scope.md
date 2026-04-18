# Ascension Analytics Project Scope

## Project Summary

Ascension Analytics is a focused analytics dashboard for the Ascension portfolio webapp.

Its job is to help answer one core question:

How are real visitors interacting with the portfolio experience?

This is not a generic web analytics product. It is a portfolio-specific product analytics dashboard built around the structure, content, and recruiter flows inside Ascension.

## Primary Goal

Build a private dashboard that turns portfolio interaction events into clear, useful answers about:

- visitor engagement
- section and project interest
- recruiter CTA performance
- traffic sources
- device differences

## Target User

The primary user is you, the portfolio owner.

The dashboard should help you make better product and presentation decisions such as:

- which projects deserve stronger placement
- which sections people ignore
- whether recruiters are clicking important CTAs
- whether mobile users behave differently from desktop users
- whether portfolio changes improve engagement over time

## In Scope For V1

V1 should include:

- ingestion of structured analytics events from the portfolio app
- storage of raw events in PostgreSQL
- storage of basic session records
- a private analytics dashboard
- summary metrics for visitors, interaction rate, and average session quality
- rankings for sections, projects, and CTA events
- device and referrer breakdowns
- timeline-style reporting for event activity
- a recent event feed for debugging and validation

## Out Of Scope For V1

The following should not be part of the first release:

- public-facing analytics pages
- multi-user workspaces
- role-based access control beyond simple private access
- complex attribution modeling
- heatmaps or screen recordings
- AI-generated recommendations
- marketing email analytics
- general-purpose CMS features
- form capture, lead scoring, or CRM automation
- custom event builders for arbitrary websites

## Product Principles

- Keep the dashboard tightly aligned to the Ascension experience.
- Favor high-signal metrics over vanity metrics.
- Preserve raw data so future analysis is possible.
- Keep the event schema stable and explicit.
- Prefer a small number of trustworthy insights over a large number of noisy charts.

## Success Criteria For V1

V1 is successful if it can reliably answer:

- How many visitors start interacting with the graph?
- Which sections are opened most often?
- Which projects receive the most attention?
- Which recruiter CTAs are used most?
- Where do visitors come from?
- How does behavior differ between desktop and mobile?

## Risks To Watch

- over-tracking too many low-value events
- drifting from the shared event contract
- building dashboard UI before ingestion is trustworthy
- introducing metrics that look useful but are not actionable
- mixing debugging views with decision-making views without a clear boundary

## Scope Guardrails

If a proposed feature does not clearly improve understanding of portfolio behavior, it probably does not belong in the early versions of Ascension Analytics.
