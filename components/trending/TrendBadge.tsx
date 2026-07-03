interface TrendBadgeProps {
  score: number;
}

function getBadgeStyle(score: number) {
  if (score > 80) {
    return { emoji: "🔴", className: "bg-red-500/15 text-red-400 ring-red-500/30" };
  }
  if (score >= 50) {
    return { emoji: "🟡", className: "bg-yellow-500/15 text-yellow-400 ring-yellow-500/30" };
  }
  return { emoji: "🟢", className: "bg-[#1DB954]/15 text-[#1DB954] ring-[#1DB954]/30" };
}

export function TrendBadge({ score }: TrendBadgeProps) {
  const { emoji, className } = getBadgeStyle(score);

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${className}`}
    >
      <span aria-hidden>{emoji}</span>
      {score}
    </span>
  );
}
