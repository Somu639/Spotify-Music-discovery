"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Track } from "@/types";

export type RepeatMode = "off" | "all" | "one";

function shuffleTracks<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

interface PlayerContextValue {
  queue: Track[];
  currentTrack: Track | null;
  currentIndex: number;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  shuffle: boolean;
  shuffleNoRepeat: boolean;
  repeat: RepeatMode;
  volume: number;
  likedIds: Set<string>;
  playTrack: (track: Track, queue?: Track[]) => void;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  playQueueShuffled: (tracks: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  toggleShuffle: () => void;
  toggleShuffleNoRepeat: () => void;
  cycleRepeat: () => void;
  setVolume: (v: number) => void;
  seek: (ms: number) => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function getTrackDurationMs(track: Track): number {
  return Math.round(180000 + track.tempo * 200 + track.energy * 60000);
}

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export { formatMs };

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedTrackIdRef = useRef<string | null>(null);
  const nextRef = useRef<() => void>(() => {});
  const repeatRef = useRef<RepeatMode>("off");
  const shuffleNoRepeatRef = useRef(false);
  const shuffleRemainingRef = useRef<number[]>([]);

  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const [audioDurationMs, setAudioDurationMs] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [shuffleNoRepeat, setShuffleNoRepeat] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [volume, setVolumeState] = useState(0.75);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const currentTrack = queue[currentIndex] ?? null;
  const durationMs =
    audioDurationMs > 0
      ? audioDurationMs
      : currentTrack
        ? getTrackDurationMs(currentTrack)
        : 0;

  repeatRef.current = repeat;
  shuffleNoRepeatRef.current = shuffleNoRepeat;

  const resetShuffleRemaining = useCallback(
    (queueLength: number, excludeIndex: number) => {
      shuffleRemainingRef.current = Array.from(
        { length: queueLength },
        (_, i) => i
      ).filter((i) => i !== excludeIndex);
    },
    []
  );

  const playQueue = useCallback(
    (tracks: Track[], startIndex = 0) => {
      if (!tracks.length) return;
      setQueue(tracks);
      setCurrentIndex(startIndex);
      setProgressMs(0);
      setIsPlaying(true);
      resetShuffleRemaining(tracks.length, startIndex);
    },
    [resetShuffleRemaining]
  );

  const playQueueShuffled = useCallback(
    (tracks: Track[]) => {
      if (!tracks.length) return;
      setShuffle(false);
      setShuffleNoRepeat(false);
      setRepeat("off");
      playQueue(shuffleTracks(tracks), 0);
    },
    [playQueue]
  );

  const playTrack = useCallback(
    (track: Track, newQueue?: Track[]) => {
      if (newQueue?.length) {
        const idx = newQueue.findIndex((t) => t.id === track.id);
        playQueue(newQueue, idx >= 0 ? idx : 0);
      } else if (queue.length && queue.some((t) => t.id === track.id)) {
        const idx = queue.findIndex((t) => t.id === track.id);
        setCurrentIndex(idx);
        setProgressMs(0);
        setIsPlaying(true);
      } else {
        playQueue([track], 0);
      }
    },
    [playQueue, queue]
  );

  const next = useCallback(() => {
    if (!queue.length) return;
    if (shuffle) {
      if (shuffleNoRepeatRef.current) {
        const remaining = shuffleRemainingRef.current.filter(
          (i) => i !== currentIndex
        );
        if (!remaining.length) {
          setIsPlaying(false);
          return;
        }
        const nextIndex =
          remaining[Math.floor(Math.random() * remaining.length)]!;
        shuffleRemainingRef.current = remaining.filter((i) => i !== nextIndex);
        setCurrentIndex(nextIndex);
        setProgressMs(0);
        return;
      }
      setCurrentIndex(Math.floor(Math.random() * queue.length));
      setProgressMs(0);
      return;
    }
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgressMs(0);
    } else if (repeat === "all") {
      setCurrentIndex(0);
      setProgressMs(0);
      resetShuffleRemaining(queue.length, 0);
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, queue.length, repeat, shuffle, resetShuffleRemaining]);

  nextRef.current = next;

  const prev = useCallback(() => {
    if (progressMs > 3000) {
      setProgressMs(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgressMs(0);
    }
  }, [progressMs, currentIndex]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const seek = useCallback(
    (ms: number) => {
      const clamped = Math.max(0, Math.min(durationMs || ms, ms));
      setProgressMs(clamped);
      if (audioRef.current) {
        audioRef.current.currentTime = clamped / 1000;
      }
    },
    [durationMs]
  );

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.75;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setProgressMs(Math.floor(audio.currentTime * 1000));
    };

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setAudioDurationMs(Math.floor(audio.duration * 1000));
      }
    };

    const onEnded = () => {
      if (repeatRef.current === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }
      nextRef.current();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
      loadedTrackIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const track = currentTrack;
    let cancelled = false;

    async function loadTrackAudio() {
      const { resolvePreviewUrl } = await import("@/lib/audio-previews");
      const previewUrl = await resolvePreviewUrl(track);

      if (cancelled || !previewUrl) {
        if (!cancelled) setIsPlaying(false);
        return;
      }

      const player = audioRef.current;
      if (!player || cancelled) return;

      if (loadedTrackIdRef.current !== track.id) {
        loadedTrackIdRef.current = track.id;
        player.src = previewUrl;
        player.load();
        setProgressMs(0);
        setAudioDurationMs(0);
      }

      if (isPlaying) {
        player.play().catch(() => setIsPlaying(false));
      } else {
        player.pause();
      }
    }

    void loadTrackAudio();

    return () => {
      cancelled = true;
    };
  }, [currentTrack, isPlaying]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      queue,
      currentTrack,
      currentIndex,
      isPlaying,
      progressMs,
      durationMs,
      shuffle,
      shuffleNoRepeat,
      repeat,
      volume,
      likedIds,
      playTrack,
      playQueue,
      playQueueShuffled,
      togglePlay: () => setIsPlaying((p) => !p),
      pause: () => setIsPlaying(false),
      next,
      prev,
      toggleShuffle: () =>
        setShuffle((s) => {
          const nextShuffle = !s;
          if (!nextShuffle) {
            setShuffleNoRepeat(false);
          } else if (queue.length) {
            resetShuffleRemaining(queue.length, currentIndex);
          }
          return nextShuffle;
        }),
      toggleShuffleNoRepeat: () =>
        setShuffleNoRepeat((enabled) => {
          const nextEnabled = !enabled;
          if (nextEnabled) {
            setShuffle(true);
            if (queue.length) {
              resetShuffleRemaining(queue.length, currentIndex);
            }
          }
          return nextEnabled;
        }),
      cycleRepeat: () =>
        setRepeat((r) =>
          r === "off" ? "all" : r === "all" ? "one" : "off"
        ),
      setVolume,
      seek,
      toggleLike: (id) =>
        setLikedIds((prev) => {
          const updated = new Set(prev);
          if (updated.has(id)) updated.delete(id);
          else updated.add(id);
          return updated;
        }),
      isLiked: (id) => likedIds.has(id),
    }),
    [
      queue,
      currentTrack,
      currentIndex,
      isPlaying,
      progressMs,
      durationMs,
      shuffle,
      shuffleNoRepeat,
      repeat,
      volume,
      likedIds,
      playTrack,
      playQueue,
      playQueueShuffled,
      next,
      prev,
      setVolume,
      seek,
      currentIndex,
      queue.length,
      resetShuffleRemaining,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
