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
  if (variant === "mobile") {
    return (
      <nav
        aria-label="Sections"
        className="fixed bottom-[90px] inset-x-0 z-40 flex border-t border-app-border bg-app-panel md:hidden"
      >
        {CONTENT_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-current={activeTab === id ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTabChange(id);
            }}
            className={`flex flex-1 flex-col items-center py-2 text-[10px] font-semibold ${
              activeTab === id ? "text-[#1DB954]" : "text-app-subtle"
            }`}
          >
            {id === "friends" ? "F&F" : label}
          </button>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Sections"
      role="tablist"
      className="relative z-50 flex gap-2 overflow-x-auto border-b border-app-border bg-app-panel px-4 py-3 sm:px-6"
    >
      {CONTENT_TABS.map(({ id, label }) => {
        const selected = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTabChange(id);
            }}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
              selected
                ? "bg-[#1DB954] text-black"
                : "bg-app-chip text-app-text hover:bg-app-chip-hover"
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
