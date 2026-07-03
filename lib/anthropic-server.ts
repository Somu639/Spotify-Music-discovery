import type { Playlist, Track } from "@/types";
import { getAllPlaylists } from "@/lib/spotify-mock";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

interface AnthropicMessageResponse {
  content: Array<{ type: string; text?: string }>;
}

async function callClaude(
  userPrompt: string,
  systemPrompt?: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as AnthropicMessageResponse;
  const textBlock = data.content.find((block) => block.type === "text");

  if (!textBlock?.text) {
    throw new Error("No text content in Anthropic response");
  }

  return textBlock.text.trim();
}

function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : text.trim();
  return JSON.parse(raw) as T;
}

export function fallbackExplainTrend(track: Track, trendScore: number): string {
  return `Spiking with a trend score of ${trendScore} — listeners are gravitating to "${track.title}" for its ${track.tempo} BPM ${track.mood} energy during ${track.genre.toLowerCase()} sessions.`;
}

export function fallbackShuffleBridge(
  currentPlaylist: Playlist,
  targetPlaylist: Playlist,
  lastTrack: Track
): { bridgeTrackId: string; reason: string } {
  const bridgeTrack =
    targetPlaylist.tracks.reduce((best, candidate) =>
      Math.abs(candidate.energy - lastTrack.energy) <
      Math.abs(best.energy - lastTrack.energy)
        ? candidate
        : best
    ) ?? targetPlaylist.tracks[0];

  return {
    bridgeTrackId: bridgeTrack.id,
    reason: `"${bridgeTrack.title}" shares similar energy (${Math.round(bridgeTrack.energy * 100)}%) to "${lastTrack.title}", easing you from ${currentPlaylist.mood} into ${targetPlaylist.mood}.`,
  };
}

export function fallbackDetectRepetition(
  playlist: Playlist,
  playHistory: string[]
): string {
  const recent = playHistory.slice(-10);
  const counts = recent.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] ?? 0) + 1;
    return acc;
  }, {});

  const maxRepeats = Math.max(0, ...Object.values(counts));
  const stuckTrackId = Object.entries(counts).find(([, n]) => n === maxRepeats)?.[0];
  const stuckTrack = playlist.tracks.find((t) => t.id === stuckTrackId);

  if (maxRepeats <= 3) {
    return `Your listening on "${playlist.name}" looks healthy — no tight loops detected in your last ${recent.length} plays.`;
  }

  const alternative =
    getAllPlaylists().find(
      (p) => p.id !== playlist.id && p.mood === playlist.mood
    ) ?? getAllPlaylists().find((p) => p.id !== playlist.id);

  if (!alternative) {
    return `You may be stuck on "${stuckTrack?.title ?? "a few tracks"}" — try shuffling "${playlist.name}" to break the loop.`;
  }

  return `You're replaying "${stuckTrack?.title ?? "the same tracks"}" too often. Switch to "${alternative.name}" — same ${alternative.mood} mood, fresh tracklist for ${alternative.context}.`;
}

function fallbackPlaylistMood(playlist: Playlist): string {
  return [playlist.mood, playlist.context, "vibes"].slice(0, 3).join(" ");
}

export async function explainTrendServer(
  track: Track,
  trendScore: number
): Promise<string> {
  const prompt = `Given this track metadata and trend score, write exactly ONE sentence explaining WHY this track is trending right now. Be contextual and specific — reference tempo, mood, genre, or listening context. Do NOT be generic.

Track: "${track.title}" by ${track.artist}
Album: ${track.album}
Genre: ${track.genre}
Mood: ${track.mood}
Tempo: ${track.tempo} BPM
Energy: ${Math.round(track.energy * 100)}%
Recent plays: ${track.playCount}
Trend score: ${trendScore}

Example style: "Spiking 340% this week — listeners are gravitating to its 128 BPM energy for Monday morning commutes."

Respond with only the one sentence, no quotes or preamble.`;

  try {
    const result = await callClaude(
      prompt,
      "You are a music trend analyst. Write concise, contextual one-sentence explanations."
    );
    return result || fallbackExplainTrend(track, trendScore);
  } catch {
    return fallbackExplainTrend(track, trendScore);
  }
}

export async function generateShuffleBridgeServer(
  currentPlaylist: Playlist,
  targetPlaylist: Playlist,
  lastTrack: Track
): Promise<{ bridgeTrackId: string; reason: string }> {
  const targetCatalog = targetPlaylist.tracks
    .map(
      (t) =>
        `- id: "${t.id}" | "${t.title}" by ${t.artist} | mood: ${t.mood} | energy: ${Math.round(t.energy * 100)}% | tempo: ${t.tempo} BPM`
    )
    .join("\n");

  const prompt = `You are a DJ helping a user transition between playlists without jarring mood shifts.

Current playlist: "${currentPlaylist.name}" (mood: ${currentPlaylist.mood}, context: ${currentPlaylist.context})
Target playlist: "${targetPlaylist.name}" (mood: ${targetPlaylist.mood}, context: ${targetPlaylist.context})
Last track playing: "${lastTrack.title}" by ${lastTrack.artist} (mood: ${lastTrack.mood}, energy: ${Math.round(lastTrack.energy * 100)}%, tempo: ${lastTrack.tempo} BPM)

Target playlist tracks (pick bridgeTrack id from this list ONLY):
${targetCatalog}

Suggest which track from the target playlist should play FIRST as a "mood bridge" to avoid a jarring transition.

Respond with ONLY valid JSON, no markdown:
{"bridgeTrack":"<track id>","reason":"<one sentence why this track works as a transition>"}`;

  try {
    const raw = await callClaude(
      prompt,
      "You are a music transition expert. Return only valid JSON."
    );
    const parsed = extractJson<{ bridgeTrack: string; reason: string }>(raw);
    const valid = targetPlaylist.tracks.some((t) => t.id === parsed.bridgeTrack);

    if (!valid) {
      return fallbackShuffleBridge(currentPlaylist, targetPlaylist, lastTrack);
    }

    return { bridgeTrackId: parsed.bridgeTrack, reason: parsed.reason };
  } catch {
    return fallbackShuffleBridge(currentPlaylist, targetPlaylist, lastTrack);
  }
}

export async function detectRepetitionAndSuggestServer(
  playlist: Playlist,
  playHistory: string[]
): Promise<string> {
  const library = getAllPlaylists()
    .filter((p) => p.id !== playlist.id)
    .map(
      (p) =>
        `- "${p.name}" (id: ${p.id}, mood: ${p.mood}, context: ${p.context})`
    )
    .join("\n");

  const recent = playHistory.slice(-10);
  const playSummary = recent.length
    ? recent.join(", ")
    : "No recent play history available";

  const prompt = `Analyze if this Spotify user is stuck in a listening loop.

Current playlist: "${playlist.name}" (mood: ${playlist.mood}, context: ${playlist.context})
Last 10 track IDs played: ${playSummary}

Rule: If more than 3 of the same track IDs appear in the last 10 plays, the user is in a loop.

Other playlists in their library:
${library}

If a loop is detected, suggest ONE specific different playlist from their library with a reason tied to mood similarity. If no loop, reassure them briefly.

Respond in 1-2 sentences, conversational tone. No bullet points.`;

  try {
    const result = await callClaude(
      prompt,
      "You are a music discovery coach helping users break repetition habits."
    );
    return result || fallbackDetectRepetition(playlist, playHistory);
  } catch {
    return fallbackDetectRepetition(playlist, playHistory);
  }
}

export async function describePlaylistMoodServer(
  playlist: Playlist
): Promise<string> {
  const prompt = `Describe the mood of this playlist in EXACTLY 3 words. No punctuation, no extra text.

Playlist: "${playlist.name}"
Mood: ${playlist.mood}
Context: ${playlist.context}
Sample tracks: ${playlist.tracks
    .slice(0, 3)
    .map((t) => t.title)
    .join(", ")}

Example output: Calm focused flow`;

  try {
    const result = await callClaude(
      prompt,
      "Respond with exactly 3 words describing playlist mood. Nothing else."
    );
    const words = result
      .replace(/[^\w\s]/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 3);
    return words.length === 3 ? words.join(" ") : fallbackPlaylistMood(playlist);
  } catch {
    return fallbackPlaylistMood(playlist);
  }
}
