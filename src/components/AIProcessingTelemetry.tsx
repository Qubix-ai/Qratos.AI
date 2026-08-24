import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AIProcessingTelemetryProps {
  isGenerating: boolean;
  statusText?: string;
}

const ROTATING_STATUS_LINES = [
  "Distilling…",
  "Sharpening…",
  "Uncovering…",
  "Framing…",
  "Reframing…",
  "Tuning…",
  "Calibrating…",
  "Orchestrating…",
  "Threading…",
  "Sculpting…",
  "Finessing…",
  "Honing…",
  "Composing…",
  "Weaving…",
  "Refining…",
  "Elevating…",
  "Aligning…",
  "Unfolding…",
  "Engineering…",
  "Decoding…",
  "Deconstructing…",
  "Synthesizing…"
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
    }, 1200);
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  const displayLine = statusText || ROTATING_STATUS_LINES[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0C0A14]/85 border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden"
    >
      {/* Subtle iridescent shimmer sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8B5CF6]/10 via-[#D946EF]/10 to-transparent animate-[shimmerSweep_2.5s_infinite] pointer-events-none" />

      {/* Subtle pulsing indicator */}
      <div className="relative flex items-center justify-center w-5 h-5 shrink-0 z-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#D946EF] animate-ping opacity-35" />
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#C084FC] to-[#D946EF] shadow-[0_0_8px_rgba(217,70,239,0.7)]" />
      </div>

      {/* Short rotating status line */}
      <div className="overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={displayLine}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium text-white/90 tracking-wide block"
          >
            {displayLine}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
