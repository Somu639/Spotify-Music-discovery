"use client";

import { Play } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import type { RecentlyPlayedItem } from "@/types";

interface RecentlyPlayedCardProps {
  item: RecentlyPlayedItem;
  queue: RecentlyPlayedItem[];
}

export function RecentlyPlayedCard({ item, queue }: RecentlyPlayedCardProps) {
  const { playTrack } = usePlayer();
  const tracks = queue.map((q) => q.track);

  return (
    <button
      type="button"
      onClick={() => playTrack(item.track, tracks)}
      className="group flex w-[280px] shrink-0 items-center gap-3 rounded-md border border-app-border bg-app-panel p-2 transition hover:bg-app-shell sm:w-[320px]"
    >
      <div className="relative shrink-0">
        <img
          src={item.imageUrl}
          alt=""
          className="h-16 w-16 rounded object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center rounded bg-black/40 opacity-0 transition group-hover:opacity-100">
          <Play className="h-6 w-6 fill-white text-white" />
        </span>
      </div>
      <div className="min-w-0 text-left">
        <p className="truncate font-bold text-app-text">{item.title}</p>
        <p className="truncate text-sm text-app-muted">{item.artist}</p>
      </div>
    </button>
  );
}
