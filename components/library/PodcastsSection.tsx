"use client";

import { Mic2, Pause, Play } from "lucide-react";
import { getPodcasts, podcastToTrack } from "@/lib/spotify-mock";
import { usePlayer } from "@/lib/player-context";

export function PodcastsSection() {
  const podcasts = getPodcasts();
  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay } =
    usePlayer();
  const podTracks = podcasts.map(podcastToTrack);

  return (
    <section className="px-4 py-6 sm:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-app-text sm:text-3xl">Podcasts</h2>
          <p className="mt-1 text-sm text-app-muted">
            Shows and episodes in your discovery feed
          </p>
        </div>
        <button
          type="button"
          onClick={() => playQueue(podTracks, 0)}
          className="rounded-full bg-[#1DB954] px-6 py-2.5 text-sm font-bold text-black hover:scale-105"
        >
          Play all episodes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {podcasts.map((pod) => {
          const track = podcastToTrack(pod);
          const isCurrent = currentTrack?.id === track.id;
          const playing = isCurrent && isPlaying;

          return (
            <article
              key={pod.id}
              className={`group flex gap-4 rounded-lg p-4 transition ${
                isCurrent ? "bg-[#1DB954]/15 ring-1 ring-[#1DB954]/30" : "border border-app-border bg-app-panel hover:bg-app-surface"
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={pod.coverUrl}
                  alt={pod.show}
                  className="h-20 w-20 rounded-md object-cover sm:h-24 sm:w-24"
                />
                <button
                  type="button"
                  onClick={() =>
                    isCurrent ? togglePlay() : playTrack(track, podTracks)
                  }
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-lg transition group-hover:opacity-100 hover:scale-105"
                  aria-label={`Play ${pod.title}`}
                >
                  {playing ? (
                    <Pause className="h-4 w-4 fill-black" />
                  ) : (
                    <Play className="h-4 w-4 fill-black pl-0.5" />
                  )}
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#1DB954]">
                  <Mic2 className="h-3 w-3" />
                  {pod.category}
                </div>
                <h3
                  className={`mt-1 line-clamp-2 font-bold ${isCurrent ? "text-[#1DB954]" : "text-app-text"}`}
                >
                  {pod.title}
                </h3>
                <p className="mt-0.5 truncate text-sm text-app-muted">
                  {pod.show} · {pod.host}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-[#727272]">
                  {pod.description}
                </p>
                <p className="mt-2 text-xs text-[#535353]">{pod.duration}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
