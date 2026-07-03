import type { SyncedPlaylist, Track } from "@/types";
import { getPreviewUrlForId } from "@/lib/audio-previews";
import { HINDI_SONGS, mergeTracksToCount, getHindiTracks } from "@/lib/hindi-catalog";
import { getTrendingCatalogTracks } from "@/lib/trending-catalog";

function padShareable(
  base: Omit<Track, "previewUrl">[],
  count = 20
): Omit<Track, "previewUrl">[] {
  const baseTracks = base.map((t) => ({ ...t, previewUrl: "" }));
  const filler = [...getHindiTracks(), ...getTrendingCatalogTracks()];
  return mergeTracksToCount(baseTracks, filler, count).map((track) => {
    const rest = { ...track };
    delete (rest as { previewUrl?: string }).previewUrl;
    return rest;
  });
}

export type ShareablePlaylist = {
  id: string;
  owner: string;
  relation: "Friend" | "Family";
  name: string;
  description: string;
  coverSeed: string;
  mood: string;
  context: string;
  tracks: Omit<Track, "previewUrl">[];
};

/** Playlists friends/family have shared with you — pick one to sync */
export const SHAREABLE_FF_PLAYLISTS: ShareablePlaylist[] = [
  {
    id: "share-emma-chill",
    owner: "Emma L.",
    relation: "Friend",
    name: "Emma's Chill Vibes",
    description: "Lo-fi and soft indie for study nights",
    coverSeed: "emma-chill",
    mood: "calm",
    context: "study sessions",
    tracks: padShareable([
      {
        id: "sh-em-1",
        title: "Sunset Lover",
        artist: "Petit Biscuit",
        album: "Presence",
        coverUrl: "https://picsum.photos/seed/sh-em-1/300/300",
        genre: "Electronic",
        playCount: 2100,
        energy: 0.35,
        tempo: 98,
        mood: "calm",
      },
      {
        id: "sh-em-2",
        title: "Holocene",
        artist: "Bon Iver",
        album: "Bon Iver",
        coverUrl: "https://picsum.photos/seed/sh-em-2/300/300",
        genre: "Indie Folk",
        playCount: 1850,
        energy: 0.25,
        tempo: 92,
        mood: "peaceful",
      },
      {
        id: "sh-em-3",
        title: "Redbone",
        artist: "Childish Gambino",
        album: "Awaken, My Love!",
        coverUrl: "https://picsum.photos/seed/sh-em-3/300/300",
        genre: "R&B",
        playCount: 1620,
        energy: 0.42,
        tempo: 67,
        mood: "chill",
      },
    ]),
  },
  {
    id: "share-jake-party",
    owner: "Jake P.",
    relation: "Friend",
    name: "Jake's Party Starters",
    description: "High-energy tracks from weekend hangouts",
    coverSeed: "jake-party",
    mood: "energetic",
    context: "parties",
    tracks: padShareable([
      {
        id: "sh-jk-1",
        title: "Uptown Funk",
        artist: "Bruno Mars",
        album: "Uptown Special",
        coverUrl: "https://picsum.photos/seed/sh-jk-1/300/300",
        genre: "Funk",
        playCount: 3200,
        energy: 0.94,
        tempo: 115,
        mood: "energetic",
      },
      {
        id: "sh-jk-2",
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        coverUrl: "https://picsum.photos/seed/sh-jk-2/300/300",
        genre: "Disco Pop",
        playCount: 2900,
        energy: 0.88,
        tempo: 103,
        mood: "happy",
      },
      {
        id: "sh-jk-3",
        title: "Can't Hold Us",
        artist: "Macklemore & Ryan Lewis",
        album: "The Heist",
        coverUrl: "https://picsum.photos/seed/sh-jk-3/300/300",
        genre: "Hip-Hop",
        playCount: 2700,
        energy: 0.91,
        tempo: 146,
        mood: "hype",
      },
    ]),
  },
  {
    id: "share-cousin-riya",
    owner: "Riya S.",
    relation: "Family",
    name: "Cousin Riya's Bollywood Mix",
    description: "Shared from her Spotify — updated weekly",
    coverSeed: "riya-bollywood",
    mood: "uplifting",
    context: "family celebrations",
    tracks: HINDI_SONGS.slice(0, 20).map((song) => ({
      id: `sh-ri-${song.id}`,
      title: song.title,
      artist: song.artist,
      album: song.album,
      coverUrl: `https://picsum.photos/seed/${song.id}/300/300`,
      genre: song.genre,
      playCount: song.playCount,
      energy: song.energy,
      tempo: song.tempo,
      mood: song.mood,
    })),
  },
];

export type SyncStep =
  | "idle"
  | "connecting"
  | "fetching"
  | "importing"
  | "complete"
  | "error";

export const SYNC_STEP_LABELS: Record<Exclude<SyncStep, "idle" | "error">, string> = {
  connecting: "Connecting to their Spotify…",
  fetching: "Fetching playlist tracks…",
  importing: "Importing to your library…",
  complete: "Sync complete!",
};

function toTrack(track: Omit<Track, "previewUrl">): Track {
  return { ...track, previewUrl: getPreviewUrlForId(track.id) };
}

export function buildSyncedPlaylist(share: ShareablePlaylist): SyncedPlaylist {
  return {
    id: `sync-${share.id}-${Date.now()}`,
    name: share.name,
    owner: share.owner,
    relation: share.relation,
    syncedAt: "Just now",
    coverUrl: `https://picsum.photos/seed/${share.coverSeed}/300/300`,
    tracks: share.tracks.map(toTrack),
    mood: share.mood,
    context: share.context,
  };
}

export async function mockSyncPlaylist(
  share: ShareablePlaylist,
  onStep: (step: SyncStep) => void
): Promise<SyncedPlaylist> {
  onStep("connecting");
  await delay(900);
  onStep("fetching");
  await delay(1100);
  onStep("importing");
  await delay(800);
  onStep("complete");
  return buildSyncedPlaylist(share);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
