"use client";

import TrendingSection from "@/components/trending/TrendingSection";
import { InsightsBanner } from "@/components/survey/InsightsBanner";
import { HomeView } from "@/components/home/HomeView";
import { FriendsFamilySection } from "@/components/library/FriendsFamilySection";
import { MusicSection } from "@/components/library/MusicSection";
import { PodcastsSection } from "@/components/library/PodcastsSection";
import type { ContentTab } from "@/types";

interface TabContentProps {
  activeTab: ContentTab;
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string) => void;
  onClearPlaylist: () => void;
  onSimulateLoop: () => void;
  simulated: boolean;
  onResetSimulation: () => void;
}

function TabHeader({
  title,
  subtitle,
  gradient = "from-violet-900/40",
}: {
  title: string;
  subtitle?: string;
  gradient?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-b ${gradient} to-app-bg px-4 pb-4 pt-6 sm:px-8`}
    >
      <h1 className="text-3xl font-bold text-app-text">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-app-muted">{subtitle}</p>}
    </div>
  );
}

export function TabContent({
  activeTab,
  selectedPlaylistId,
  onSelectPlaylist,
  onClearPlaylist,
  onSimulateLoop,
  simulated,
  onResetSimulation,
}: TabContentProps) {
  switch (activeTab) {
    case "all":
      return <HomeView />;

    case "music":
      return (
        <>
          <TabHeader
            title="Music"
            subtitle="Your full library"
            gradient="from-blue-900/40"
          />
          <MusicSection selectedPlaylistId={selectedPlaylistId} />
        </>
      );

    case "trending":
      return (
        <>
          <TabHeader
            title="Trending"
            subtitle="AI-powered discovery — why tracks spike"
            gradient="from-purple-900/40"
          />
          <div id="insights">
            <InsightsBanner />
          </div>
          <div id="trending">
            <TrendingSection />
          </div>
          <section id="smart-shuffle" className="px-4 py-6 sm:px-8">
            <h2 className="text-xl font-bold text-app-text">Smart Shuffle</h2>
            <p className="mt-1 text-sm text-app-muted">
              AI detects loops and bridges you to a fresh playlist
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={onSimulateLoop}
                className="rounded-full bg-[#1DB954] px-5 py-2 text-sm font-bold text-black hover:scale-105"
              >
                Simulate repetition loop
              </button>
              {simulated && (
                <button
                  type="button"
                  onClick={onResetSimulation}
                  className="rounded-full border border-app-border px-5 py-2 text-sm text-app-text hover:border-app-text"
                >
                  Reset
                </button>
              )}
            </div>
          </section>
        </>
      );

    case "friends":
      return (
        <>
          <TabHeader
            title="Sync F&F Playlist"
            subtitle="Playlists shared from friends & family"
            gradient="from-neutral-800/50"
          />
          <FriendsFamilySection
            selectedPlaylistId={selectedPlaylistId}
            onSelectPlaylist={onSelectPlaylist}
            onClearPlaylist={onClearPlaylist}
          />
        </>
      );

    case "podcasts":
      return (
        <>
          <TabHeader title="Podcast" gradient="from-fuchsia-900/40" />
          <PodcastsSection />
        </>
      );

    default:
      return <HomeView />;
  }
}
