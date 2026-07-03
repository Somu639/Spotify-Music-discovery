"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SmartShuffleBar } from "@/components/shuffle/SmartShuffleBar";
import { DemoWalkthrough } from "@/components/DemoWalkthrough";
import { LibrarySidebar, MainHeader } from "@/components/layout/LibrarySidebar";
import { ContentTabBar } from "@/components/layout/ContentTabBar";
import { TabContent } from "@/components/layout/TabContent";
import { SpotifyPlayer } from "@/components/layout/SpotifyPlayer";
import { NowPlayingView } from "@/components/layout/NowPlayingView";
import { PlayerProvider } from "@/lib/player-context";
import { SyncProvider } from "@/lib/sync-context";
import { isContentTab } from "@/lib/content-tabs";
import type { ContentTab } from "@/types";

const VARIED_PLAY_HISTORY = ["ln-1", "ln-2", "ln-3", "ln-4", "ln-5"];
const SIMULATE_LOOP_HISTORY = [
  "track-1", "track-2", "track-1", "track-2",
  "track-1", "track-2", "track-1",
];

function AppShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mainRef = useRef<HTMLElement>(null);

  const tabFromUrl = searchParams.get("tab");
  const playlistFromUrl = searchParams.get("playlist");

  const [activeTab, setActiveTab] = useState<ContentTab>(
    isContentTab(tabFromUrl) ? tabFromUrl : "all"
  );
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    playlistFromUrl
  );
  const [currentPlaylistId, setCurrentPlaylistId] = useState("late-night-coding");
  const [playHistory, setPlayHistory] = useState<string[]>(VARIED_PLAY_HISTORY);
  const [simulated, setSimulated] = useState(false);

  useEffect(() => {
    const nextTab = isContentTab(tabFromUrl) ? tabFromUrl : "all";
    setActiveTab(nextTab);
    setSelectedPlaylistId(playlistFromUrl);
  }, [tabFromUrl, playlistFromUrl]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab]);

  const switchTab = useCallback(
    (tab: ContentTab, playlistId?: string | null) => {
      setActiveTab(tab);
      if (playlistId !== undefined) {
        setSelectedPlaylistId(playlistId);
      } else {
        setSelectedPlaylistId(null);
      }

      const params = new URLSearchParams();
      if (tab !== "all") params.set("tab", tab);
      if (playlistId) params.set("playlist", playlistId);
      const query = params.toString();
      router.replace(query ? `/?${query}` : "/", { scroll: false });

      requestAnimationFrame(() => {
        mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
      });
    },
    [router]
  );

  const handleTabClick = useCallback(
    (tab: ContentTab) => switchTab(tab),
    [switchTab]
  );

  const handleSimulateLoop = () => {
    setCurrentPlaylistId("morning-energy");
    setPlayHistory(SIMULATE_LOOP_HISTORY);
    setSimulated(true);
    switchTab("trending");
  };

  const handleResetSimulation = () => {
    setPlayHistory(VARIED_PLAY_HISTORY);
    setCurrentPlaylistId("late-night-coding");
    setSimulated(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-black">
      <div className="flex min-h-0 flex-1 gap-2 p-2">
        <LibrarySidebar
          activeTab={activeTab}
          onTabChange={switchTab}
          selectedPlaylistId={selectedPlaylistId}
          onSelectPlaylist={(id) => switchTab("music", id)}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-app-bg">
          <MainHeader />

          <main
            ref={mainRef}
            className="spotify-scroll relative z-0 flex-1 overflow-y-auto pb-24 md:pb-28"
          >
            <TabContent
              activeTab={activeTab}
              selectedPlaylistId={selectedPlaylistId}
              onSelectPlaylist={(id) => switchTab("music", id)}
              onClearPlaylist={() => switchTab("friends", null)}
              onSimulateLoop={handleSimulateLoop}
              simulated={simulated}
              onResetSimulation={handleResetSimulation}
            />
          </main>
        </div>
      </div>

      <ContentTabBar
        activeTab={activeTab}
        onTabChange={handleTabClick}
        variant="mobile"
      />
      <SpotifyPlayer />
      <NowPlayingView />
      <SmartShuffleBar
        currentPlaylistId={currentPlaylistId}
        playHistory={playHistory}
        onPlaylistChange={setCurrentPlaylistId}
      />
      <DemoWalkthrough />
    </div>
  );
}

function PageFallback() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center bg-app-bg text-app-muted">
      Loading…
    </div>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <SyncProvider>
        <Suspense fallback={<PageFallback />}>
          <AppShell />
        </Suspense>
      </SyncProvider>
    </PlayerProvider>
  );
}
