import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QreatoLogo } from "./QreatoLogo";

interface AIProcessingTelemetryProps {
  isGenerating: boolean;
  statusText?: string;
}

const ROTATING_STATUS_LINES = [
  "Thinking…",
  "Distilling persuasion angles…",
  "Sharpening hook clarity…",
  "Uncovering cognitive triggers…",
  "Framing value propositions…",
  "Tuning emotional resonance…",
  "Sculpting copy architecture…",
  "Synthesizing high-converting output…"
];

export function AIProcessingTelemetry({ isGenerating, statusText }: AIProcessingTelemetryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROTATING_STATUS_LINES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  const displayLine = statusText || ROTATING_STATUS_LINES[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#111114] border border-white/[0.09] shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      {/* Stationary Qreato logo with sequential parts fade-in animation */}
      <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 shrink-0">
        <div className="flex items-center justify-center">
          <QreatoLogo size={16} animated={true} className="text-white" dotClassName="text-white fill-white" />
        </div>
      </div>

      {/* Claude-style status indicator */}
      <div className="flex items-center gap-2 overflow-hidden select-none">
        <span className="text-xs sm:text-sm font-medium text-neutral-200">
          Thinking
        </span>
        <span className="text-neutral-500 text-xs">·</span>
        <div className="overflow-hidden min-w-0 max-w-[240px] sm:max-w-[320px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayLine}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs sm:text-sm font-medium text-neutral-400 tracking-wide block truncate"
            >
              {displayLine}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="flex items-center gap-0.5 ml-0.5 shrink-0">
          <span className="w-1 h-1 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-1 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-1 rounded-full bg-neutral-400 animate-bounce" />
        </span>
      </div>
    </motion.div>
  );
}
