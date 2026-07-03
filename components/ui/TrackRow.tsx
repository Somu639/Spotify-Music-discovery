"use client";

import { Pause, Play } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import type { Track } from "@/types";

interface TrackRowProps {
  track: Track;
  index: number;
  queue?: Track[];
  showAlbum?: boolean;
  showGenre?: boolean;
}

export function TrackRow({
  track,
  index,
  queue,
  showAlbum = true,
  showGenre = true,
}: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, setNowPlayingExpanded } =
    usePlayer();
  const isCurrent = currentTrack?.id === track.id;
  const playing = isCurrent && isPlaying;

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
    setNowPlayingExpanded(true);
  };

  return (
    <tr
      className={`group border-b border-app-border transition ${
        isCurrent ? "bg-[#1DB954]/15" : "hover:bg-app-surface"
      }`}
    >
      <td className="px-4 py-2 text-center text-app-subtle">
        <div className="relative flex h-4 w-4 items-center justify-center mx-auto">
          {playing ? (
            <button
              type="button"
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Pause className="h-4 w-4 fill-[#1DB954] text-[#1DB954]" />
            </button>
          ) : isCurrent ? (
            <button
              type="button"
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Play className="h-4 w-4 fill-[#1DB954] text-[#1DB954]" />
            </button>
          ) : (
            <>
              <span className="text-sm group-hover:invisible">{index + 1}</span>
              <button
                type="button"
                onClick={handlePlay}
                className="absolute inset-0 invisible flex items-center justify-center group-hover:visible"
              >
                <Play className="h-4 w-4 fill-app-text text-app-text" />
              </button>
            </>
          )}
        </div>
      </td>
      <td className="px-4 py-2">
        <button
          type="button"
          onClick={handlePlay}
          className="flex w-full items-center gap-3 text-left"
        >
          <img
            src={track.coverUrl}
            alt=""
            className="h-10 w-10 rounded object-cover"
          />
          <div className="min-w-0">
            <p
              className={`truncate font-medium ${isCurrent ? "text-[#1DB954]" : "text-app-text"}`}
            >
              {track.title}
            </p>
            <p className="truncate text-xs text-app-muted">{track.artist}</p>
          </div>
        </button>
      </td>
      {showAlbum && (
        <td className="hidden truncate px-4 py-2 text-app-muted sm:table-cell">
          {track.album}
        </td>
      )}
      {showGenre && (
        <td className="hidden px-4 py-2 text-app-subtle md:table-cell">
          {track.genre}
        </td>
      )}
    </tr>
  );
}
