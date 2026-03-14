import { NextResponse } from "next/server";

import {
  getDashboardStats,
  listCategories,
  listInstalledSkills,
  listSkills,
} from "@/lib/repository";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    data: {
      stats: getDashboardStats(),
      categories: listCategories(),
      installedSkills: listInstalledSkills(),
      featuredSkills: listSkills().slice(0, 6),
    },
  });
}
