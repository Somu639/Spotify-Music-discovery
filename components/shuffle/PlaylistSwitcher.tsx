"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2 } from "lucide-react";
import { ClaudeThinking } from "@/components/ui/ClaudeLoading";
import { getAllPlaylists } from "@/lib/spotify-mock";
import type { Playlist } from "@/types";

interface PlaylistSwitcherProps {
  selectedId: string;
  onSelect: (id: string) => void;
  excludeId?: string;
}

async function fetchMoodTag(playlist: Playlist): Promise<string> {
  try {
    const response = await fetch("/api/claude/playlist-mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlist }),
    });
    if (!response.ok) throw new Error("Failed");
    const data = (await response.json()) as { moodTag: string };
    return data.moodTag;
  } catch {
    return `${playlist.mood} ${playlist.context} mix`.split(" ").slice(0, 3).join(" ");
  }
}

export function PlaylistSwitcher({
  selectedId,
  onSelect,
  excludeId,
}: PlaylistSwitcherProps) {
  const playlists = getAllPlaylists().filter((p) => p.id !== excludeId);
  const [moodTags, setMoodTags] = useState<Record<string, string>>({});
  const [loadingMood, setLoadingMood] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const cacheRef = useRef<Record<string, string>>({});

  const handleHover = useCallback(async (playlist: Playlist) => {
    setHoveredId(playlist.id);

    if (cacheRef.current[playlist.id]) {
      setMoodTags((prev) => ({ ...prev, [playlist.id]: cacheRef.current[playlist.id] }));
      return;
    }

    setLoadingMood(playlist.id);
    const tag = await fetchMoodTag(playlist);
    cacheRef.current[playlist.id] = tag;
    setMoodTags((prev) => ({ ...prev, [playlist.id]: tag }));
    setLoadingMood(null);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {playlists.map((playlist) => {
        const isSelected = playlist.id === selectedId;
        const isHovered = hoveredId === playlist.id;
        const moodTag = moodTags[playlist.id];
        const cover = playlist.tracks[0]?.coverUrl;

        return (
          <button
            key={playlist.id}
            type="button"
            onClick={() => onSelect(playlist.id)}
            onMouseEnter={() => handleHover(playlist)}
            onMouseLeave={() => setHoveredId(null)}
            className={`relative flex flex-col items-start gap-2 rounded-xl p-3 text-left transition ${
              isSelected
                ? "bg-[#1DB954]/15 ring-2 ring-[#1DB954]"
                : "border border-app-border bg-app-panel hover:bg-app-shell hover:ring-app-border"
            }`}
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-app-surface">
              {cover ? (
                <img
                  src={cover}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Music2 className="h-5 w-5 text-[#535353]" />
                </div>
              )}
            </div>

            <div className="min-w-0 w-full">
              <p className="truncate text-sm font-semibold text-app-text">
                {playlist.name}
              </p>
              <p className="truncate text-xs text-app-muted">{playlist.context}</p>
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute inset-x-2 bottom-2 flex items-center justify-center rounded-md bg-gradient-to-r from-violet-600/90 to-purple-600/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white"
                >
                  {loadingMood === playlist.id ? (
                    <ClaudeThinking label="…" className="text-[10px] text-white [&_span:first-child]:border-white [&_span:first-child]:border-t-transparent" />
                  ) : (
                    moodTag ?? "Hover for AI mood"
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
