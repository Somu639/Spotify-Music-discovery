"use client";

import { useCallback, useState } from "react";
import {
  detectRepetitionAndSuggest,
  explainTrend,
  generateShuffleBridge,
} from "@/lib/claude";
import type { Playlist, ShuffleRecommendation, Track } from "@/types";

export function useExplainTrend() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const explain = useCallback(
    async (track: Track, trendScore: number): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        return await explainTrend(track, trendScore);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to explain trend";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { explainTrend: explain, isLoading, error };
}

export function useShuffleBridge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shuffle = useCallback(
    async (
      currentPlaylist: Playlist,
      targetPlaylist: Playlist,
      lastTrack: Track
    ): Promise<ShuffleRecommendation> => {
      setIsLoading(true);
      setError(null);
      try {
        return await generateShuffleBridge(
          currentPlaylist,
          targetPlaylist,
          lastTrack
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to generate bridge";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { generateShuffleBridge: shuffle, isLoading, error };
}

export function useDetectRepetition() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(
    async (playlist: Playlist, playHistory: string[]): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        return await detectRepetitionAndSuggest(playlist, playHistory);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to detect repetition";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { detectRepetitionAndSuggest: detect, isLoading, error };
}

export function useClaudeInsights() {
  const explain = useExplainTrend();
  const shuffle = useShuffleBridge();
  const repetition = useDetectRepetition();

  return {
    explainTrend: explain.explainTrend,
    explainTrendLoading: explain.isLoading,
    explainTrendError: explain.error,

    generateShuffleBridge: shuffle.generateShuffleBridge,
    shuffleBridgeLoading: shuffle.isLoading,
    shuffleBridgeError: shuffle.error,

    detectRepetitionAndSuggest: repetition.detectRepetitionAndSuggest,
    repetitionLoading: repetition.isLoading,
    repetitionError: repetition.error,
  };
}
