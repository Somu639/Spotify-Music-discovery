"use client";

import { BadgeCheck, MoreHorizontal, Pause, Play } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { usePlayer } from "@/lib/player-context";
import type { FeaturedArtist } from "@/types";

interface FeaturedArtistHeroProps {
  artist: FeaturedArtist;
}

export function FeaturedArtistHero({ artist }: FeaturedArtistHeroProps) {
  const { playQueue, currentTrack, isPlaying, togglePlay } = usePlayer();
  const isArtistPlaying =
    currentTrack && artist.tracks.some((t) => t.id === currentTrack.id);
  const playing = isArtistPlaying && isPlaying;

  return (
    <section className="relative mx-4 mt-4 overflow-hidden rounded-lg border border-app-border bg-gradient-to-r from-emerald-950/80 via-violet-950/60 to-app-panel sm:mx-8">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:p-8">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="h-48 w-48 shrink-0 rounded-full object-cover shadow-2xl sm:h-56 sm:w-56"
        />
        <div className="min-w-0 flex-1 pb-2">
          {artist.verified && (
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1DB954]">
              <BadgeCheck className="h-4 w-4" />
              Verified Artist
            </div>
          )}
          <h1 className="text-4xl font-black tracking-tight text-app-text sm:text-6xl">
            {artist.name}
          </h1>
          <p className="mt-2 text-sm text-app-muted">
            {formatNumber(artist.monthlyListeners)} monthly listeners
          </p>
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                isArtistPlaying ? togglePlay() : playQueue(artist.tracks, 0)
              }
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1DB954] text-black transition hover:scale-105 hover:bg-[#1ed760]"
            >
              {playing ? (
                <Pause className="h-7 w-7 fill-black" />
              ) : (
                <Play className="h-7 w-7 fill-black pl-1" />
              )}
            </button>
            <button
              type="button"
              className="rounded-full border border-app-border bg-app-elevated px-6 py-2 text-sm font-bold text-app-text transition hover:border-app-muted hover:scale-105"
            >
              Follow
            </button>
            <button
              type="button"
              className="text-app-muted transition hover:text-app-text"
              aria-label="More options"
            >
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
