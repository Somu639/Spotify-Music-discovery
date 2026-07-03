import { NextResponse } from "next/server";
import { generateShuffleBridgeServer } from "@/lib/anthropic-server";
import type { Playlist, Track } from "@/types";

export async function POST(request: Request) {
  try {
    const { currentPlaylist, targetPlaylist, lastTrack } =
      (await request.json()) as {
        currentPlaylist: Playlist;
        targetPlaylist: Playlist;
        lastTrack: Track;
      };

    const { bridgeTrackId, reason } = await generateShuffleBridgeServer(
      currentPlaylist,
      targetPlaylist,
      lastTrack
    );

    return NextResponse.json({ bridgeTrackId, reason });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate bridge";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
