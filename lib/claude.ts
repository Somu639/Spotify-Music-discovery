import type { Playlist, ShuffleRecommendation, Track } from "@/types";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function postApi<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function explainTrend(
  track: Track,
  trendScore: number
): Promise<string> {
  const { explanation } = await postApi<{ explanation: string }>(
    "/api/claude/trend",
    { track, trendScore }
  );
  return explanation;
}

export async function generateShuffleBridge(
  currentPlaylist: Playlist,
  targetPlaylist: Playlist,
  lastTrack: Track
): Promise<ShuffleRecommendation> {
  const { bridgeTrackId, reason } = await postApi<{
    bridgeTrackId: string;
    reason: string;
  }>("/api/claude/shuffle", {
    currentPlaylist,
    targetPlaylist,
    lastTrack,
  });

  const bridgeTrack =
    targetPlaylist.tracks.find((t) => t.id === bridgeTrackId) ??
    targetPlaylist.tracks[0];

  return {
    fromPlaylist: currentPlaylist.name,
    toPlaylist: targetPlaylist.name,
    bridgeTrack,
    reason,
  };
}

export async function detectRepetitionAndSuggest(
  playlist: Playlist,
  playHistory: string[]
): Promise<string> {
  const { suggestion } = await postApi<{ suggestion: string }>(
    "/api/claude/detect-repetition",
    { playlist, playHistory }
  );
  return suggestion;
}

export async function describePlaylistMood(
  playlist: Playlist
): Promise<string> {
  const { moodTag } = await postApi<{ moodTag: string }>(
    "/api/claude/playlist-mood",
    { playlist }
  );
  return moodTag;
}
