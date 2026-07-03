import { NextResponse } from "next/server";
import { describePlaylistMoodServer } from "@/lib/anthropic-server";
import type { Playlist } from "@/types";

export async function POST(request: Request) {
  try {
    const { playlist } = (await request.json()) as { playlist: Playlist };
    const moodTag = await describePlaylistMoodServer(playlist);
    return NextResponse.json({ moodTag });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to describe mood";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
