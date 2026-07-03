"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getTrendingGroupedByGenre,
  getTrendingGroupedByMood,
  getTrendingTracks,
} from "@/lib/spotify-mock";
import { usePlayer } from "@/lib/player-context";
import type { TrendingGroup, TrendingItem } from "@/types";
import { ClaudeLoadingBlock } from "@/components/ui/ClaudeLoading";
import { SectionRow } from "@/components/ui/SectionRow";
import { TrendCard } from "./TrendCard";

type TrendView = "all" | "mood" | "genre";

const VIEW_TABS: { id: TrendView; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mood", label: "By Mood" },
  { id: "genre", label: "By Genre" },
];

function normalizeScore(score: number, min: number, max: number): number {
  if (max === min) return 100;
  return Math.round(((score - min) / (max - min)) * 100);
}

function formatLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

async function fetchExplanation(
  item: TrendingItem
): Promise<{ id: string; explanation: string }> {
  try {
    const response = await fetch("/api/claude/trend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        track: item.track,
        trendScore: item.trendScore,
      }),
    });

    if (!response.ok) throw new Error("API error");

    const data = (await response.json()) as { explanation: string };
    return { id: item.track.id, explanation: data.explanation };
  } catch {
    return { id: item.track.id, explanation: item.aiExplanation };
  }
}

function collectItems(
  top: TrendingItem[],
  moodGroups: TrendingGroup[],
  genreGroups: TrendingGroup[],
  view: TrendView
): TrendingItem[] {
  if (view === "mood") {
    return moodGroups.flatMap((g) => g.items);
  }
  if (view === "genre") {
    return genreGroups.flatMap((g) => g.items);
  }
  const ids = new Set<string>();
  const merged: TrendingItem[] = [];
  for (const item of [
    ...top,
    ...moodGroups.flatMap((g) => g.items),
    ...genreGroups.flatMap((g) => g.items),
  ]) {
    if (ids.has(item.track.id)) continue;
    ids.add(item.track.id);
    merged.push(item);
  }
  return merged;
}

interface TrendRowProps {
  group: TrendingGroup;
  subtitle: string;
  scoreRange: { min: number; max: number };
  explanations: Record<string, string>;
  isLoading: boolean;
  onPlay: (track: TrendingItem["track"]) => void;
  tourTarget?: boolean;
}

function TrendRow({
  group,
  subtitle,
  scoreRange,
  explanations,
  isLoading,
  onPlay,
  tourTarget,
}: TrendRowProps) {
  return (
    <SectionRow title={formatLabel(group.label)} subtitle={subtitle}>
      {group.items.map((item, index) => (
        <TrendCard
          key={item.track.id}
          track={item.track}
          trendScore={normalizeScore(
            item.trendScore,
            scoreRange.min,
            scoreRange.max
          )}
          aiExplanation={explanations[item.track.id]}
          isLoadingExplanation={isLoading}
          index={index}
          showTourTarget={tourTarget && index === 0}
          onPlay={onPlay}
        />
      ))}
    </SectionRow>
  );
}

export default function TrendingSection() {
  const [view, setView] = useState<TrendView>("all");
  const topTrending = useMemo(() => getTrendingTracks(), []);
  const moodGroups = useMemo(() => getTrendingGroupedByMood(), []);
  const genreGroups = useMemo(() => getTrendingGroupedByGenre(), []);
  const { playTrack } = usePlayer();

  const visibleItems = useMemo(
    () => collectItems(topTrending, moodGroups, genreGroups, view),
    [topTrending, moodGroups, genreGroups, view]
  );

  const queue = visibleItems;
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const scoreRange = useMemo(() => {
    const scores = visibleItems.map((item) => item.trendScore);
    if (!scores.length) return { min: 0, max: 100 };
    return { min: Math.min(...scores), max: Math.max(...scores) };
  }, [visibleItems]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const itemsToFetch = visibleItems.slice(0, 12);

    Promise.all(itemsToFetch.map((item) => fetchExplanation(item))).then(
      (results) => {
        if (cancelled) return;
        const fetched = Object.fromEntries(
          results.map((r) => [r.id, r.explanation])
        );
        const fallback = Object.fromEntries(
          visibleItems.map((item) => [
            item.track.id,
            item.aiExplanation,
          ])
        );
        setExplanations({ ...fallback, ...fetched });
        setIsLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [visibleItems]);

  const handlePlay = (track: TrendingItem["track"]) => {
    playTrack(track, queue.map((q) => q.track));
  };

  return (
    <div data-tour="trending-section" className="pb-8">
      <div className="mb-6 flex flex-wrap gap-2 px-4 sm:px-8">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              view === tab.id
                ? "bg-[#1DB954] text-black"
                : "bg-app-chip text-app-text hover:bg-app-chip-hover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && visibleItems.length === 0 ? (
        <div className="px-4 sm:px-8">
          <ClaudeLoadingBlock message="Loading trending tracks..." lines={2} />
        </div>
      ) : (
        <>
          {(view === "all" || view === "mood") &&
            moodGroups.map((group) => (
              <TrendRow
                key={`mood-${group.label}`}
                group={group}
                subtitle={`Trending ${group.label} tracks — AI explains why they spike`}
                scoreRange={scoreRange}
                explanations={explanations}
                isLoading={isLoading}
                onPlay={handlePlay}
                tourTarget={view === "all" && group === moodGroups[0]}
              />
            ))}

          {(view === "all" || view === "genre") &&
            genreGroups.map((group) => (
              <TrendRow
                key={`genre-${group.label}`}
                group={group}
                subtitle={`Hot in ${group.label} — momentum picks for this genre`}
                scoreRange={scoreRange}
                explanations={explanations}
                isLoading={isLoading}
                onPlay={handlePlay}
              />
            ))}

          {view === "all" && (
            <SectionRow
              title="Top trending overall"
              subtitle="Highest momentum across your library right now"
            >
              {topTrending.map((item, index) => (
                <TrendCard
                  key={item.track.id}
                  track={item.track}
                  trendScore={normalizeScore(
                    item.trendScore,
                    scoreRange.min,
                    scoreRange.max
                  )}
                  aiExplanation={explanations[item.track.id]}
                  isLoadingExplanation={isLoading}
                  index={index}
                  onPlay={handlePlay}
                />
              ))}
            </SectionRow>
          )}
        </>
      )}
    </div>
  );
}
