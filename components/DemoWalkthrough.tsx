"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";

const STEPS = [
  {
    target: '[data-tour="trending-section"]',
    text: "AI explains WHY each track is trending, not just that it is",
  },
  {
    target: '[data-tour="trend-explanation"]',
    text: "Claude generates contextual reasoning in real-time",
  },
  {
    target: '[data-tour="smart-shuffle"]',
    text: "AI detects when you're looping and intervenes proactively",
  },
  {
    target: '[data-tour="insights-banner"]',
    text: "Every feature traces back to a real user survey insight",
  },
];

interface TooltipPosition {
  top: number;
  left: number;
  width: number;
}

export function DemoWalkthrough() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState<TooltipPosition | null>(null);

  const updatePosition = useCallback(() => {
    const selector = STEPS[step]?.target;
    if (!selector) return;

    const el = document.querySelector(selector);
    if (!el) {
      setPosition(null);
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const rect = el.getBoundingClientRect();
    const tooltipWidth = Math.min(320, window.innerWidth - 32);

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow > 180 ? rect.bottom + 12 : Math.max(16, rect.top - 140);

    setPosition({ top, left, width: tooltipWidth });
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(updatePosition, 350);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, step, updatePosition]);

  const handleOpen = () => {
    setStep(0);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(0);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  };

  const currentStep = STEPS[step];
  const targetEl =
    isOpen && currentStep
      ? document.querySelector(currentStep.target)
      : null;

  return (
    <>
      <button
        type="button"
        onClick={isOpen ? handleClose : handleOpen}
        className="fixed bottom-[100px] right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg transition hover:bg-[#1ed760] hover:scale-105 md:bottom-[100px]"
        aria-label={isOpen ? "Close demo tour" : "Start demo tour"}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <HelpCircle className="h-6 w-6" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/30"
              onClick={handleClose}
              aria-hidden
            />

            {targetEl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none fixed z-[56] rounded-xl ring-2 ring-[#1DB954] ring-offset-2 ring-offset-app-bg"
                style={{
                  top: targetEl.getBoundingClientRect().top - 4,
                  left: targetEl.getBoundingClientRect().left - 4,
                  width: targetEl.getBoundingClientRect().width + 8,
                  height: targetEl.getBoundingClientRect().height + 8,
                }}
              />
            )}

            {position && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="fixed z-[57] rounded-xl border border-app-border bg-app-panel p-4 shadow-2xl"
                style={{
                  top: position.top,
                  left: position.left,
                  width: position.width,
                }}
              >
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#1DB954]">
                  Step {step + 1} of {STEPS.length}
                </p>
                <p className="text-sm leading-relaxed text-app-text">
                  {currentStep.text}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === step
                            ? "w-4 bg-[#1DB954]"
                            : "w-1.5 bg-[#535353]"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-[#1DB954] px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-[#1ed760]"
                  >
                    {step < STEPS.length - 1 ? "Next →" : "Done"}
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
