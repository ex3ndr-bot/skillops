import { NextResponse } from "next/server";

import { addSkillVersion } from "@/lib/repository";
import { addVersionSchema } from "@/lib/validators";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const payload = await request.json();
  const parsed = addVersionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid version payload.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const skill = addSkillVersion(slug, parsed.data);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found." }, { status: 404 });
    }

    return NextResponse.json({ data: skill }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add version." },
      { status: 400 },
    );
  }
}
