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
} from "lucide-react";
import { getLikedTracksForLibrary } from "@/lib/spotify-mock";
import { CONTENT_TABS } from "@/lib/content-tabs";
import { usePlayer } from "@/lib/player-context";
import type { ContentTab } from "@/types";
import { FilterPill } from "@/components/ui/FilterPill";
import { useMemo, useState } from "react";

interface LibrarySidebarProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab, playlistId?: string | null) => void;
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string, type: "own" | "synced") => void;
}

function SpotifyLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-[#1DB954] ${className}`} aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function getLikedTracks(likedIds: Set<string>) {
  return getLikedTracksForLibrary(likedIds);
}

function sidebarNavClass(active: boolean) {
  return `flex w-full items-center gap-4 rounded-md px-3 py-2.5 text-sm font-bold transition ${
    active
      ? "bg-white/10 text-white"
      : "text-app-muted hover:bg-white/5 hover:text-white"
  }`;
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

  const focusMainSearch = () => {
    const input = document.getElementById("main-search") as HTMLInputElement | null;
    input?.focus();
  };

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col gap-2 bg-black p-2 md:flex">
      <button
        type="button"
        onClick={() => onTabChange("all")}
        className="px-3 pt-2"
        aria-label="Spotify home"
      >
        <SpotifyLogo className="h-8 w-8" />
      </button>

      {/* Home + Search — real Spotify top block */}
      <div className="rounded-lg bg-[#121212] px-2 py-2">
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => onTabChange("all")}
              className={sidebarNavClass(activeTab === "all")}
            >
              <Home className="h-6 w-6 shrink-0" />
              Home
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={focusMainSearch}
              className={sidebarNavClass(false)}
            >
              <Search className="h-6 w-6 shrink-0" />
              Search
            </button>
          </li>
        </ul>
      </div>

      {/* Your Library — no duplicate section tabs (those live at top) */}
      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-[#121212]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => onTabChange("music", null)}
            className={`flex items-center gap-3 text-sm font-bold transition hover:text-white ${
              activeTab === "music" ? "text-white" : "text-app-muted"
            }`}
          >
            <Library className="h-6 w-6" />
            Your Library
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-app-muted hover:bg-white/10 hover:text-white"
            aria-label="Create playlist"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto spotify-scroll px-2 pb-2">
          <button
            type="button"
            className="mx-1 flex w-[calc(100%-8px)] items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-app-muted hover:bg-white/5 hover:text-white"
          >
            <Plus className="h-5 w-5 shrink-0" />
            Create Playlist
          </button>

          <div className="mx-1 mt-1">
            <button
              type="button"
              onClick={() => {
                setLikedOpen((open) => !open);
                onTabChange("music", "liked");
              }}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-bold transition ${
                selectedPlaylistId === "liked"
                  ? "bg-white/10 text-white"
                  : "text-app-muted hover:bg-white/5 hover:text-white"
              }`}
              aria-expanded={likedOpen}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-[#5038a0] to-[#1DB954]">
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
                className="mt-1 max-h-52 overflow-y-auto rounded-md bg-[#282828] py-1 spotify-scroll"
                role="listbox"
                aria-label="Liked songs"
              >
                {likedTracks.map((track) => (
                  <li key={track.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPlaylist("liked", "own");
                        playTrack(track, likedTracks);
                        setNowPlayingExpanded(true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/10"
                    >
                      <img
                        src={track.coverUrl}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-white">
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

        <div className="border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#333] text-xs font-bold text-white">
              AR
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">Alex Rivera</p>
              <p className="text-[10px] font-bold uppercase text-[#1DB954]">Premium</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MainHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}) {
  return (
    <header className="sticky top-0 z-40 shrink-0 bg-app-bg/95 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/60 text-app-muted hover:bg-black/80 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/60 text-app-muted hover:bg-black/80 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          <input
            id="main-search"
            type="search"
            placeholder="What do you want to play?"
            className="w-full rounded-full border-0 bg-[#242424] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-app-muted outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>

      <nav
        aria-label="Sections"
        role="tablist"
        className="mt-3 flex gap-2 overflow-x-auto pb-0.5 spotify-scroll"
      >
        {CONTENT_TABS.map(({ id, label }) => (
          <FilterPill
            key={id}
            variant="spotify"
            selected={activeTab === id}
            aria-selected={activeTab === id}
            onClick={() => onTabChange(id)}
          >
            {label}
          </FilterPill>
        ))}
      </nav>
    </header>
  );
}
