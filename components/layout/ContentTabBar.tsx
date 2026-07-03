"use client";

import { CONTENT_TABS } from "@/lib/content-tabs";
import type { ContentTab } from "@/types";

interface ContentTabBarProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
  variant?: "header" | "mobile";
}

export function ContentTabBar({
  activeTab,
  onTabChange,
  variant = "header",
}: ContentTabBarProps) {
  if (variant !== "mobile") return null;

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-[90px] inset-x-0 z-40 flex border-t border-white/10 bg-[#121212] md:hidden"
    >
      {CONTENT_TABS.map(({ id, label }) => {
        const selected = activeTab === id;
        const shortLabel =
          id === "friends" ? "Sync F&F" : id === "podcasts" ? "Podcast" : label;
        return (
          <button
            key={id}
            type="button"
            aria-current={selected ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTabChange(id);
            }}
            className={`flex flex-1 flex-col items-center px-1 py-2 text-[9px] font-semibold leading-tight ${
              selected ? "text-white" : "text-app-muted"
            }`}
          >
            {shortLabel}
          </button>
        );
      })}
    </nav>
  );
}
