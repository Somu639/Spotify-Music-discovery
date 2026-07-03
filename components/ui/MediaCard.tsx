"use client";

import { Play } from "lucide-react";

interface MediaCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  badge?: string;
  onClick?: () => void;
  onPlay?: () => void;
  size?: "sm" | "md" | "tile";
}

export function MediaCard({
  title,
  subtitle,
  imageUrl,
  badge,
  onClick,
  onPlay,
  size = "md",
}: MediaCardProps) {
  if (size === "tile") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group flex items-center gap-3 overflow-hidden rounded-md bg-app-chip pr-4 transition hover:bg-app-chip-hover"
      >
        <img
          src={imageUrl}
          alt=""
          className="h-14 w-14 shrink-0 object-cover shadow-lg sm:h-16 sm:w-16"
        />
        <span className="truncate text-sm font-bold text-app-text">{title}</span>
      </button>
    );
  }

  const imageSize =
    size === "sm" ? "w-[140px] sm:w-[160px]" : "w-[160px] sm:w-[180px]";

  return (
    <div
      className={`group shrink-0 ${imageSize} cursor-pointer`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-app-surface shadow-md">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-2 top-2 rounded-sm bg-[#1DB954] px-1.5 py-0.5 text-[10px] font-bold uppercase text-black">
            {badge}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 hover:bg-[#1ed760]"
          aria-label={`Play ${title}`}
        >
          <Play className="h-5 w-5 fill-black pl-0.5" />
        </button>
      </div>
      <p className="truncate text-sm font-bold text-app-text">{title}</p>
      {subtitle && (
        <p className="mt-1 truncate text-xs text-app-muted">{subtitle}</p>
      )}
    </div>
  );
}
