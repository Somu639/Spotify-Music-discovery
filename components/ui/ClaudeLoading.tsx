interface ClaudeThinkingProps {
  label?: string;
  className?: string;
}

export function ClaudeThinking({
  label = "Claude is thinking...",
  className = "",
}: ClaudeThinkingProps) {
  return (
    <div
      className={`flex items-center gap-2 text-xs text-[#1DB954] ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="h-2 w-2 shrink-0 animate-spin rounded-full border-2 border-[#1DB954] border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}

interface SkeletonShimmerProps {
  lines?: number;
  className?: string;
}

export function SkeletonShimmer({
  lines = 3,
  className = "",
}: SkeletonShimmerProps) {
  const widths = ["w-full", "w-5/6", "w-4/6", "w-3/4"];

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 animate-pulse rounded bg-gradient-to-r from-app-surface via-app-elevated to-app-surface ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

interface ClaudeLoadingBlockProps {
  message?: string;
  lines?: number;
}

export function ClaudeLoadingBlock({
  message = "Claude is thinking...",
  lines = 3,
}: ClaudeLoadingBlockProps) {
  return (
    <div className="space-y-2">
      <ClaudeThinking label={message} />
      <SkeletonShimmer lines={lines} />
    </div>
  );
}
