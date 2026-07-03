"use client";

import {
  ChevronDown,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Square,
  ListMusic,
} from "lucide-react";
import { formatMs, usePlayer } from "@/lib/player-context";

export function NowPlayingView() {
  const {
    currentTrack,
    isPlaying,
    progressMs,
    durationMs,
    shuffle,
    shuffleNoRepeat,
    repeat,
    nowPlayingExpanded,
    setNowPlayingExpanded,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    toggleShuffleNoRepeat,
    cycleRepeat,
    seek,
    stopPlayback,
    playQueueShuffled,
    queue,
  } = usePlayer();

  if (!nowPlayingExpanded || !currentTrack) return null;

  const progressPct = durationMs ? (progressMs / durationMs) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-gradient-to-b from-[#1a1a1a] via-app-bg to-black"
      role="dialog"
      aria-label="Now playing"
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => setNowPlayingExpanded(false)}
          className="flex items-center gap-1 text-sm font-semibold text-app-muted hover:text-app-text"
          aria-label="Minimize player"
        >
          <ChevronDown className="h-5 w-5" />
          Minimize
        </button>
        <p className="text-xs font-bold uppercase tracking-wider text-app-subtle">
          Now playing
        </p>
        <button
          type="button"
          onClick={stopPlayback}
          className="flex items-center gap-1 text-sm font-semibold text-app-muted hover:text-app-text"
          aria-label="Stop playback"
        >
          <Square className="h-4 w-4 fill-current" />
          Stop
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
        <img
          src={currentTrack.coverUrl}
          alt=""
          className="mb-8 h-64 w-64 rounded-lg object-cover shadow-2xl sm:h-80 sm:w-80"
        />
        <div className="w-full max-w-md text-center">
          <h2 className="truncate text-2xl font-bold text-app-text sm:text-3xl">
            {currentTrack.title}
          </h2>
          <p className="mt-1 truncate text-lg text-app-muted">{currentTrack.artist}</p>
          <p className="mt-1 text-sm text-app-subtle">{currentTrack.album}</p>
        </div>

        <div className="mt-8 w-full max-w-md">
          <div className="flex items-center gap-3">
            <span className="w-10 text-right text-xs text-app-muted">
              {formatMs(progressMs)}
            </span>
            <input
              type="range"
              min={0}
              max={durationMs || 1}
              value={progressMs}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-[#1DB954]"
              style={{
                background: `linear-gradient(to right, #1DB954 ${progressPct}%, #404040 ${progressPct}%)`,
              }}
              aria-label="Seek"
            />
            <span className="w-10 text-xs text-app-muted">{formatMs(durationMs)}</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-5 sm:gap-8">
          <button type="button" onClick={toggleShuffle} aria-label="Shuffle">
            <Shuffle
              className={`h-5 w-5 ${shuffle ? "text-[#1DB954]" : "text-app-muted hover:text-app-text"}`}
            />
          </button>
          <button
            type="button"
            onClick={toggleShuffleNoRepeat}
            aria-label="Shuffle without repeat"
            title="Shuffle without repeat"
            className={shuffleNoRepeat ? "text-[#1DB954]" : "text-app-muted hover:text-app-text"}
          >
            <ListMusic className="h-5 w-5" />
          </button>
          <button type="button" onClick={prev} aria-label="Previous">
            <SkipBack className="h-7 w-7 fill-app-text text-app-text" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954] text-black transition hover:scale-105 hover:bg-[#1ed760]"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 fill-black" />
            ) : (
              <Play className="h-8 w-8 fill-black pl-1" />
            )}
          </button>
          <button type="button" onClick={next} aria-label="Next">
            <SkipForward className="h-7 w-7 fill-app-text text-app-text" />
          </button>
          <button type="button" onClick={cycleRepeat} aria-label="Repeat">
            {repeat === "one" ? (
              <Repeat1 className="h-5 w-5 text-[#1DB954]" />
            ) : (
              <Repeat
                className={`h-5 w-5 ${repeat === "all" ? "text-[#1DB954]" : "text-app-muted hover:text-app-text"}`}
              />
            )}
          </button>
        </div>

        {queue.length > 1 && (
          <button
            type="button"
            onClick={() => playQueueShuffled(queue)}
            className="mt-8 flex items-center gap-2 rounded-full border border-app-border bg-app-surface px-5 py-2.5 text-sm font-semibold text-app-text hover:bg-app-elevated"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle queue ({queue.length} songs)
          </button>
        )}
      </div>
    </div>
  );
}
