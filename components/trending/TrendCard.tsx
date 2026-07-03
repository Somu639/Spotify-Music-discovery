"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Track } from "@/types";
import { ClaudeLoadingBlock } from "@/components/ui/ClaudeLoading";
import { TrendBadge } from "./TrendBadge";

interface TrendCardProps {
  track: Track;
  trendScore: number;
  aiExplanation?: string;
  isLoadingExplanation: boolean;
  index: number;
  showTourTarget?: boolean;
  onPlay?: (track: Track) => void;
}

export function TrendCard({
  track,
  trendScore,
  aiExplanation,
  isLoadingExplanation,
  index,
  showTourTarget = false,
  onPlay,
}: TrendCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group w-[160px] shrink-0 sm:w-[180px]"
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-app-surface shadow-md">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <div className="absolute left-2 top-2">
          <TrendBadge score={trendScore} />
        </div>
        <button
          type="button"
          onClick={() => onPlay?.(track)}
          className="absolute bottom-2 right-2 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 hover:bg-[#1ed760]"
        >
          <Play className="h-5 w-5 fill-black pl-0.5" />
        </button>
      </div>

      <p className="truncate text-sm font-bold text-app-text">{track.title}</p>
      <p className="truncate text-xs text-app-muted">{track.artist}</p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-violet-700">
          {track.mood}
        </span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          {track.genre}
        </span>
      </div>

      <div
        {...(showTourTarget ? { "data-tour": "trend-explanation" } : {})}
        className="mt-2 min-h-[48px]"
      >
        {isLoadingExplanation ? (
          <ClaudeLoadingBlock message="Claude is thinking..." lines={2} />
        ) : (
          <p className="line-clamp-3 text-[11px] italic leading-relaxed text-[#1DB954]">
            {aiExplanation}
          </p>
        )}
      </div>
    </motion.article>
  );
}
