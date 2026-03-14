import { getCategoryBreakdown, getDashboardStats, skillDetails } from "@/lib/data";
import { SecurityScanner } from "@/lib/security";
import { Skill, SkillDetail } from "@/lib/types";

type SecurityStatus = "approved" | "review" | "blocked";

type SkillQueryFilters = {
  search?: string;
  category?: string;
  securityStatus?: SecurityStatus;
};

type SkillCreateInput = {
  slug: string;
  name: string;
  author: string;
  description: string;
  category: Skill["category"];
  permissions: Skill["permissions"];
  dependencies: string[];
  downloadsCount?: number;
  initialVersion: string;
  releasedAt?: string;
  releaseNotes: string;
};

type SkillVersionCreateInput = {
  version: string;
  releasedAt?: string;
  releaseNotes: string;
};

type InstalledSkillRecord = {
  id: string;
  environment: string;
  installedVersion: string;
  installStatus: "healthy" | "warning" | "blocked";
  installedAt: string;
  skill: Skill;
};

const registryStore: SkillDetail[] = skillDetails.map((detail) => ({
  ...detail,
  skill: { ...detail.skill },
  versionHistory: [...detail.versionHistory],
  changelog: [...detail.changelog],
}));

const installedStore: InstalledSkillRecord[] = registryStore.slice(0, 4).map((detail, index) => ({
  id: `install-${detail.skill.id}`,
  environment: index % 2 === 0 ? "production" : "staging",
  installedVersion: detail.skill.version,
  installStatus: getInstallStatus(detail.skill.securityScore),
  installedAt: new Date(Date.parse(detail.skill.updatedAt) + 86_400_000).toISOString(),
  skill: detail.skill,
}));

function getSecurityStatus(score: number): SecurityStatus {
  if (score >= 85) {
    return "approved";
  }

  if (score >= 70) {
    return "review";
  }

  return "blocked";
}

function getInstallStatus(score: number): InstalledSkillRecord["installStatus"] {
  const status = getSecurityStatus(score);
  if (status === "approved") {
    return "healthy";
  }

  if (status === "review") {
    return "warning";
  }

  return "blocked";
}

function matchesSearch(skill: Skill, query: string) {
  return [skill.name, skill.author, skill.description, skill.dependencies.join(" ")]
    .join(" ")
    .toLowerCase()
    .includes(query.toLowerCase());
}

function getSkillDetail(slug: string) {
  return registryStore.find((detail) => detail.skill.id === slug) ?? null;
}

export function listSkills(filters: SkillQueryFilters = {}) {
  return registryStore
    .map((detail) => detail.skill)
    .filter((skill) => {
      if (filters.search && !matchesSearch(skill, filters.search)) {
        return false;
      }

      if (filters.category && filters.category !== "all" && skill.category !== filters.category) {
        return false;
      }

      if (
        filters.securityStatus &&
        getSecurityStatus(skill.securityScore) !== filters.securityStatus
      ) {
        return false;
      }

      return true;
    });
}

export function getSkillBySlug(slug: string) {
  return getSkillDetail(slug)?.skill ?? null;
}

export function listSkillVersions(skillId: string) {
  return getSkillDetail(skillId)?.versionHistory ?? [];
}

export function listInstalledSkills() {
  return installedStore;
}

export function listCategories() {
  return getCategoryBreakdown().map((item) => item.category);
}

export function createSkill(input: SkillCreateInput) {
  if (getSkillBySlug(input.slug)) {
    throw new Error("Skill already exists.");
  }

  const timestamp = input.releasedAt ?? new Date().toISOString();
  const provisionalSkill: Skill = {
    id: input.slug,
    name: input.name,
    version: input.initialVersion,
    author: input.author,
    description: input.description,
    category: input.category,
    permissions: input.permissions,
    dependencies: input.dependencies,
    securityScore: 0,
    downloads: input.downloadsCount ?? 0,
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const scan = SecurityScanner.scan(provisionalSkill, input.releaseNotes);
  const detail: SkillDetail = {
    skill: {
      ...provisionalSkill,
      securityScore: scan.score,
    },
    versionHistory: [
      {
        version: input.initialVersion,
        releasedAt: timestamp,
        summary: input.releaseNotes,
      },
    ],
    changelog: [input.releaseNotes],
    sourceSnippet: input.releaseNotes,
  };

  registryStore.unshift(detail);
  return detail.skill;
}

export function addSkillVersion(slug: string, input: SkillVersionCreateInput) {
  const detail = getSkillDetail(slug);

  if (!detail) {
    return null;
  }

  const releasedAt = input.releasedAt ?? new Date().toISOString();

  detail.versionHistory.unshift({
    version: input.version,
    releasedAt,
    summary: input.releaseNotes,
  });
  detail.changelog.unshift(input.releaseNotes);
  detail.skill.version = input.version;
  detail.skill.updatedAt = releasedAt;
  detail.sourceSnippet = `${detail.sourceSnippet}\n${input.releaseNotes}`;
  detail.skill.securityScore = SecurityScanner.scan(detail.skill, detail.sourceSnippet).score;

  return detail.skill;
}

export function installSkill(slug: string, version?: string) {
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return null;
  }

  const existing = installedStore.find((record) => record.skill.id === slug);

  if (existing) {
    existing.installedVersion = version ?? skill.version;
    existing.installStatus = getInstallStatus(skill.securityScore);
    existing.installedAt = new Date().toISOString();
    return existing;
  }

  const installed: InstalledSkillRecord = {
    id: `install-${slug}`,
    environment: "production",
    installedVersion: version ?? skill.version,
    installStatus: getInstallStatus(skill.securityScore),
    installedAt: new Date().toISOString(),
    skill,
  };

  installedStore.unshift(installed);
  return installed;
}

export function getInstalledSkillBySlug(slug: string) {
  return installedStore.find((record) => record.skill.id === slug) ?? null;
}

export { getDashboardStats };
