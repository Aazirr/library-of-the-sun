import {
  ANALYTICS_SOURCE,
  AnalyticsContext,
  AnalyticsEventMetadataMap,
  AnalyticsEventName,
  SESSION_TIMEOUT_MS,
  STORAGE_KEYS
} from "@/lib/analytics/event-definitions";
import { AnalyticsEvent, DeviceType } from "@/lib/analytics/types";

type CreateTrackerOptions = {
  endpoint?: string;
  now?: () => Date;
  storage?: Storage;
  location?: Location;
  navigator?: Navigator;
  userAgent?: string | null;
  referrer?: string | null;
  sessionTimeoutMs?: number;
  onError?: (error: unknown) => void;
};

type TrackOptions = {
  dispatch?: boolean;
};

type TrackFn = <TEvent extends AnalyticsEventName>(
  event: TEvent,
  metadata?: AnalyticsEventMetadataMap[TEvent],
  options?: TrackOptions
) => Promise<AnalyticsEvent>;

function canUseBrowser() {
  return typeof window !== "undefined";
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStorage(providedStorage?: Storage) {
  if (providedStorage) {
    return providedStorage;
  }

  if (!canUseBrowser()) {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function detectDeviceType(userAgent?: string | null): DeviceType {
  const normalized = (userAgent ?? "").toLowerCase();

  if (!normalized) {
    return "unknown";
  }

  if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/.test(normalized)) {
    return "tablet";
  }

  if (
    /(iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|mobile)/.test(
      normalized
    )
  ) {
    return "mobile";
  }

  return "desktop";
}

function readStoredNumber(storage: Storage | null, key: string) {
  if (!storage) {
    return null;
  }

  const value = storage.getItem(key);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getOrCreateVisitorId(storage: Storage | null) {
  const existing = storage?.getItem(STORAGE_KEYS.visitorId);
  if (existing) {
    return existing;
  }

  const nextId = generateId();
  storage?.setItem(STORAGE_KEYS.visitorId, nextId);
  return nextId;
}

function getOrCreateSession(storage: Storage | null, nowMs: number, sessionTimeoutMs: number) {
  const sessionId = storage?.getItem(STORAGE_KEYS.sessionId);
  const lastSeen = readStoredNumber(storage, STORAGE_KEYS.sessionLastSeen);
  const hasExpired = !lastSeen || nowMs - lastSeen > sessionTimeoutMs;

  if (sessionId && !hasExpired) {
    storage?.setItem(STORAGE_KEYS.sessionLastSeen, String(nowMs));
    return {
      sessionId,
      isNewSession: false
    };
  }

  const nextSessionId = generateId();
  storage?.setItem(STORAGE_KEYS.sessionId, nextSessionId);
  storage?.setItem(STORAGE_KEYS.sessionLastSeen, String(nowMs));

  return {
    sessionId: nextSessionId,
    isNewSession: true
  };
}

function resolvePath(providedLocation?: Location) {
  if (providedLocation) {
    return `${providedLocation.pathname}${providedLocation.search}${providedLocation.hash}`;
  }

  if (!canUseBrowser()) {
    return "/";
  }

  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
}

function resolveNavigator(providedNavigator?: Navigator) {
  if (providedNavigator) {
    return providedNavigator;
  }

  if (!canUseBrowser()) {
    return undefined;
  }

  return window.navigator;
}

function createContext(options: CreateTrackerOptions = {}): AnalyticsContext {
  const nowMs = (options.now?.() ?? new Date()).getTime();
  const storage = getStorage(options.storage);
  const visitorId = getOrCreateVisitorId(storage);
  const session = getOrCreateSession(
    storage,
    nowMs,
    options.sessionTimeoutMs ?? SESSION_TIMEOUT_MS
  );
  const navigatorRef = resolveNavigator(options.navigator);
  const userAgent = options.userAgent ?? navigatorRef?.userAgent ?? null;

  return {
    sessionId: session.sessionId,
    visitorId,
    path: resolvePath(options.location),
    source: ANALYTICS_SOURCE,
    deviceType: detectDeviceType(userAgent),
    referrer: options.referrer ?? (typeof document !== "undefined" ? document.referrer || null : null),
    userAgent,
    isNewSession: session.isNewSession
  };
}

async function dispatchEvent(
  endpoint: string,
  event: AnalyticsEvent,
  navigatorRef?: Navigator
) {
  const payload = JSON.stringify(event);

  if (navigatorRef?.sendBeacon && typeof Blob !== "undefined") {
    const beaconPayload = new Blob([payload], {
      type: "application/json"
    });
    const delivered = navigatorRef.sendBeacon(endpoint, beaconPayload);

    if (delivered) {
      return;
    }
  }

  await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: payload,
    keepalive: true
  });
}

export function createAnalyticsTracker(options: CreateTrackerOptions = {}) {
  const endpoint = options.endpoint ?? "/api/track";
  const navigatorRef = resolveNavigator(options.navigator);

  const createEvent = <TEvent extends AnalyticsEventName>(
    event: TEvent,
    metadata?: AnalyticsEventMetadataMap[TEvent]
  ): AnalyticsEvent => {
    const context = createContext(options);

    return {
      event,
      sessionId: context.sessionId,
      visitorId: context.visitorId,
      timestamp: (options.now?.() ?? new Date()).toISOString(),
      path: context.path,
      source: context.source,
      deviceType: context.deviceType,
      referrer: context.referrer,
      userAgent: context.userAgent,
      metadata: metadata ?? {}
    };
  };

  const track: TrackFn = async (event, metadata, trackOptions) => {
    const payload = createEvent(event, metadata);

    if (trackOptions?.dispatch === false) {
      return payload;
    }

    try {
      await dispatchEvent(endpoint, payload, navigatorRef);
    } catch (error) {
      options.onError?.(error);
    }

    return payload;
  };

  const getContext = () => createContext(options);

  const ensureSessionStarted = async () => {
    const context = getContext();

    if (!context.isNewSession) {
      return null;
    }

    return track("session_started", {});
  };

  return {
    track,
    createEvent,
    getContext,
    ensureSessionStarted
  };
}

export const analyticsTracker = createAnalyticsTracker({
  onError(error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Analytics dispatch failed", error);
    }
  }
});

export const track = analyticsTracker.track;
