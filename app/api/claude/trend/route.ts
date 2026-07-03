import { NextResponse } from "next/server";
import { explainTrendServer } from "@/lib/anthropic-server";
import type { Track } from "@/types";

export async function POST(request: Request) {
  try {
    const { track, trendScore } = (await request.json()) as {
      track: Track;
      trendScore: number;
    };

    const explanation = await explainTrendServer(track, trendScore);
    return NextResponse.json({ explanation });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to explain trend";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
