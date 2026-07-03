import type { ContentTab } from "@/types";

export const CONTENT_TABS: { id: ContentTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "music", label: "Music" },
  { id: "trending", label: "Trending" },
  { id: "friends", label: "Sync F&F Playlist" },
  { id: "podcasts", label: "Podcast" },
];

export function isContentTab(value: string | null): value is ContentTab {
  return (
    value === "all" ||
    value === "music" ||
    value === "trending" ||
    value === "friends" ||
    value === "podcasts"
  );
}
