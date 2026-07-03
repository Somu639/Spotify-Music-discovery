"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getAllPlaylists,
  getPlaylistById,
  getRepetitionWarning,
} from "@/lib/spotify-mock";
import type { Playlist, ShuffleRecommendation, Track } from "@/types";
import { ClaudeLoadingBlock } from "@/components/ui/ClaudeLoading";
import { PlaylistSwitcher } from "./PlaylistSwitcher";

interface SmartShuffleBarProps {
  currentPlaylistId: string;
  playHistory: string[];
  onPlaylistChange?: (playlistId: string) => void;
}

function hasPlayHistoryLoop(playHistory: string[]): boolean {
  const recent = playHistory.slice(-10);
  if (recent.length === 0) return false;

  const counts = recent.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] ?? 0) + 1;
    return acc;
  }, {});

  return Math.max(...Object.values(counts)) > 3;
}

function findTrackById(trackId: string): Track | undefined {
  return getAllPlaylists()
    .flatMap((playlist) => playlist.tracks)
    .find((track) => track.id === trackId);
}

function resolveLastTrack(
  playHistory: string[],
  currentPlaylist: Playlist
): Track {
  const demoIdMap: Record<string, string> = {
    "track-1": "me-1",
    "track-2": "me-2",
  };

  const lastId = playHistory[playHistory.length - 1];
  if (lastId) {
    const mappedId = demoIdMap[lastId] ?? lastId;
    const fromHistory = findTrackById(mappedId);
    if (fromHistory) return fromHistory;
  }

  return [...currentPlaylist.tracks].sort(
    (a, b) => b.playCount - a.playCount
  )[0];
}

function parseSuggestedPlaylist(
  suggestion: string,
  currentPlaylistId: string
): Playlist {
  const alternatives = getAllPlaylists().filter(
    (p) => p.id !== currentPlaylistId
  );

  const byName = [...alternatives]
    .sort((a, b) => b.name.length - a.name.length)
    .find((p) =>
      suggestion.toLowerCase().includes(p.name.toLowerCase())
    );

  if (byName) return byName;

  const byMood = alternatives.find((p) =>
    suggestion.toLowerCase().includes(p.mood.toLowerCase())
  );

  return byMood ?? alternatives[0];
}

async function fetchRepetitionSuggestion(
  playlist: Playlist,
  playHistory: string[]
): Promise<string> {
  const response = await fetch("/api/claude/detect-repetition", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playlist, playHistory }),
  });

  if (!response.ok) throw new Error("Failed to detect repetition");

  const data = (await response.json()) as { suggestion: string };
  return data.suggestion;
}

async function fetchShuffleBridge(
  currentPlaylist: Playlist,
  targetPlaylist: Playlist,
  lastTrack: Track
): Promise<ShuffleRecommendation> {
  const response = await fetch("/api/claude/shuffle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentPlaylist,
      targetPlaylist,
      lastTrack,
    }),
  });

  if (!response.ok) throw new Error("Failed to generate bridge");

  const { bridgeTrackId, reason } = (await response.json()) as {
    bridgeTrackId: string;
    reason: string;
  };

  const bridgeTrack =
    targetPlaylist.tracks.find((t) => t.id === bridgeTrackId) ??
    targetPlaylist.tracks[0];

  return {
    fromPlaylist: currentPlaylist.name,
    toPlaylist: targetPlaylist.name,
    bridgeTrack,
    reason,
  };
}

export function SmartShuffleBar({
  currentPlaylistId,
  playHistory,
  onPlaylistChange,
}: SmartShuffleBarProps) {
  const currentPlaylist = getPlaylistById(currentPlaylistId);

  const [hasWarning, setHasWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [targetPlaylistId, setTargetPlaylistId] = useState("");
  const [bridge, setBridge] = useState<ShuffleRecommendation | null>(null);
  const [showBridge, setShowBridge] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const runAnalysis = useCallback(async () => {
    if (!currentPlaylist) return;

    const warning =
      getRepetitionWarning(currentPlaylistId) ||
      hasPlayHistoryLoop(playHistory);
    setHasWarning(warning);

    if (!warning) return;

    setIsAnalyzing(true);

    try {
      const suggestion = await fetchRepetitionSuggestion(
        currentPlaylist,
        playHistory
      );
      setAiSuggestion(suggestion);

      const target = parseSuggestedPlaylist(suggestion, currentPlaylistId);
      setTargetPlaylistId(target.id);

      const lastTrack = resolveLastTrack(playHistory, currentPlaylist);
      const bridgeResult = await fetchShuffleBridge(
        currentPlaylist,
        target,
        lastTrack
      );
      setBridge(bridgeResult);
    } catch {
      const fallbackTarget =
        getAllPlaylists().find((p) => p.id !== currentPlaylistId) ??
        getAllPlaylists()[0];
      setTargetPlaylistId(fallbackTarget.id);
      setAiSuggestion(
        `Try switching to "${fallbackTarget.name}" — same ${fallbackTarget.mood} energy with a fresher tracklist.`
      );

      const lastTrack = resolveLastTrack(playHistory, currentPlaylist);
      const bridgeResult = await fetchShuffleBridge(
        currentPlaylist,
        fallbackTarget,
        lastTrack
      );
      setBridge(bridgeResult);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentPlaylist, currentPlaylistId, playHistory]);

  useEffect(() => {
    setDismissed(false);
    setShowBridge(false);
    setBridge(null);
    runAnalysis();
  }, [runAnalysis]);

  const handleSwitchPlaylist = async () => {
    if (!currentPlaylist || !targetPlaylistId) return;

    setIsSwitching(true);

    try {
      const target = getPlaylistById(targetPlaylistId);
      if (!target) return;

      const lastTrack = resolveLastTrack(playHistory, currentPlaylist);
      const bridgeResult = await fetchShuffleBridge(
        currentPlaylist,
        target,
        lastTrack
      );
      setBridge(bridgeResult);
      setShowBridge(true);
      onPlaylistChange?.(targetPlaylistId);
    } finally {
      setIsSwitching(false);
    }
  };

  const targetPlaylist = getPlaylistById(targetPlaylistId);
  const showRepetitionUi = hasWarning && !dismissed;

  if (!currentPlaylist) return null;

  if (!showRepetitionUi) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="repetition-warning"
          data-tour="smart-shuffle"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed bottom-[90px] left-0 right-0 z-40 max-h-[50vh] overflow-y-auto border-t border-amber-500/20 bg-app-panel shadow-2xl md:left-[280px]"
        >
          <div className="space-y-4 px-4 py-4 sm:px-6">
            <div className="rounded-lg bg-amber-500/10 px-4 py-3 ring-1 ring-amber-500/30">
              <p className="text-sm font-semibold text-amber-400">
                🔄 You&apos;ve been looping the same tracks
              </p>
            </div>

            {isAnalyzing ? (
              <ClaudeLoadingBlock message="Claude is analyzing your listening loop..." />
            ) : aiSuggestion ? (
              <p className="text-sm leading-relaxed text-app-muted">
                {aiSuggestion}
              </p>
            ) : (
              <p className="text-sm text-app-subtle">
                Waiting for Claude repetition analysis…
              </p>
            )}

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-app-subtle">
                Switch to
              </p>
              <PlaylistSwitcher
                selectedId={targetPlaylistId}
                onSelect={setTargetPlaylistId}
                excludeId={currentPlaylistId}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSwitchPlaylist}
                disabled={isAnalyzing || isSwitching || !targetPlaylistId}
                className="rounded-full bg-[#1DB954] px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-50"
              >
                {isSwitching ? "Generating mood bridge…" : "Switch Playlist"}
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="rounded-full px-6 py-2.5 text-sm font-medium text-app-text ring-1 ring-app-border transition hover:bg-app-shell"
              >
                Keep Playing
              </button>
            </div>

            <AnimatePresence>
              {showBridge && bridge && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-4 rounded-xl border border-[#1DB954]/40 bg-[#1DB954]/10 p-4">
                    <img
                      src={bridge.bridgeTrack.coverUrl}
                      alt={bridge.bridgeTrack.title}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-app-text">
                        {bridge.bridgeTrack.title}
                      </p>
                      <p className="text-xs text-app-muted">
                        {bridge.bridgeTrack.artist}
                      </p>
                      <p className="mt-2 text-xs italic text-[#1DB954]">
                        Starting with {bridge.bridgeTrack.title} to ease your
                        transition from {currentPlaylist.mood} →{" "}
                        {targetPlaylist?.mood ?? bridge.toPlaylist}
                      </p>
                      <p className="mt-1 text-xs text-[#727272]">
                        {bridge.reason}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
