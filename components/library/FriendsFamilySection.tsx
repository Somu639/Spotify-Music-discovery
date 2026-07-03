"use client";

import { ChevronLeft, Play, Shuffle } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { useSync } from "@/lib/sync-context";
import { MediaCard } from "@/components/ui/MediaCard";
import { TrackRow } from "@/components/ui/TrackRow";
import { SyncPlaylistFlow } from "./SyncPlaylistFlow";

interface FriendsFamilySectionProps {
  selectedPlaylistId?: string | null;
  onSelectPlaylist?: (id: string) => void;
  onClearPlaylist?: () => void;
}

export function FriendsFamilySection({
  selectedPlaylistId,
  onSelectPlaylist,
  onClearPlaylist,
}: FriendsFamilySectionProps) {
  const { syncedPlaylists, getSyncedById } = useSync();
  const { playQueue, playQueueShuffled } = usePlayer();
  const active = selectedPlaylistId
    ? getSyncedById(selectedPlaylistId)
    : undefined;

  if (active) {
    return (
      <section className="px-4 py-6 sm:px-8">
        <button
          type="button"
          onClick={onClearPlaylist}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-app-muted transition hover:text-app-text"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to synced playlists
        </button>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <img
            src={active.coverUrl}
            alt=""
            className="h-48 w-48 rounded-md shadow-2xl sm:h-56 sm:w-56"
          />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase text-app-text">Synced playlist</p>
            <h1 className="mt-2 text-4xl font-black text-app-text sm:text-5xl">
              {active.name}
            </h1>
            <p className="mt-2 text-sm text-app-muted">
              {active.owner} · {active.relation} · Synced {active.syncedAt}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => playQueue(active.tracks, 0)}
                aria-label="Play playlist"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-black hover:scale-105"
              >
                <Play className="h-6 w-6 fill-black pl-0.5" />
              </button>
              <button
                type="button"
                onClick={() => playQueueShuffled(active.tracks)}
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
              {active.tracks.map((track, i) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i}
                  queue={active.tracks}
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
      <h2 className="text-2xl font-bold text-app-text">Synced F&F Playlists</h2>
      <p className="mt-1 text-sm text-app-muted">
        Playlists shared from friends & family — pick one from the sidebar or below
      </p>

      <SyncPlaylistFlow onSynced={(id) => onSelectPlaylist?.(id)} />

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-app-text">Your synced library</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {syncedPlaylists.map((playlist) => (
            <MediaCard
              key={playlist.id}
              title={playlist.name}
              subtitle={`${playlist.owner} · ${playlist.relation}`}
              imageUrl={playlist.coverUrl}
              badge="Sync"
              onPlay={() => playQueue(playlist.tracks, 0)}
              onClick={() => onSelectPlaylist?.(playlist.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
