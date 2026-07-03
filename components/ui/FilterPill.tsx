"use client";

interface FilterPillProps {
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "spotify" | "light";
  "aria-selected"?: boolean;
}

export function FilterPill({
  selected = false,
  children,
  onClick,
  className = "",
  variant = "spotify",
  "aria-selected": ariaSelected,
}: FilterPillProps) {
  const styles =
    variant === "light"
      ? selected
        ? "bg-[#1DB954] text-white shadow-sm"
        : "bg-[#ebebeb] text-[#121212] hover:bg-[#e0e0e0]"
      : selected
        ? "bg-white text-black"
        : "bg-white/10 text-white hover:bg-white/20";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={ariaSelected ?? selected}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition active:scale-[0.98] ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
