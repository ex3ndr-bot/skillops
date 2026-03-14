import { NextResponse } from "next/server";

import { getSkillBySlug, listSkillVersions } from "@/lib/repository";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      ...skill,
      versions: listSkillVersions(skill.id),
    },
  });
}
