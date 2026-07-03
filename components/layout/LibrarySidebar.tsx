"use client";

import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Library,
  Plus,
  Search,
} from "lucide-react";
import {
  getAllPlaylists,
  getAllTracks,
} from "@/lib/spotify-mock";
import { useSync } from "@/lib/sync-context";
import { usePlayer } from "@/lib/player-context";
import type { ContentTab } from "@/types";

interface LibrarySidebarProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab, playlistId?: string | null) => void;
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string, type: "own" | "synced") => void;
}

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#1DB954]" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export function LibrarySidebar({
  activeTab,
  onTabChange,
  selectedPlaylistId,
  onSelectPlaylist,
}: LibrarySidebarProps) {
  const playlists = getAllPlaylists();
  const { syncedPlaylists: synced } = useSync();
  const { playQueue } = usePlayer();
  const likedTracks = getAllTracks().slice(0, 12);

  const itemClass = (active: boolean) =>
    `block w-full truncate rounded-md px-3 py-2 text-left text-sm transition ${
      active
        ? "bg-app-chip text-app-text"
        : "text-app-muted hover:text-app-text hover:bg-app-chip/60"
    }`;

  const navClass = (active: boolean) =>
    `flex w-full items-center gap-4 rounded-md px-3 py-2 text-sm font-bold ${
      active ? "text-app-text bg-app-chip" : "text-app-muted hover:text-app-text hover:bg-app-chip/60"
    }`;

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col gap-2 border-r border-app-border bg-app-shell p-2 md:flex">
      <div className="rounded-lg border border-app-border bg-app-panel px-5 py-4 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <SpotifyLogo />
          <span className="text-base font-bold text-app-text">Spotify Music Discovery</span>
        </div>
        <ul className="space-y-1">
          <li>
            <button type="button" onClick={() => onTabChange("all")} className={navClass(activeTab === "all")}>
              <Home className="h-6 w-6" />
              Home
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onTabChange("music")} className={navClass(activeTab === "music")}>
              <Library className="h-6 w-6" />
              Music
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onTabChange("trending")} className={navClass(activeTab === "trending")}>
              <Search className="h-6 w-6" />
              Trending
            </button>
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-app-border bg-app-panel px-5 py-3 shadow-sm">
        <ul className="space-y-1">
          <li>
            <button type="button" onClick={() => onTabChange("friends")} className={navClass(activeTab === "friends")}>
              <Heart className="h-5 w-5" />
              Sync F&F
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onTabChange("podcasts")} className={navClass(activeTab === "podcasts")}>
              <Plus className="h-5 w-5 rotate-45" />
              Podcast
            </button>
          </li>
        </ul>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-app-border bg-app-panel px-2 py-3 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 text-sm font-bold text-app-muted">
            <Library className="h-6 w-6" />
            Your Library
          </div>
        </div>

        <button
          type="button"
          className="mx-1 flex items-center gap-4 rounded-md px-3 py-2 text-sm font-bold text-app-muted hover:bg-app-chip/60 hover:text-app-text"
        >
          <Plus className="h-5 w-5" />
          Create Playlist
        </button>

        <button
          type="button"
          onClick={() => playQueue(likedTracks, 0)}
          className={`mx-1 flex items-center gap-3 ${itemClass(selectedPlaylistId === "liked")}`}
        >
          <Heart className="h-4 w-4 fill-[#1DB954] text-[#1DB954]" />
          Liked Songs
        </button>

        <div className="mt-2 flex-1 overflow-y-auto spotify-scroll px-1">
          <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-app-subtle">
            Playlists
          </p>
          {playlists.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                playQueue(p.tracks, 0);
                onSelectPlaylist(p.id, "own");
                onTabChange("music", p.id);
              }}
              className={itemClass(selectedPlaylistId === p.id && activeTab === "music")}
            >
              {p.name}
            </button>
          ))}

          <p className="mt-4 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-app-subtle">
            Synced F&F
          </p>
          {synced.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                playQueue(p.tracks, 0);
                onSelectPlaylist(p.id, "synced");
                onTabChange("friends", p.id);
              }}
              className={itemClass(selectedPlaylistId === p.id && activeTab === "friends")}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-2 border-t border-app-border px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-app-elevated text-xs font-bold text-app-text">
              AR
            </div>
            <div>
              <p className="text-sm font-bold text-app-text">Alex Rivera</p>
              <p className="text-[10px] font-bold uppercase text-[#1DB954]">
                Premium Member
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MainHeader() {
  return (
    <header className="relative z-40 shrink-0 border-b border-app-border bg-app-panel px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-app-surface text-app-muted hover:bg-app-elevated hover:text-app-text"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-app-surface text-app-muted hover:bg-app-elevated hover:text-app-text"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="hidden flex-1 sm:block">
          <input
            type="search"
            placeholder="What do you want to play?"
            className="w-full max-w-md rounded-full border border-app-border bg-app-surface px-4 py-2 text-sm text-app-text placeholder-app-muted outline-none focus:ring-2 focus:ring-[#1DB954]/30"
          />
        </div>
        <button
          type="button"
          className="ml-auto hidden rounded-full border border-app-border bg-app-panel px-4 py-1.5 text-sm font-bold text-app-text shadow-sm hover:scale-105 hover:bg-app-surface sm:block"
        >
          Explore Premium
        </button>
      </div>
    </header>
  );
}
