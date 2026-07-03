"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { getSurveyInsights } from "@/lib/survey-insights";
import type { SurveyInsight } from "@/types";

type MvpFeature = "trending" | "shuffle";

interface InsightMapping {
  feature: MvpFeature;
  featureLabel: string;
  solution: string;
  tagLabel: string;
  tagClass: string;
  traditional: string;
  aiPowered: string;
}

const INSIGHT_MAPPINGS: Record<string, InsightMapping> = {
  "Unconscious repetition": {
    feature: "shuffle",
    featureLabel: "Smart Shuffle",
    solution:
      "Detects when top tracks dominate your playlist and suggests a mood-similar alternative before you burn out.",
    tagLabel: "Solved by Smart Shuffle",
    tagClass: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    traditional: "Static play counts with no loop awareness",
    aiPowered: "Claude detects repetition patterns and prescribes playlist breaks",
  },
  "Mood-blind discovery": {
    feature: "shuffle",
    featureLabel: "Smart Shuffle",
    solution:
      "AI picks bridge tracks that match your current energy before shifting context — no jarring mood whiplash.",
    tagLabel: "Solved by Smart Shuffle",
    tagClass: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    traditional: "Random shuffle algorithm",
    aiPowered: "Mood-bridged playlist transitions",
  },
  "Trend blind spot": {
    feature: "trending",
    featureLabel: "Trending Section",
    solution:
      "Surfaces what's rising in your library with AI explanations of why each track is spiking right now.",
    tagLabel: "Solved by Trending Section",
    tagClass: "bg-[#1DB954]/15 text-[#1DB954] ring-[#1DB954]/30",
    traditional: "Rule-based popularity charts",
    aiPowered: "Claude analyzes contextual momentum",
  },
  "Flow disruption": {
    feature: "shuffle",
    featureLabel: "Smart Shuffle",
    solution:
      "Generates a bridge track to ease transitions so switching playlists feels like a DJ mix, not a hard stop.",
    tagLabel: "Solved by Smart Shuffle",
    tagClass: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    traditional: "Instant playlist swap with no transition",
    aiPowered: "Energy-matched bridge tracks between moods",
  },
  "Generic AI recommendations": {
    feature: "trending",
    featureLabel: "Trending Section",
    solution:
      "Every trend card gets a one-sentence Claude explanation tied to tempo, mood, and real listening context.",
    tagLabel: "Solved by Trending Section",
    tagClass: "bg-[#1DB954]/15 text-[#1DB954] ring-[#1DB954]/30",
    traditional: "Generic \"fans also like\" collaborative filters",
    aiPowered: "Contextual AI explanations per track and moment",
  },
};

function InsightCard({
  insight,
  mapping,
  showComparison,
}: {
  insight: SurveyInsight;
  mapping: InsightMapping;
  showComparison: boolean;
}) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col rounded-xl border border-app-border bg-app-panel p-4 shadow-sm">
      <span
        className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${mapping.tagClass}`}
      >
        {mapping.tagLabel}
      </span>

      <blockquote className="flex-1 text-sm italic leading-relaxed text-app-muted">
        &ldquo;{insight.quote}&rdquo;
      </blockquote>

      <p className="mt-3 text-xs leading-relaxed text-app-subtle">
        <span className="font-medium text-app-text">{mapping.featureLabel}:</span>{" "}
        {mapping.solution}
      </p>

      <p className="mt-2 text-[10px] text-[#535353]">{insight.frequency}</p>

      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-app-border">
                  <th className="pb-2 pr-2 font-medium text-app-subtle">
                    Traditional Approach
                  </th>
                  <th className="pb-2 font-medium text-[#1DB954]">
                    AI-Powered Approach
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 pr-2 align-top text-[#535353]">
                    {mapping.traditional}
                  </td>
                  <td className="py-2 align-top font-medium text-[#1DB954]">
                    {mapping.aiPowered}
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function InsightsBanner() {
  const insights = getSurveyInsights();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section
      data-tour="insights-banner"
      className="mx-4 mb-4 mt-2 rounded-md border border-app-border bg-app-shell sm:mx-8"
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-app-chip/60"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#1DB954]" />
          <span className="text-sm font-medium text-app-muted">
            Research insights → product features
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-app-subtle" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-app-subtle" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 px-6 pb-6 pt-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-app-text">
                  📊 Built from 5 Real User Insights
                </h2>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showComparison}
                    onChange={(e) => setShowComparison(e.target.checked)}
                    className="h-4 w-4 rounded border-app-border bg-app-surface accent-[#1DB954]"
                  />
                  <span className="text-xs text-app-muted">
                    Show how AI solves this vs. traditional systems
                  </span>
                </label>
              </div>

              <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#333]">
                {insights.map((insight) => {
                  const mapping = INSIGHT_MAPPINGS[insight.pain];
                  if (!mapping) return null;

                  return (
                    <InsightCard
                      key={insight.pain}
                      insight={insight}
                      mapping={mapping}
                      showComparison={showComparison}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
