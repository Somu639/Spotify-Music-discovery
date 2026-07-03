"use client";

import { Heart, Play, Shuffle } from "lucide-react";
import {
  getAllPlaylists,
  getAllTracks,
  getLikedTracksForLibrary,
  getPlaylistById,
} from "@/lib/spotify-mock";
import { usePlayer } from "@/lib/player-context";
import { TrackRow } from "@/components/ui/TrackRow";
import { useMemo, useState } from "react";

interface MusicSectionProps {
  selectedPlaylistId?: string | null;
  onSelectPlaylist?: (id: string) => void;
}

export function MusicSection({
  selectedPlaylistId,
  onSelectPlaylist,
}: MusicSectionProps) {
  const tracks = useMemo(() => getAllTracks(), []);
  const playlists = useMemo(() => getAllPlaylists(), []);
  const [query, setQuery] = useState("");
  const { playQueue, playQueueShuffled, likedIds } = usePlayer();
  const likedTracks = useMemo(
    () => getLikedTracksForLibrary(likedIds),
    [likedIds]
  );
  const playlist =
    selectedPlaylistId === "liked"
      ? {
          id: "liked",
          name: "Liked Songs",
          tracks: likedTracks,
          mood: "favorites",
          context: "Your collection",
        }
      : selectedPlaylistId
        ? getPlaylistById(selectedPlaylistId)
        : undefined;

  const filtered = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase()) ||
      t.genre.toLowerCase().includes(query.toLowerCase())
  );

  if (playlist) {
    const isLiked = playlist.id === "liked";
    return (
      <section className="px-4 py-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          {isLiked ? (
            <div className="flex h-48 w-48 items-center justify-center rounded-md bg-gradient-to-br from-[#5038a0] via-[#8b5cf6] to-[#1DB954] shadow-2xl sm:h-56 sm:w-56">
              <Heart className="h-20 w-20 fill-white/90 text-white" />
            </div>
          ) : (
            <img
              src={playlist.tracks[0]?.coverUrl ?? ""}
              alt=""
              className="h-48 w-48 rounded-md shadow-2xl sm:h-56 sm:w-56"
            />
          )}
          <div className="flex-1">
            <p className="text-xs font-bold uppercase text-app-text">Playlist</p>
            <h1 className="mt-2 text-4xl font-black text-app-text sm:text-5xl">
              {playlist.name}
            </h1>
            <p className="mt-2 text-sm text-app-muted">
              {playlist.context} · {playlist.tracks.length} songs · {playlist.mood}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => playQueue(playlist.tracks, 0)}
                aria-label="Play playlist"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-black hover:scale-105"
              >
                <Play className="h-6 w-6 fill-black pl-0.5" />
              </button>
              <button
                type="button"
                onClick={() => playQueueShuffled(playlist.tracks)}
                aria-label="Shuffle playlist without repeat"
                title="Shuffle — no song repeats until all are played"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-app-border bg-app-panel text-app-text transition hover:scale-105 hover:bg-app-shell"
              >
                <Shuffle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-app-border text-xs uppercase text-app-subtle">
              <tr>
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="hidden px-4 py-3 sm:table-cell">Album</th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.map((track, i) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i}
                  queue={playlist.tracks}
                  showGenre={false}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-6 sm:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-app-text sm:text-3xl">Your Library</h2>
        <p className="mt-1 text-sm text-app-muted">
          {playlists.length} playlists
        </p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <button
          type="button"
          onClick={() => onSelectPlaylist?.("liked")}
          className="group rounded-md bg-app-surface/60 p-4 text-left transition hover:bg-app-surface ring-1 ring-transparent hover:ring-app-accent-purple/25"
        >
          <div className="mb-3 flex aspect-square items-center justify-center rounded-md bg-gradient-to-br from-[#5038a0] via-[#8b5cf6] to-[#1DB954] shadow-lg">
            <Heart className="h-10 w-10 fill-white/90 text-white" />
          </div>
          <p className="truncate font-bold text-app-text">Liked Songs</p>
          <p className="text-xs text-app-muted">Playlist · {likedTracks.length} songs</p>
        </button>
        {playlists.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPlaylist?.(p.id)}
            className="group rounded-md bg-app-surface/60 p-4 text-left transition hover:bg-app-surface ring-1 ring-transparent hover:ring-app-accent-purple/25"
          >
            <img
              src={p.tracks[0]?.coverUrl ?? ""}
              alt=""
              className="mb-3 aspect-square w-full rounded-md object-cover shadow-lg"
            />
            <p className="truncate font-bold text-app-text">{p.name}</p>
            <p className="text-xs text-app-muted">
              Playlist · {p.tracks.length} songs
            </p>
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-app-text">All tracks</h2>
          <p className="mt-1 text-sm text-app-muted">
            {tracks.length} tracks · {getAllPlaylists().length} playlists
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
          <button
            type="button"
            onClick={() => playQueueShuffled(filtered)}
            className="flex items-center gap-2 rounded-full border border-app-border bg-app-panel px-5 py-2.5 text-sm font-bold text-app-text hover:bg-app-shell"
            title="Shuffle — no song repeats until all are played"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
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
