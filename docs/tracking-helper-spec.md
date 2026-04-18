# Ascension Portfolio Tracking Helper Spec

## Purpose

This document defines the client-side tracking helper that the Ascension portfolio app should use for all analytics events.

Its job is to make event emission:

- consistent
- typed
- easy to call from UI components
- aligned with the shared analytics contract

This helper is the main Phase 1 deliverable because it prevents analytics logic from being scattered across the portfolio UI.

## Relationship To Other Docs

- [Shared Analytics Spec](./shared-analytics-spec.md) defines the event contract
- [Architecture](./architecture.md) defines where the helper sits in the system
- [Development Phases](./development-phases.md) defines when this helper is built

If this document and the shared analytics spec ever disagree, update the shared analytics spec first.

## Responsibilities

The tracking helper should:

- expose one shared `track()` API
- attach shared event fields automatically
- keep event names and metadata typed
- manage visitor and session identifiers centrally
- normalize device type
- send events to the ingestion endpoint
- fail quietly if analytics delivery breaks

The tracking helper should not:

- query the database directly
- block UI interactions while sending analytics
- let components assemble raw payloads manually
- collect personal information

## Public API

The portfolio app should use a simple interface like this:

```ts
track("project_opened", {
  projectId: "daarkin",
  title: "Daarkin"
});
```

Recommended helper surface:

```ts
type Track = <TEvent extends AnalyticsEventName>(
  event: TEvent,
  metadata?: AnalyticsEventMetadataMap[TEvent]
) => void;
```

Recommended supporting APIs:

```ts
createAnalyticsTracker(options?): {
  track: Track;
  createEvent: TrackEventFactory;
  getContext: () => AnalyticsContext;
}
```

This keeps the basic API easy for components while still allowing tests and debugging to inspect generated payloads.

## Event Construction Rules

Every emitted event should include:

- `event`
- `sessionId`
- `visitorId`
- `timestamp`
- `path`
- `source`
- `deviceType`

Optional fields:

- `referrer`
- `userAgent`
- `metadata`

These fields should be attached by the helper, not by individual components.

## Event Name And Metadata Typing

The helper should use a central event map so each event name has one expected metadata shape.

Examples:

- `session_started` -> `{}`
- `graph_interaction_started` -> `{ interactionType: string }`
- `section_opened` -> `{ section: "projects" | "skills" | "experience" | "certifications" | "about" }`
- `project_opened` -> `{ projectId: string; title: string }`
- `resume_clicked` -> `{ location: string }`

This prevents invalid payloads from being created in the UI.

## Session And Visitor ID Rules

### Visitor ID

The visitor ID should:

- be anonymous
- persist across visits
- be stored in browser storage
- be generated once and reused

Recommended storage key:

```txt
ascension.analytics.visitor_id
```

### Session ID

The session ID should:

- represent one active browsing session
- reset when the session expires
- be stored in browser storage
- be paired with a last-seen timestamp

Recommended storage keys:

```txt
ascension.analytics.session_id
ascension.analytics.session_last_seen
```

Recommended timeout:

```txt
30 minutes
```

If the last activity is older than the timeout, start a new session.

## Session Start Behavior

The helper should support emitting `session_started` automatically once a fresh session is created.

Rules:

- do not emit it on every page interaction
- emit it once per newly created session
- let the portfolio app call an initialization function on app load

Suggested flow:

1. initialize tracker on app load
2. load or create visitor ID
3. load or create session ID
4. if a new session was created, emit `session_started`

## Device Type Normalization

The helper should normalize device type into:

- `mobile`
- `desktop`
- `tablet`
- `unknown`

This should be derived centrally from browser context and user agent heuristics, not set ad hoc in components.

The initial heuristic can be simple and improved later.

## Network Delivery Rules

The helper should send events to:

```txt
POST /api/track
```

Delivery rules:

- prefer fire-and-forget behavior
- do not throw UI-visible errors on analytics failure
- use `navigator.sendBeacon()` when appropriate
- fall back to `fetch()` with `keepalive` when needed

The helper should treat analytics as best effort.

## Failure Handling

If sending fails:

- do not interrupt the user flow
- optionally log warnings in development only
- do not retry aggressively in V1

This keeps analytics from becoming a product reliability risk.

## Integration Pattern In The Portfolio App

Recommended usage pattern:

1. create one analytics module
2. export the shared `track()` helper
3. import `track()` anywhere analytics is needed
4. initialize session handling at the app shell level

Components should look like:

```ts
track("section_opened", {
  section: "projects"
});
```

They should not look like:

```ts
fetch("/api/track", {
  method: "POST",
  body: JSON.stringify({
    event: "section_opened",
    visitorId: "...",
    sessionId: "...",
    deviceType: "desktop"
  })
});
```

## V1 Event Coverage Expectations

The helper should be capable of supporting all initial event types from the shared spec, even if the portfolio app only wires them in gradually.

Priority implementation order:

1. `session_started`
2. `graph_interaction_started`
3. `section_opened`
4. `project_opened`
5. recruiter CTA events

## Recommended File Ownership

Suggested responsibility split inside the portfolio app:

- event types and metadata map
- tracking helper implementation
- browser storage and ID utilities
- device detection utility

This keeps the contract centralized and easy to maintain.

## Done Criteria

This helper is done for Phase 1 when:

- all portfolio analytics calls go through one shared helper
- event names and metadata are typed
- session and visitor IDs are managed centrally
- device type is normalized centrally
- the helper emits payloads that match the shared analytics spec
