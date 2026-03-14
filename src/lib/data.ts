import { SecurityScanner } from "@/lib/security";
import {
  ActivityItem,
  DashboardStats,
  Skill,
  SkillCategory,
  SkillDetail,
  SkillVersion,
} from "@/lib/types";

type SeedSkill = Omit<Skill, "securityScore"> & {
  versionHistory: SkillVersion[];
  sourceSnippet: string;
  changelog: string[];
};

const seedSkills: SeedSkill[] = [
  {
    id: "code-review-commander",
    name: "Code Review Commander",
    version: "2.4.1",
    author: "OpenLedger Engineering",
    description:
      "Automates pull request triage, flags regression risks, and drafts review summaries for platform teams.",
    category: "coding",
    permissions: ["filesystem.read", "repository.write"],
    dependencies: ["policy-linter", "diff-summarizer", "ownership-graph"],
    downloads: 18720,
    status: "published",
    createdAt: "2025-08-12T09:00:00.000Z",
    updatedAt: "2026-03-08T11:10:00.000Z",
    versionHistory: [
      {
        version: "2.4.1",
        releasedAt: "2026-03-08T11:10:00.000Z",
        summary: "Reduced noisy review comments and improved change-risk clustering.",
      },
      {
        version: "2.3.0",
        releasedAt: "2026-01-21T10:30:00.000Z",
        summary: "Added repository policy packs for SOX-sensitive services.",
      },
      {
        version: "2.0.0",
        releasedAt: "2025-11-03T08:20:00.000Z",
        summary: "Shipped multi-repo review orchestration for large programs.",
      },
    ],
    changelog: [
      "Expanded reviewer suggestions with ownership and blast-radius context.",
      "Added release gating checks for protected code paths.",
      "Improved summarization quality for long infrastructure diffs.",
    ],
    sourceSnippet: `
      import { summarizeDiffs } from "diff-summarizer";
      export async function reviewPullRequest(diff) {
        return summarizeDiffs(diff);
      }
    `,
  },
  {
    id: "pair-programmer-pro",
    name: "Pair Programmer Pro",
    version: "1.9.0",
    author: "Helix Software",
    description:
      "Generates implementation plans, test scaffolding, and refactor suggestions for application teams.",
    category: "coding",
    permissions: ["filesystem.read", "filesystem.write"],
    dependencies: ["spec-index", "test-factory"],
    downloads: 14390,
    status: "published",
    createdAt: "2025-09-18T13:15:00.000Z",
    updatedAt: "2026-03-06T14:40:00.000Z",
    versionHistory: [
      {
        version: "1.9.0",
        releasedAt: "2026-03-06T14:40:00.000Z",
        summary: "Added stack-aware implementation templates and safer patch previews.",
      },
      {
        version: "1.7.2",
        releasedAt: "2026-02-02T09:45:00.000Z",
        summary: "Improved unit test generation for async APIs and hooks.",
      },
    ],
    changelog: [
      "Introduced architecture note generation before code edits.",
      "Added write-scope prompts for shared modules.",
      "Tuned test fixture generation to reduce brittle mocks.",
    ],
    sourceSnippet: `
      export function draftImplementationPlan(ticket, context) {
        return { ticket, context, tasks: ["analyze", "edit", "test"] };
      }
    `,
  },
  {
    id: "threat-model-analyst",
    name: "Threat Model Analyst",
    version: "3.1.2",
    author: "Northbridge Security",
    description:
      "Reviews architecture proposals, maps trust boundaries, and surfaces likely abuse paths for product launches.",
    category: "research",
    permissions: ["filesystem.read"],
    dependencies: ["asset-catalog", "risk-taxonomy"],
    downloads: 9620,
    status: "published",
    createdAt: "2025-07-02T07:30:00.000Z",
    updatedAt: "2026-03-10T16:00:00.000Z",
    versionHistory: [
      {
        version: "3.1.2",
        releasedAt: "2026-03-10T16:00:00.000Z",
        summary: "Expanded SaaS integration patterns and compliance-oriented output formats.",
      },
      {
        version: "3.0.0",
        releasedAt: "2025-12-19T12:00:00.000Z",
        summary: "Introduced multi-service dependency tracing for platform reviews.",
      },
    ],
    changelog: [
      "Added template packs for regulated workloads.",
      "Improved modeling of privileged workflow abuse paths.",
      "Refined recommended controls for internal admin surfaces.",
    ],
    sourceSnippet: `
      export function assessArchitecture(diagram) {
        return diagram.trustBoundaries.map((boundary) => boundary.name);
      }
    `,
  },
  {
    id: "market-intelligence-radar",
    name: "Market Intelligence Radar",
    version: "2.7.0",
    author: "Summit Strategy",
    description:
      "Synthesizes competitor launches, analyst notes, and market signals into weekly briefings for leadership.",
    category: "research",
    permissions: ["network.access"],
    dependencies: ["briefing-template", "source-monitor"],
    downloads: 11840,
    status: "published",
    createdAt: "2025-06-22T10:00:00.000Z",
    updatedAt: "2026-03-11T09:20:00.000Z",
    versionHistory: [
      {
        version: "2.7.0",
        releasedAt: "2026-03-11T09:20:00.000Z",
        summary: "Added citation quality checks and executive summary calibration.",
      },
      {
        version: "2.4.3",
        releasedAt: "2026-01-12T11:10:00.000Z",
        summary: "Expanded tracked market sources and regional segmentation.",
      },
    ],
    changelog: [
      "Improved source freshness handling for volatile sectors.",
      "Added market movement confidence scoring.",
      "Expanded output format options for board updates.",
    ],
    sourceSnippet: `
      export async function collectSignals(feeds) {
        const responses = await Promise.all(feeds.map((feed) => fetch(feed)));
        return responses.length;
      }
    `,
  },
  {
    id: "literature-scout",
    name: "Literature Scout",
    version: "1.6.5",
    author: "Aperture Research",
    description:
      "Searches scientific publications, summarizes findings, and groups evidence by confidence level for R&D teams.",
    category: "research",
    permissions: ["network.access"],
    dependencies: ["citation-ranker", "evidence-mapper"],
    downloads: 8740,
    status: "published",
    createdAt: "2025-10-01T08:40:00.000Z",
    updatedAt: "2026-03-04T07:55:00.000Z",
    versionHistory: [
      {
        version: "1.6.5",
        releasedAt: "2026-03-04T07:55:00.000Z",
        summary: "Improved abstract clustering and confidence labeling for small samples.",
      },
      {
        version: "1.5.0",
        releasedAt: "2025-12-05T14:25:00.000Z",
        summary: "Added evidence heatmaps and exportable literature packets.",
      },
    ],
    changelog: [
      "Improved duplicate paper detection across mirrors.",
      "Added study-design metadata extraction.",
      "Tuned confidence scoring for contradictory papers.",
    ],
    sourceSnippet: `
      export async function searchLibraries(query) {
        const response = await fetch("https://api.example.org/search?q=" + query);
        return response.json();
      }
    `,
  },
  {
    id: "executive-brief-writer",
    name: "Executive Brief Writer",
    version: "2.2.4",
    author: "Clearline Communications",
    description:
      "Transforms project updates into concise executive briefings with decisions, risks, and next steps.",
    category: "communication",
    permissions: ["filesystem.read"],
    dependencies: ["tone-guide", "brief-template"],
    downloads: 15640,
    status: "published",
    createdAt: "2025-05-15T09:25:00.000Z",
    updatedAt: "2026-03-07T12:50:00.000Z",
    versionHistory: [
      {
        version: "2.2.4",
        releasedAt: "2026-03-07T12:50:00.000Z",
        summary: "Improved decision framing and cross-functional summary quality.",
      },
      {
        version: "2.1.0",
        releasedAt: "2026-01-17T11:45:00.000Z",
        summary: "Added audience-specific briefing styles for board and staff meetings.",
      },
    ],
    changelog: [
      "Sharper executive summaries for complex technical programs.",
      "Added optional risk register appendix.",
      "Improved terminology normalization across business units.",
    ],
    sourceSnippet: `
      export function buildBriefing(update) {
        return update.highlights.join("\\n");
      }
    `,
  },
  {
    id: "customer-response-studio",
    name: "Customer Response Studio",
    version: "1.8.3",
    author: "Vertex Success",
    description:
      "Drafts account-specific customer replies, escalations, and renewal follow-ups with tone controls.",
    category: "communication",
    permissions: ["filesystem.read", "secrets.read"],
    dependencies: ["crm-context", "tone-guide", "approval-routing"],
    downloads: 13270,
    status: "published",
    createdAt: "2025-07-28T08:00:00.000Z",
    updatedAt: "2026-03-05T15:30:00.000Z",
    versionHistory: [
      {
        version: "1.8.3",
        releasedAt: "2026-03-05T15:30:00.000Z",
        summary: "Added compliance-aware escalation handling and approval templates.",
      },
      {
        version: "1.6.0",
        releasedAt: "2025-12-11T10:35:00.000Z",
        summary: "Introduced persona-aware response tuning for enterprise accounts.",
      },
    ],
    changelog: [
      "Improved handoff notes for support and success teams.",
      "Added policy-safe wording for customer concessions.",
      "Expanded translation support for common account regions.",
    ],
    sourceSnippet: `
      export function draftResponse(context, issue) {
        return context.accountName + ": " + issue.summary;
      }
    `,
  },
  {
    id: "meeting-moderator-ai",
    name: "Meeting Moderator AI",
    version: "1.3.1",
    author: "Pulse Workplace",
    description:
      "Prepares agendas, captures decisions, and drafts action items for recurring staff and leadership meetings.",
    category: "communication",
    permissions: ["filesystem.read", "network.access"],
    dependencies: ["calendar-sync", "agenda-template"],
    downloads: 10110,
    status: "draft",
    createdAt: "2025-12-20T11:00:00.000Z",
    updatedAt: "2026-03-09T10:05:00.000Z",
    versionHistory: [
      {
        version: "1.3.1",
        releasedAt: "2026-03-09T10:05:00.000Z",
        summary: "Pilot release with moderated discussion prompts and decision logging.",
      },
      {
        version: "1.1.0",
        releasedAt: "2026-01-26T16:10:00.000Z",
        summary: "Added stakeholder-specific agenda generation and recap formatting.",
      },
    ],
    changelog: [
      "Added meeting health scoring for follow-up rigor.",
      "Improved extraction of explicit owners and due dates.",
      "Introduced pre-read summary mode for executives.",
    ],
    sourceSnippet: `
      export async function syncCalendar(apiUrl) {
        return fetch(apiUrl);
      }
    `,
  },
  {
    id: "forecast-forge",
    name: "Forecast Forge",
    version: "4.0.0",
    author: "BluePeak Analytics",
    description:
      "Builds pipeline, revenue, and capacity forecasts with scenario comparisons for finance and operations leaders.",
    category: "data-analysis",
    permissions: ["filesystem.read", "filesystem.write"],
    dependencies: ["metric-warehouse", "scenario-engine", "board-exporter"],
    downloads: 16720,
    status: "published",
    createdAt: "2025-04-29T07:50:00.000Z",
    updatedAt: "2026-03-12T13:10:00.000Z",
    versionHistory: [
      {
        version: "4.0.0",
        releasedAt: "2026-03-12T13:10:00.000Z",
        summary: "Launched scenario packs with board-ready output formatting.",
      },
      {
        version: "3.6.2",
        releasedAt: "2026-01-08T12:35:00.000Z",
        summary: "Improved anomaly handling for volatile quarterly pipelines.",
      },
    ],
    changelog: [
      "Added confidence intervals for low-volume business units.",
      "Improved write-back controls for approved forecasts.",
      "Expanded regional breakdown support for global teams.",
    ],
    sourceSnippet: `
      export function calculateForecast(rows) {
        return rows.reduce((sum, row) => sum + row.value, 0);
      }
    `,
  },
  {
    id: "anomaly-detective",
    name: "Anomaly Detective",
    version: "2.0.6",
    author: "Meridian Data",
    description:
      "Identifies outliers in business metrics, ranks likely root causes, and prepares analyst handoff notes.",
    category: "data-analysis",
    permissions: ["filesystem.read"],
    dependencies: ["metric-warehouse", "incident-taxonomy"],
    downloads: 12480,
    status: "published",
    createdAt: "2025-06-10T10:20:00.000Z",
    updatedAt: "2026-03-03T08:35:00.000Z",
    versionHistory: [
      {
        version: "2.0.6",
        releasedAt: "2026-03-03T08:35:00.000Z",
        summary: "Reduced false positives on seasonal patterns and sparse datasets.",
      },
      {
        version: "1.9.0",
        releasedAt: "2025-12-28T09:15:00.000Z",
        summary: "Added narrative summaries for incident review handoffs.",
      },
    ],
    changelog: [
      "Improved anomaly windows for product launch traffic spikes.",
      "Added root-cause hints tied to deployment and pricing events.",
      "Expanded analyst notes for handoff documentation.",
    ],
    sourceSnippet: `
      export function detectOutliers(series) {
        return series.filter((value) => value > 3);
      }
    `,
  },
  {
    id: "etl-pipeline-optimizer",
    name: "ETL Pipeline Optimizer",
    version: "0.9.7",
    author: "Orbit Data Systems",
    description:
      "Reviews transformation jobs, recommends performance fixes, and tunes warehouse ingestion schedules.",
    category: "data-analysis",
    permissions: ["filesystem.read", "shell.exec"],
    dependencies: ["warehouse-adapter", "job-profiler"],
    downloads: 5480,
    status: "draft",
    createdAt: "2025-11-09T13:40:00.000Z",
    updatedAt: "2026-03-01T09:05:00.000Z",
    versionHistory: [
      {
        version: "0.9.7",
        releasedAt: "2026-03-01T09:05:00.000Z",
        summary: "Pilot release with profiling hooks for warehouse maintenance windows.",
      },
      {
        version: "0.8.0",
        releasedAt: "2026-01-04T07:40:00.000Z",
        summary: "Added shell-based performance probes for ingestion bottlenecks.",
      },
    ],
    changelog: [
      "Added execution guardrails for profiling commands.",
      "Improved optimizer hints for partition-heavy tables.",
      "Introduced queue-aware scheduling recommendations.",
    ],
    sourceSnippet: `
      export function profileJob(command) {
        return exec(command);
      }
    `,
  },
  {
    id: "workflow-orchestrator",
    name: "Workflow Orchestrator",
    version: "3.4.2",
    author: "Atlas Automation",
    description:
      "Connects internal systems, routes approvals, and automates back-office workflows across business units.",
    category: "automation",
    permissions: ["filesystem.read", "network.access", "browser.automation"],
    dependencies: ["connector-hub", "policy-engine", "audit-log"],
    downloads: 19460,
    status: "published",
    createdAt: "2025-03-18T06:55:00.000Z",
    updatedAt: "2026-03-13T10:40:00.000Z",
    versionHistory: [
      {
        version: "3.4.2",
        releasedAt: "2026-03-13T10:40:00.000Z",
        summary: "Expanded workflow templates and improved audit event fidelity.",
      },
      {
        version: "3.2.0",
        releasedAt: "2026-01-29T14:50:00.000Z",
        summary: "Added browser-driven exception handling for legacy systems.",
      },
    ],
    changelog: [
      "Improved approval routing across shared service teams.",
      "Added stronger audit traces for automated actions.",
      "Expanded connector retries for flaky vendor systems.",
    ],
    sourceSnippet: `
      export async function runWorkflow(endpoint) {
        const response = await fetch(endpoint);
        return response.ok;
      }
    `,
  },
  {
    id: "invoice-reconciliation-bot",
    name: "Invoice Reconciliation Bot",
    version: "2.1.4",
    author: "Sterling Finance Ops",
    description:
      "Matches invoices to purchase orders, flags exceptions, and prepares review queues for AP teams.",
    category: "automation",
    permissions: ["filesystem.read", "filesystem.write", "secrets.read"],
    dependencies: ["erp-connector", "approval-routing"],
    downloads: 11120,
    status: "published",
    createdAt: "2025-08-03T09:10:00.000Z",
    updatedAt: "2026-03-06T08:25:00.000Z",
    versionHistory: [
      {
        version: "2.1.4",
        releasedAt: "2026-03-06T08:25:00.000Z",
        summary: "Added stronger exception labeling and reviewer packet generation.",
      },
      {
        version: "2.0.0",
        releasedAt: "2025-12-02T10:00:00.000Z",
        summary: "Improved reconciliation flows with controlled ERP write-back support.",
      },
    ],
    changelog: [
      "Reduced reviewer workload for duplicate invoice checks.",
      "Added confidence scores for exception routing.",
      "Improved audit trail exports for finance controls.",
    ],
    sourceSnippet: `
      export function reconcileInvoice(invoice, po) {
        return invoice.amount === po.amount;
      }
    `,
  },
  {
    id: "legacy-script-migrator",
    name: "Legacy Script Migrator",
    version: "0.8.9",
    author: "Harbor Platform",
    description:
      "Modernizes old admin scripts, replaces brittle commands, and generates upgrade plans for operations teams.",
    category: "automation",
    permissions: ["filesystem.read", "filesystem.write", "shell.exec"],
    dependencies: ["script-parser", "command-catalog"],
    downloads: 4210,
    status: "deprecated",
    createdAt: "2025-05-30T07:00:00.000Z",
    updatedAt: "2026-02-14T13:35:00.000Z",
    versionHistory: [
      {
        version: "0.8.9",
        releasedAt: "2026-02-14T13:35:00.000Z",
        summary: "Deprecated after unsafe execution paths were identified in migration previews.",
      },
      {
        version: "0.8.2",
        releasedAt: "2025-11-16T09:20:00.000Z",
        summary: "Added fallback transforms for older maintenance scripts.",
      },
    ],
    changelog: [
      "Deprecated pending remediation of unsafe execution helpers.",
      "Added clearer migration advisories for unsupported shells.",
      "Expanded detection for destructive command patterns.",
    ],
    sourceSnippet: `
      export function runLegacy(script) {
        eval(script);
        return exec(script);
      }
    `,
  },
  {
    id: "outreach-sequence-optimizer",
    name: "Outreach Sequence Optimizer",
    version: "1.4.0",
    author: "Northfield Growth",
    description:
      "Builds prospecting sequences, suggests message variants, and ranks outreach timing for revenue teams.",
    category: "communication",
    permissions: ["filesystem.read", "network.access"],
    dependencies: ["crm-context", "send-window-model"],
    downloads: 8890,
    status: "published",
    createdAt: "2025-09-05T06:45:00.000Z",
    updatedAt: "2026-03-02T15:15:00.000Z",
    versionHistory: [
      {
        version: "1.4.0",
        releasedAt: "2026-03-02T15:15:00.000Z",
        summary: "Added persona-level messaging variants and timing confidence scores.",
      },
      {
        version: "1.2.1",
        releasedAt: "2025-12-27T10:50:00.000Z",
        summary: "Improved sequence ranking with regional send-window adaptation.",
      },
    ],
    changelog: [
      "Added campaign pacing controls for global teams.",
      "Improved variant generation for regulated industries.",
      "Expanded scoring based on account engagement history.",
    ],
    sourceSnippet: `
      export async function loadProspectSignals(url) {
        const response = await fetch(url);
        return response.json();
      }
    `,
  },
  {
    id: "experiment-design-lab",
    name: "Experiment Design Lab",
    version: "2.5.3",
    author: "Signal Science",
    description:
      "Designs experiments, estimates sample sizes, and summarizes likely confounders for product analysts.",
    category: "research",
    permissions: ["filesystem.read"],
    dependencies: ["stats-toolkit", "hypothesis-catalog"],
    downloads: 7770,
    status: "published",
    createdAt: "2025-08-21T12:30:00.000Z",
    updatedAt: "2026-03-01T17:20:00.000Z",
    versionHistory: [
      {
        version: "2.5.3",
        releasedAt: "2026-03-01T17:20:00.000Z",
        summary: "Improved power calculations and confounder suggestions for product experiments.",
      },
      {
        version: "2.3.0",
        releasedAt: "2025-12-14T09:40:00.000Z",
        summary: "Added experiment review checklists for cross-functional launches.",
      },
    ],
    changelog: [
      "Added practical guidance for sequential testing tradeoffs.",
      "Improved terminology alignment for PM and analyst audiences.",
      "Expanded summaries for pre-launch review packets.",
    ],
    sourceSnippet: `
      export function estimateSampleSize(effect, variance) {
        return Math.ceil((variance * 16) / effect);
      }
    `,
  },
];

const normalizedSkills: SkillDetail[] = seedSkills.map((seed) => {
  const { versionHistory, sourceSnippet, changelog, ...skill } = seed;
  const scan = SecurityScanner.scan(skill, sourceSnippet);

  return {
    skill: {
      ...skill,
      securityScore: scan.score,
    },
    versionHistory,
    changelog,
    sourceSnippet,
  };
});

export const skillDetails = normalizedSkills;
export const sampleSkills: Skill[] = normalizedSkills.map((detail) => detail.skill);

export const skillCategories: Array<SkillCategory | "all"> = [
  "all",
  "coding",
  "research",
  "communication",
  "data-analysis",
  "automation",
];

export const recentActivity: ActivityItem[] = [
  {
    id: "activity-1",
    type: "publish",
    skillId: "workflow-orchestrator",
    title: "Workflow Orchestrator v3.4.2 published",
    detail: "Enterprise connector templates and audit traces rolled out to production tenants.",
    timestamp: "2026-03-13T10:40:00.000Z",
  },
  {
    id: "activity-2",
    type: "scan",
    skillId: "legacy-script-migrator",
    title: "Legacy Script Migrator flagged for unsafe execution",
    detail: "Static scan found `eval` and unscoped exec usage in migration helpers.",
    timestamp: "2026-03-12T18:05:00.000Z",
  },
  {
    id: "activity-3",
    type: "install",
    skillId: "forecast-forge",
    title: "Forecast Forge installed to finance workspace",
    detail: "Scenario planning pack enabled for Q2 board preparation.",
    timestamp: "2026-03-12T13:45:00.000Z",
  },
  {
    id: "activity-4",
    type: "scan",
    skillId: "etl-pipeline-optimizer",
    title: "ETL Pipeline Optimizer queued for manual review",
    detail: "Shell profiling hooks require platform team approval before rollout.",
    timestamp: "2026-03-11T09:30:00.000Z",
  },
  {
    id: "activity-5",
    type: "deprecate",
    skillId: "legacy-script-migrator",
    title: "Legacy Script Migrator deprecated",
    detail: "Deployment blocked pending remediation of unsafe command execution paths.",
    timestamp: "2026-02-14T13:35:00.000Z",
  },
];

export function getSkillById(id: string) {
  return skillDetails.find((detail) => detail.skill.id === id) ?? null;
}

export function getDashboardStats(): DashboardStats {
  return {
    totalSkills: sampleSkills.length,
    securityAlerts: sampleSkills.filter((skill) => skill.securityScore < 70).length,
    totalDownloads: sampleSkills.reduce((sum, skill) => sum + skill.downloads, 0),
    publishedSkills: sampleSkills.filter((skill) => skill.status === "published").length,
  };
}

export function getCategoryBreakdown() {
  return skillCategories
    .filter((category): category is SkillCategory => category !== "all")
    .map((category) => ({
      category,
      count: sampleSkills.filter((skill) => skill.category === category).length,
    }));
}

export function getSecuritySummary() {
  const bands = {
    low: sampleSkills.filter((skill) => skill.securityScore >= 85).length,
    medium: sampleSkills.filter((skill) => skill.securityScore >= 70 && skill.securityScore < 85).length,
    high: sampleSkills.filter((skill) => skill.securityScore < 70).length,
  };

  return {
    riskBands: bands,
    compliance: [
      { label: "Least privilege", value: "92%", status: "healthy" },
      { label: "Approved network access", value: "87%", status: "warning" },
      { label: "Runtime execution controls", value: "71%", status: "critical" },
    ],
  };
}
