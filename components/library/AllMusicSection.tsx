"use client";

import { useMemo, useState } from "react";
import { getAllTracks } from "@/lib/spotify-mock";
import { usePlayer } from "@/lib/player-context";
import { TrackRow } from "@/components/ui/TrackRow";

export function AllMusicSection() {
  const tracks = useMemo(() => getAllTracks(), []);
  const [query, setQuery] = useState("");
  const { playQueue } = usePlayer();

  const filtered = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase()) ||
      t.genre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="px-4 py-6 sm:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-app-text sm:text-3xl">All Music</h2>
          <p className="mt-1 text-sm text-app-muted">
            Your library + synced songs — {tracks.length} tracks
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => playQueue(filtered, 0)}
            className="rounded-full bg-[#1DB954] px-6 py-2.5 text-sm font-bold text-black hover:scale-105"
          >
            Play all
          </button>
          <input
            type="search"
            placeholder="Search songs, artists, genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-app-border bg-app-surface px-4 py-2.5 text-sm text-app-text placeholder-app-subtle outline-none focus:ring-1 focus:ring-[#1DB954] sm:max-w-xs"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-app-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-app-border text-xs uppercase tracking-wider text-app-subtle">
            <tr>
              <th className="w-12 px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Album</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Genre</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((track, index) => (
              <TrackRow
                key={track.id}
                track={track}
                index={index}
                queue={filtered}
              />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-app-subtle">
            No tracks match your search.
          </p>
        )}
      </div>
    </section>
  );
}
