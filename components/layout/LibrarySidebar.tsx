"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Library,
  Plus,
  Search,
  Compass,
  Users,
} from "lucide-react";
import { getLikedTracksForLibrary } from "@/lib/spotify-mock";
import { usePlayer } from "@/lib/player-context";
import type { ContentTab } from "@/types";
import { useMemo, useState } from "react";

interface LibrarySidebarProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab, playlistId?: string | null) => void;
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string, type: "own" | "synced") => void;
}

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-[#1DB954]" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function getLikedTracks(likedIds: Set<string>) {
  return getLikedTracksForLibrary(likedIds);
}

export function LibrarySidebar({
  activeTab,
  onTabChange,
  selectedPlaylistId,
  onSelectPlaylist,
}: LibrarySidebarProps) {
  const { likedIds, playTrack, setNowPlayingExpanded } = usePlayer();
  const [likedOpen, setLikedOpen] = useState(false);

  const likedTracks = useMemo(() => getLikedTracks(likedIds), [likedIds]);

  const navClass = (active: boolean) =>
    `flex w-full items-center gap-4 rounded-md px-3 py-2.5 text-sm font-bold transition ${
      active
        ? "bg-app-chip text-app-text shadow-[inset_3px_0_0_0_#a855f7]"
        : "text-app-muted hover:bg-app-chip/60 hover:text-app-text"
    }`;

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col bg-black md:flex">
      {/* Top nav — Spotify home / search block */}
      <div className="px-3 pt-3">
        <div className="mb-4 flex items-center gap-2 px-2">
          <SpotifyLogo />
          <span className="text-base font-bold tracking-tight text-app-text">
            Spotify
          </span>
        </div>
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => onTabChange("all")}
              className={navClass(activeTab === "all")}
            >
              <Home className="h-6 w-6 shrink-0" />
              Home
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onTabChange("trending")}
              className={navClass(activeTab === "trending")}
            >
              <Compass className="h-6 w-6 shrink-0" />
              Discover
            </button>
          </li>
        </ul>
      </div>

      {/* Your Library — Spotify-style panel */}
      <div className="mx-3 mt-2 flex min-h-0 flex-1 flex-col rounded-lg bg-app-panel">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onTabChange("music", null);
            }}
            className="flex items-center gap-3 text-sm font-bold text-app-text hover:text-white"
          >
            <Library className="h-6 w-6" />
            Your Library
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-app-muted hover:bg-app-chip hover:text-app-text"
            aria-label="Create playlist"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 px-4 pb-2">
          <button
            type="button"
            onClick={() => onTabChange("music", null)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              activeTab === "music"
                ? "bg-white text-black"
                : "bg-app-chip text-app-text hover:bg-app-chip-hover"
            }`}
          >
            Playlists
          </button>
          <button
            type="button"
            onClick={() => onTabChange("friends")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              activeTab === "friends"
                ? "bg-white text-black"
                : "bg-app-chip text-app-text hover:bg-app-chip-hover"
            }`}
          >
            Sync F&F
          </button>
          <button
            type="button"
            onClick={() => onTabChange("podcasts")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              activeTab === "podcasts"
                ? "bg-white text-black"
                : "bg-app-chip text-app-text hover:bg-app-chip-hover"
            }`}
          >
            Podcasts
          </button>
        </div>

        <div className="flex-1 overflow-y-auto spotify-scroll px-2 pb-2">
          <button
            type="button"
            className="mx-1 flex w-[calc(100%-8px)] items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-app-muted hover:bg-app-chip/60 hover:text-app-text"
          >
            <Plus className="h-5 w-5 shrink-0" />
            Create Playlist
          </button>

          {/* Liked Songs — expandable dropdown only (no playlist list below) */}
          <div className="mx-1 mt-1">
            <button
              type="button"
              onClick={() => setLikedOpen((open) => !open)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-bold transition ${
                selectedPlaylistId === "liked"
                  ? "bg-app-chip text-app-text shadow-[inset_3px_0_0_0_#a855f7]"
                  : "text-app-muted hover:bg-app-chip/60 hover:text-app-text"
              }`}
              aria-expanded={likedOpen}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-[#5038a0] via-[#8b5cf6] to-[#1DB954]">
                  <Heart className="h-4 w-4 fill-white text-white" />
                </span>
                Liked Songs
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${likedOpen ? "rotate-180" : ""}`}
              />
            </button>

            {likedOpen && (
              <ul
                className="mt-1 max-h-52 overflow-y-auto rounded-md border border-app-accent-purple/20 bg-app-surface/80 py-1 spotify-scroll"
                role="listbox"
                aria-label="Liked songs"
              >
                {likedTracks.map((track) => (
                  <li key={track.id}>
                    <button
                      type="button"
                      role="option"
                      onClick={() => {
                        onSelectPlaylist("liked", "own");
                        playTrack(track, likedTracks);
                        setNowPlayingExpanded(true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-app-chip/80"
                    >
                      <img
                        src={track.coverUrl}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-app-text">
                          {track.title}
                        </span>
                        <span className="block truncate text-xs text-app-muted">
                          {track.artist}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-app-border/80 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6]/40 to-app-elevated text-xs font-bold text-app-text">
              AR
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-app-text">Alex Rivera</p>
              <p className="text-[10px] font-bold uppercase text-[#1DB954]">Premium</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MainHeader() {
  return (
    <header className="sticky top-0 z-40 shrink-0 bg-app-bg/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-app-muted hover:bg-black/60 hover:text-app-text"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-app-muted hover:bg-black/60 hover:text-app-text"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="hidden flex-1 sm:block">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
            <input
              type="search"
              placeholder="What do you want to play?"
              className="w-full rounded-full border-0 bg-app-surface py-2 pl-10 pr-4 text-sm text-app-text placeholder-app-muted outline-none ring-1 ring-transparent focus:ring-app-accent-purple/40"
            />
          </div>
        </div>
        <button
          type="button"
          className="ml-auto hidden items-center gap-2 rounded-full bg-app-surface px-4 py-1.5 text-sm font-bold text-app-text ring-1 ring-app-accent-purple/20 hover:ring-app-accent-purple/50 sm:flex"
        >
          <Users className="h-4 w-4 text-app-accent-purple" />
          Explore Premium
        </button>
      </div>
    </header>
  );
}
