export type SkillCategory =
  | "coding"
  | "research"
  | "communication"
  | "data-analysis"
  | "automation";

export type SkillPermission =
  | "filesystem.read"
  | "filesystem.write"
  | "network.access"
  | "network.outbound"
  | "shell.exec"
  | "secrets.read"
  | "browser.automation"
  | "repository.write";

export type SkillStatus = "published" | "draft" | "deprecated";

export type Skill = {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: SkillCategory;
  permissions: SkillPermission[];
  dependencies: string[];
  securityScore: number;
  downloads: number;
  status: SkillStatus;
  createdAt: string;
  updatedAt: string;
};

export type SkillVersion = {
  version: string;
  releasedAt: string;
  summary: string;
};

export type ActivityItem = {
  id: string;
  type: "publish" | "scan" | "install" | "deprecate";
  skillId: string;
  title: string;
  detail: string;
  timestamp: string;
};

export type SecuritySeverity = "low" | "medium" | "high";

export type SecurityFinding = {
  id: string;
  title: string;
  severity: SecuritySeverity;
  description: string;
};

export type SecurityScanResult = {
  score: number;
  findings: SecurityFinding[];
};

export type SkillDetail = {
  skill: Skill;
  versionHistory: SkillVersion[];
  changelog: string[];
  sourceSnippet: string;
};

export type DashboardStats = {
  totalSkills: number;
  securityAlerts: number;
  totalDownloads: number;
  publishedSkills: number;
};
