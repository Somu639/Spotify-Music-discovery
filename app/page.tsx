"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SmartShuffleBar } from "@/components/shuffle/SmartShuffleBar";
import { DemoWalkthrough } from "@/components/DemoWalkthrough";
import { LibrarySidebar, MainHeader } from "@/components/layout/LibrarySidebar";
import { ContentTabBar } from "@/components/layout/ContentTabBar";
import { CreatePlaylistModal } from "@/components/library/CreatePlaylistModal";
import { SearchResults } from "@/components/search/SearchResults";
import { TabContent } from "@/components/layout/TabContent";
import { SpotifyPlayer } from "@/components/layout/SpotifyPlayer";
import { NowPlayingView } from "@/components/layout/NowPlayingView";
import { PlayerProvider } from "@/lib/player-context";
import { PlaylistsProvider, usePlaylists } from "@/lib/playlists-context";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const { createPlaylist } = usePlaylists();

  const trimmedSearch = searchQuery.trim();

  useEffect(() => {
    const nextTab = isContentTab(tabFromUrl) ? tabFromUrl : "all";
    setActiveTab(nextTab);
    setSelectedPlaylistId(playlistFromUrl);
  }, [tabFromUrl, playlistFromUrl]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab, trimmedSearch]);

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
    (tab: ContentTab) => {
      setSearchQuery("");
      switchTab(tab);
    },
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

  const handleCreatePlaylist = (name: string) => {
    const playlist = createPlaylist(name);
    setSearchQuery("");
    setCreatePlaylistOpen(false);
    switchTab("music", playlist.id);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-black">
      <div className="flex min-h-0 flex-1 gap-2 p-2">
        <LibrarySidebar
          activeTab={activeTab}
          onTabChange={switchTab}
          selectedPlaylistId={selectedPlaylistId}
          onSelectPlaylist={(id) => switchTab("music", id)}
          onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}
        />

        <div className="relative flex min-w-0 flex-1 flex-col rounded-lg border-l-[3px] border-app-accent-purple/70 bg-app-bg shadow-[inset_0_1px_0_0_rgba(168,85,247,0.15)]">
          <div className="relative z-50 shrink-0">
            <MainHeader
              activeTab={activeTab}
              onTabChange={handleTabClick}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <main
            ref={mainRef}
            className="spotify-scroll relative z-0 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-24 md:pb-28"
          >
            {trimmedSearch ? (
              <SearchResults query={trimmedSearch} />
            ) : (
              <TabContent
                activeTab={activeTab}
                selectedPlaylistId={selectedPlaylistId}
                onSelectPlaylist={(id) =>
                  switchTab(activeTab === "friends" ? "friends" : "music", id)
                }
                onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)}
                onClearPlaylist={() => switchTab("friends", null)}
                onSimulateLoop={handleSimulateLoop}
                simulated={simulated}
                onResetSimulation={handleResetSimulation}
              />
            )}
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
      <CreatePlaylistModal
        open={createPlaylistOpen}
        onClose={() => setCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />
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
      <PlaylistsProvider>
        <SyncProvider>
          <Suspense fallback={<PageFallback />}>
            <AppShell />
          </Suspense>
        </SyncProvider>
      </PlaylistsProvider>
    </PlayerProvider>
  );
}
