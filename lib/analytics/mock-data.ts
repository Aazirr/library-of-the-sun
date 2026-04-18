import { AnalyticsEvent, DashboardSnapshot } from "@/lib/analytics/types";

const liveFeed: AnalyticsEvent[] = [
  {
    event: "project_opened",
    sessionId: "3db73519-2786-4550-96c1-6a0c7a67f64d",
    visitorId: "5ce78ca6-9f20-4b18-a1d9-d644baf7f852",
    timestamp: "2026-04-18T01:18:00.000Z",
    path: "/",
    source: "portfolio",
    deviceType: "desktop",
    referrer: "https://www.linkedin.com/",
    metadata: {
      projectId: "daarkin",
      title: "Daarkin"
    }
  },
  {
    event: "resume_clicked",
    sessionId: "2b3d0167-9abf-40d7-a930-d64f1557a6d0",
    visitorId: "27b97b28-6538-4bfe-a401-9666f9bdcbba",
    timestamp: "2026-04-18T01:15:00.000Z",
    path: "/",
    source: "portfolio",
    deviceType: "mobile",
    referrer: "https://github.com/",
    metadata: {
      location: "hire-me-modal"
    }
  },
  {
    event: "section_opened",
    sessionId: "3dc8c987-7e0d-4fc7-b030-24deded30f42",
    visitorId: "5d75c14c-1d58-41aa-b72d-ec8f9ff91a0b",
    timestamp: "2026-04-18T01:09:00.000Z",
    path: "/",
    source: "portfolio",
    deviceType: "desktop",
    referrer: "https://www.google.com/",
    metadata: {
      section: "projects"
    }
  },
  {
    event: "hire_me_opened",
    sessionId: "22a1f88b-9c38-4ef4-bf9a-b534707d4f09",
    visitorId: "f3af49df-a51b-4df7-beb4-34c4166a79fd",
    timestamp: "2026-04-18T00:57:00.000Z",
    path: "/",
    source: "portfolio",
    deviceType: "tablet",
    referrer: "https://www.facebook.com/",
    metadata: {}
  }
];

export const dashboardSnapshot: DashboardSnapshot = {
  generatedAt: "2026-04-18T01:20:00.000Z",
  audience: {
    totalVisitors: 284,
    engagedVisitors: 211,
    interactionRate: 74.3,
    averageSessionMinutes: 4.8
  },
  cta: [
    { label: "Hire Me opened", value: 96, delta: "+14%" },
    { label: "Resume clicked", value: 54, delta: "+10%" },
    { label: "LinkedIn clicked", value: 31, delta: "+5%" },
    { label: "GitHub profile clicked", value: 28, delta: "+12%" }
  ],
  sections: [
    { label: "Projects", value: 138, delta: "+22%" },
    { label: "Skills", value: 84, delta: "+9%" },
    { label: "About", value: 49, delta: "+4%" },
    { label: "Experience", value: 41, delta: "+7%" },
    { label: "Certifications", value: 27, delta: "-3%" }
  ],
  projects: [
    { label: "Daarkin", value: 62, delta: "+18%" },
    { label: "VGC Puzzle Trainer", value: 43, delta: "+8%" },
    { label: "DripMon - Discord", value: 32, delta: "+6%" },
    { label: "Glenda Residences", value: 25, delta: "+2%" }
  ],
  referrers: [
    { label: "LinkedIn", value: 109 },
    { label: "GitHub", value: 63 },
    { label: "Google", value: 51 },
    { label: "Direct", value: 34 }
  ],
  devices: [
    { label: "Desktop", value: 171 },
    { label: "Mobile", value: 89 },
    { label: "Tablet", value: 19 },
    { label: "Unknown", value: 5 }
  ],
  timeline: [
    { label: "Mon", value: 32 },
    { label: "Tue", value: 45 },
    { label: "Wed", value: 39 },
    { label: "Thu", value: 58 },
    { label: "Fri", value: 71 },
    { label: "Sat", value: 64 },
    { label: "Sun", value: 82 }
  ],
  liveFeed
};
