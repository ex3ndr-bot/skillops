import { z } from "zod";

const skillPermissions = [
  "filesystem.read",
  "filesystem.write",
  "network.access",
  "network.outbound",
  "shell.exec",
  "secrets.read",
  "browser.automation",
  "repository.write",
] as const;

const skillCategories = [
  "coding",
  "research",
  "communication",
  "data-analysis",
  "automation",
] as const;

export const createSkillSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens only."),
  name: z.string().min(2),
  author: z.string().min(2),
  description: z.string().min(20),
  category: z.enum(skillCategories),
  dependencies: z.array(z.string()).default([]),
  permissions: z.array(z.enum(skillPermissions)).min(1),
  downloadsCount: z.number().int().nonnegative().optional(),
  initialVersion: z.string().min(1),
  releaseNotes: z.string().min(10),
  releasedAt: z.string().datetime().optional(),
});

export const addVersionSchema = z.object({
  version: z.string().min(1),
  releaseNotes: z.string().min(10),
  releasedAt: z.string().datetime().optional(),
});

export const installSkillSchema = z.object({
  version: z.string().min(1).optional(),
});
