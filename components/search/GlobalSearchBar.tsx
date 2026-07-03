"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Search, X } from "lucide-react";
import { searchTracks } from "@/lib/search-tracks";
import { usePlayer } from "@/lib/player-context";
import type { Track } from "@/types";

interface GlobalSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function GlobalSearchBar({ query, onQueryChange }: GlobalSearchBarProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const { playTrack, setNowPlayingExpanded } = usePlayer();

  const trimmed = query.trim();
  const results = useMemo(
    () => (trimmed.length >= 1 ? searchTracks(trimmed, 8) : []),
    [trimmed]
  );

  const showDropdown = focused && trimmed.length >= 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlay = (track: Track, queue: Track[]) => {
    playTrack(track, queue);
    setNowPlayingExpanded(true);
    setFocused(false);
  };

  return (
    <div ref={wrapperRef} className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
      <input
        ref={inputRef}
        id="main-search"
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onQueryChange("");
            setFocused(false);
            inputRef.current?.blur();
          }
        }}
        placeholder="What do you want to play?"
        aria-label="Search songs, artists, and genres"
        aria-expanded={showDropdown}
        aria-controls="search-dropdown"
        className="w-full rounded-full border-0 bg-[#242424] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-app-muted outline-none focus:ring-2 focus:ring-[#1DB954]/50"
      />
      {query.length > 0 && (
        <button
          type="button"
          onClick={() => {
            onQueryChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-white"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {showDropdown && (
        <div
          id="search-dropdown"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] max-h-80 overflow-y-auto rounded-lg border border-app-border bg-[#282828] py-2 shadow-2xl spotify-scroll"
        >
          {results.length > 0 ? (
            results.map((track) => (
              <button
                key={track.id}
                type="button"
                role="option"
                onClick={() => handlePlay(track, results)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-white/10"
              >
                <img
                  src={track.coverUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">
                    {track.title}
                  </span>
                  <span className="block truncate text-xs text-app-muted">
                    {track.artist}
                  </span>
                </span>
                <Play className="h-4 w-4 shrink-0 text-app-muted" />
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-app-muted">
              No songs found for &ldquo;{trimmed}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
