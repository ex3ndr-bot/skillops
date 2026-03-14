import { NextResponse } from "next/server";

import { installSkill } from "@/lib/repository";
import { installSkillSchema } from "@/lib/validators";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const payload = await request.json().catch(() => ({}));
  const parsed = installSkillSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid install payload.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const installedSkill = installSkill(slug, parsed.data.version);

    if (!installedSkill) {
      return NextResponse.json({ error: "Skill not found." }, { status: 404 });
    }

    return NextResponse.json({ data: installedSkill }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to install skill." },
      { status: 400 },
    );
  }
}
