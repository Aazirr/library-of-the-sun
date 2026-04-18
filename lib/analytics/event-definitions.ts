import { DeviceType } from "@/lib/analytics/types";

export const SECTION_VALUES = [
  "projects",
  "skills",
  "experience",
  "certifications",
  "about"
] as const;

export type SectionValue = (typeof SECTION_VALUES)[number];

export type AnalyticsEventMetadataMap = {
  session_started: Record<string, never>;
  graph_interaction_started: {
    interactionType: string;
  };
  search_opened: Record<string, never>;
  search_result_selected: {
    query: string;
    resultId: string;
    resultType?: string;
  };
  section_opened: {
    section: SectionValue;
  };
  project_opened: {
    projectId: string;
    title: string;
  };
  skill_group_opened: {
    groupId: string;
    title: string;
  };
  experience_opened: {
    experienceId: string;
    title: string;
  };
  certification_opened: {
    certificationId: string;
    title: string;
  };
  about_opened: Record<string, never>;
  hire_me_opened: Record<string, never>;
  resume_clicked: {
    location: string;
  };
  linkedin_clicked: {
    location: string;
  };
  github_profile_clicked: {
    location: string;
  };
  email_clicked: {
    location: string;
  };
  project_live_demo_clicked: {
    projectId: string;
    title: string;
  };
  project_github_clicked: {
    projectId: string;
    title: string;
  };
  background_preset_changed: {
    preset: string;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMetadataMap;

export const ANALYTICS_SOURCE = "portfolio" as const;

export const STORAGE_KEYS = {
  visitorId: "ascension.analytics.visitor_id",
  sessionId: "ascension.analytics.session_id",
  sessionLastSeen: "ascension.analytics.session_last_seen"
} as const;

export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export type AnalyticsContext = {
  sessionId: string;
  visitorId: string;
  path: string;
  source: typeof ANALYTICS_SOURCE;
  deviceType: DeviceType;
  referrer: string | null;
  userAgent: string | null;
  isNewSession: boolean;
};
