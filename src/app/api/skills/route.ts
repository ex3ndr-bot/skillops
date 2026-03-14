import { NextRequest, NextResponse } from "next/server";

import { createSkill, listSkills } from "@/lib/repository";
import { createSkillSchema } from "@/lib/validators";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const securityStatus = searchParams.get("securityStatus") as
    | "approved"
    | "review"
    | "blocked"
    | null;

  const skills = listSkills({
    search,
    category,
    securityStatus: securityStatus ?? undefined,
  });

  return NextResponse.json({ data: skills });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = createSkillSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid skill payload.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const skill = createSkill(parsed.data);
    return NextResponse.json({ data: skill }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create skill." },
      { status: 400 },
    );
  }
}
