import { NextResponse } from "next/server";
import { detectRepetitionAndSuggestServer } from "@/lib/anthropic-server";
import type { Playlist } from "@/types";

export async function POST(request: Request) {
  try {
    const { playlist, playHistory } = (await request.json()) as {
      playlist: Playlist;
      playHistory: string[];
    };

    const suggestion = await detectRepetitionAndSuggestServer(
      playlist,
      playHistory
    );
    return NextResponse.json({ suggestion });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to detect repetition";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
