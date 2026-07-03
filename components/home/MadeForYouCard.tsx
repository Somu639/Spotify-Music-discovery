"use client";

import { Play } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import type { HomeMix } from "@/types";

interface MadeForYouCardProps {
  mix: HomeMix;
}

export function MadeForYouCard({ mix }: MadeForYouCardProps) {
  const { playQueue } = usePlayer();

  return (
    <div className="group w-[180px] shrink-0 cursor-pointer sm:w-[200px]">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-app-surface shadow-md">
        <img
          src={mix.imageUrl}
          alt={mix.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => playQueue(mix.tracks, 0)}
          className="absolute bottom-2 right-2 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 hover:bg-[#1ed760]"
          aria-label={`Play ${mix.title}`}
        >
          <Play className="h-6 w-6 fill-black pl-0.5" />
        </button>
      </div>
      <p className="truncate text-base font-bold text-app-text">{mix.title}</p>
      {mix.subtitle && (
        <p className="mt-1 line-clamp-2 text-sm text-app-muted">
          {mix.subtitle}
        </p>
      )}
    </div>
  );
}
