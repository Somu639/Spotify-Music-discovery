import { getSearchCatalog } from "@/lib/spotify-mock";
import type { Track } from "@/types";

export function searchTracks(query: string, limit = 50): Track[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return getSearchCatalog()
    .filter(
      (track) =>
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.album.toLowerCase().includes(q) ||
        track.genre.toLowerCase().includes(q) ||
        track.mood.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
