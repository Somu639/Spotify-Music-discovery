"use client";

import type { ContentTab } from "@/types";

const MOBILE_TABS: { id: ContentTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "music", label: "Music" },
  { id: "trending", label: "Trending" },
  { id: "friends", label: "F&F" },
  { id: "podcasts", label: "Podcast" },
];

export function MobileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}) {
  return (
    <nav className="fixed bottom-[90px] inset-x-0 z-30 flex border-t border-app-border bg-app-panel md:hidden">
      {MOBILE_TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={`flex flex-1 flex-col items-center py-2 text-[10px] font-semibold ${
            activeTab === id ? "text-[#1DB954]" : "text-[#727272]"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

const TABS: { id: ContentTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "music", label: "Music" },
  { id: "trending", label: "Trending" },
  { id: "friends", label: "Sync F&F Playlist" },
  { id: "podcasts", label: "Podcast" },
];

interface FilterChipsProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export function FilterChips({ activeTab, onTabChange }: FilterChipsProps) {
  return (
    <div className="relative z-10 flex gap-2 overflow-x-auto pb-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-pressed={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            activeTab === tab.id
              ? "bg-white text-black"
              : "bg-app-chip text-app-text hover:bg-app-chip-hover"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
