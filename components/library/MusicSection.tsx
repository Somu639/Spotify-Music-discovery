"use client";

import { Heart, Music2, Play, Plus, Shuffle } from "lucide-react";
import { getLikedTracksForLibrary, getSearchCatalog } from "@/lib/spotify-mock";
import { usePlaylists } from "@/lib/playlists-context";
import { usePlayer } from "@/lib/player-context";
import { TrackRow } from "@/components/ui/TrackRow";
import { useMemo, useState } from "react";

interface MusicSectionProps {
  selectedPlaylistId?: string | null;
  onSelectPlaylist?: (id: string) => void;
  onOpenCreatePlaylist?: () => void;
}

export function MusicSection({
  selectedPlaylistId,
  onSelectPlaylist,
  onOpenCreatePlaylist,
}: MusicSectionProps) {
  const tracks = useMemo(() => getSearchCatalog(), []);
  const { allPlaylists, getPlaylistById, isUserPlaylist, addTrackToPlaylist, userPlaylists } =
    usePlaylists();
  const playlists = allPlaylists;
  const [query, setQuery] = useState("");
  const [addSongQuery, setAddSongQuery] = useState("");
  const { playQueue, playQueueShuffled, likedIds } = usePlayer();
  const likedTracks = useMemo(
    () => getLikedTracksForLibrary(likedIds),
    [likedIds]
  );
  const playlist = useMemo(() => {
    if (selectedPlaylistId === "liked") {
      return {
        id: "liked",
        name: "Liked Songs",
        tracks: likedTracks,
        mood: "favorites",
        context: "Your collection",
      };
    }
    if (selectedPlaylistId) return getPlaylistById(selectedPlaylistId);
    return undefined;
  }, [selectedPlaylistId, likedTracks, getPlaylistById, userPlaylists]);

  const filtered = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase()) ||
      t.genre.toLowerCase().includes(query.toLowerCase())
  );

  if (playlist) {
    const isLiked = playlist.id === "liked";
    const isEmpty = playlist.tracks.length === 0;
    const isCustom = isUserPlaylist(playlist.id);
    const playlistTrackIds = new Set(playlist.tracks.map((t) => t.id));
    const addCandidates = tracks
      .filter(
        (t) =>
          !playlistTrackIds.has(t.id) &&
          (addSongQuery.trim() === "" ||
            t.title.toLowerCase().includes(addSongQuery.toLowerCase()) ||
            t.artist.toLowerCase().includes(addSongQuery.toLowerCase()))
      )
      .slice(0, 12);
    return (
      <section className="px-4 py-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          {isLiked ? (
            <div className="flex h-48 w-48 items-center justify-center rounded-md bg-gradient-to-br from-[#5038a0] via-[#8b5cf6] to-[#1DB954] shadow-2xl sm:h-56 sm:w-56">
              <Heart className="h-20 w-20 fill-white/90 text-white" />
            </div>
          ) : isEmpty ? (
            <div className="flex h-48 w-48 items-center justify-center rounded-md bg-gradient-to-br from-[#333] to-[#121212] shadow-2xl sm:h-56 sm:w-56">
              <Music2 className="h-20 w-20 text-app-muted" />
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
                disabled={isEmpty}
                aria-label="Play playlist"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-black hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play className="h-6 w-6 fill-black pl-0.5" />
              </button>
              <button
                type="button"
                onClick={() => playQueueShuffled(playlist.tracks)}
                disabled={isEmpty}
                aria-label="Shuffle playlist without repeat"
                title="Shuffle — no song repeats until all are played"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-app-border bg-app-panel text-app-text transition hover:scale-105 hover:bg-app-shell disabled:cursor-not-allowed disabled:opacity-40"
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
          {isEmpty && (
            <p className="px-4 py-10 text-center text-sm text-app-muted">
              This playlist is empty. Add songs below to start building your mix.
            </p>
          )}
        </div>

        {isCustom && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-app-text">Add songs</h2>
            <input
              type="search"
              placeholder="Search songs to add..."
              value={addSongQuery}
              onChange={(e) => setAddSongQuery(e.target.value)}
              className="mt-3 w-full max-w-md rounded-full border border-app-border bg-app-surface px-4 py-2.5 text-sm text-app-text placeholder-app-subtle outline-none focus:ring-1 focus:ring-[#1DB954]"
            />
            <ul className="mt-4 space-y-1">
              {addCandidates.map((track) => (
                <li
                  key={track.id}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-app-surface"
                >
                  <img
                    src={track.coverUrl}
                    alt=""
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-app-text">
                      {track.title}
                    </p>
                    <p className="truncate text-xs text-app-muted">{track.artist}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addTrackToPlaylist(playlist.id, track)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-app-border text-app-text hover:border-[#1DB954] hover:text-[#1DB954]"
                    aria-label={`Add ${track.title} to playlist`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            {addCandidates.length === 0 && (
              <p className="mt-4 text-sm text-app-muted">
                {addSongQuery.trim()
                  ? "No matching songs to add."
                  : "All catalog songs are already in this playlist."}
              </p>
            )}
          </div>
        )}
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
          onClick={onOpenCreatePlaylist}
          className="group rounded-md bg-app-surface/60 p-4 text-left transition hover:bg-app-surface ring-1 ring-transparent hover:ring-[#1DB954]/40"
        >
          <div className="mb-3 flex aspect-square w-full items-center justify-center rounded-md border border-dashed border-app-border bg-[#282828] shadow-lg transition group-hover:border-[#1DB954]">
            <Plus className="h-10 w-10 text-app-muted transition group-hover:text-[#1DB954]" />
          </div>
          <p className="truncate font-bold text-app-text">Create Playlist</p>
          <p className="text-xs text-app-muted">New playlist</p>
        </button>
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
            {p.tracks[0]?.coverUrl ? (
              <img
                src={p.tracks[0].coverUrl}
                alt=""
                className="mb-3 aspect-square w-full rounded-md object-cover shadow-lg"
              />
            ) : (
              <div className="mb-3 flex aspect-square w-full items-center justify-center rounded-md bg-[#282828] shadow-lg">
                <Music2 className="h-10 w-10 text-app-muted" />
              </div>
            )}
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
            {tracks.length} tracks · {playlists.length} playlists
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
