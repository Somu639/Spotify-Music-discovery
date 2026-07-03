"use client";

import {
  Heart,
  Mic2,
  Monitor,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  ListMusic,
  Volume2,
  VolumeX,
} from "lucide-react";
import { formatMs, usePlayer } from "@/lib/player-context";

export function SpotifyPlayer() {
  const {
    currentTrack,
    isPlaying,
    progressMs,
    durationMs,
    shuffle,
    shuffleNoRepeat,
    repeat,
    volume,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    toggleShuffleNoRepeat,
    cycleRepeat,
    setVolume,
    seek,
    toggleLike,
    isLiked,
  } = usePlayer();

  const progressPct = durationMs ? (progressMs / durationMs) * 100 : 0;
  const volumePct = Math.round((volume ?? 0.75) * 100);
  const muted = volumePct === 0;

  return (
    <footer className="fixed bottom-0 inset-x-0 z-50 h-[90px] border-t border-app-border bg-app-panel px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.45)] sm:px-4">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {currentTrack ? (
            <>
              <img
                src={currentTrack.coverUrl}
                alt=""
                className="h-14 w-14 shrink-0 rounded object-cover shadow-sm"
              />
              <div className="min-w-0">
                <p className="truncate text-sm text-app-text hover:underline">
                  {currentTrack.title}
                </p>
                <p className="truncate text-xs text-app-muted hover:underline">
                  {currentTrack.artist}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleLike(currentTrack.id)}
                className="shrink-0"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked(currentTrack.id)
                      ? "fill-[#1DB954] text-[#1DB954]"
                      : "text-app-muted hover:text-app-text"
                  }`}
                />
              </button>
            </>
          ) : (
            <p className="text-xs text-app-subtle sm:text-sm">
              Select a song to play
            </p>
          )}
        </div>

        <div className="flex max-w-[720px] flex-col items-center gap-1">
          <div className="flex items-center gap-4 sm:gap-5">
            <button type="button" onClick={toggleShuffle} aria-label="Shuffle">
              <Shuffle
                className={`h-4 w-4 ${shuffle ? "text-[#1DB954]" : "text-app-muted hover:text-app-text"}`}
              />
            </button>
            <button
              type="button"
              onClick={toggleShuffleNoRepeat}
              aria-label="Shuffle without repeat"
              title="Shuffle without repeat — each song plays once"
              className={shuffleNoRepeat ? "text-[#1DB954]" : "text-app-muted hover:text-app-text"}
            >
              <ListMusic className="h-4 w-4" />
            </button>
            <button type="button" onClick={prev} aria-label="Previous">
              <SkipBack className="h-5 w-5 fill-app-text text-app-text hover:scale-110" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              disabled={!currentTrack}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-40"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-black" />
              ) : (
                <Play className="h-5 w-5 fill-black pl-0.5" />
              )}
            </button>
            <button type="button" onClick={next} aria-label="Next">
              <SkipForward className="h-5 w-5 fill-app-text text-app-text hover:scale-110" />
            </button>
            <button type="button" onClick={cycleRepeat} aria-label="Repeat">
              {repeat === "one" ? (
                <Repeat1 className="h-4 w-4 text-[#1DB954]" />
              ) : (
                <Repeat
                  className={`h-4 w-4 ${repeat === "all" ? "text-[#1DB954]" : "text-app-muted hover:text-app-text"}`}
                />
              )}
            </button>
          </div>
          <div className="flex w-full min-w-[200px] items-center gap-2 sm:min-w-[400px]">
            <span className="w-10 text-right text-[11px] text-app-muted">
              {formatMs(progressMs)}
            </span>
            <input
              type="range"
              min={0}
              max={durationMs || 1}
              value={progressMs}
              disabled={!currentTrack}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-app-elevated accent-[#1DB954] disabled:opacity-40"
              style={{
                background: `linear-gradient(to right, #1DB954 ${progressPct}%, #e5e5ea ${progressPct}%)`,
              }}
              aria-label="Seek"
            />
            <span className="w-10 text-[11px] text-app-muted">
              {formatMs(durationMs)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <Mic2 className="hidden h-4 w-4 text-app-muted sm:block" />
          <Monitor className="hidden h-4 w-4 text-app-muted sm:block" />
          <button
            type="button"
            onClick={() => setVolume(muted ? 0.75 : 0)}
            aria-label={muted ? "Unmute" : "Mute"}
            className="text-app-muted hover:text-app-text"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volumePct}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-app-elevated accent-[#1DB954] sm:w-24"
            style={{
              background: `linear-gradient(to right, #1DB954 ${volumePct}%, #e5e5ea ${volumePct}%)`,
            }}
            aria-label="Volume"
          />
        </div>
      </div>
    </footer>
  );
}
