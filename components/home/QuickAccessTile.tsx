"use client";

import { Pause, Play } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import type { HomeMix } from "@/types";

interface QuickAccessTileProps {
  mix: HomeMix;
}

export function QuickAccessTile({ mix }: QuickAccessTileProps) {
  const { playQueue, currentTrack, isPlaying, togglePlay } = usePlayer();
  const isCurrent =
    currentTrack && mix.tracks.some((t) => t.id === currentTrack.id);
  const playing = isCurrent && isPlaying;

  const handleClick = () => {
    if (isCurrent) togglePlay();
    else playQueue(mix.tracks, 0);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative flex items-center gap-3 overflow-hidden rounded-md bg-app-chip pr-12 transition hover:bg-app-chip-hover"
    >
      <img
        src={mix.imageUrl}
        alt=""
        className="h-[60px] w-[60px] shrink-0 object-cover shadow-lg sm:h-[68px] sm:w-[68px]"
      />
      <span className="truncate text-sm font-bold text-app-text">{mix.title}</span>
      <span
        className={`absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg transition ${
          playing
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        }`}
      >
        {playing ? (
          <Pause className="h-5 w-5 fill-black" />
        ) : (
          <Play className="h-5 w-5 fill-black pl-0.5" />
        )}
      </span>
    </button>
  );
}
