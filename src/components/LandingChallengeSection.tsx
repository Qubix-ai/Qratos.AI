import React from "react";
import { motion } from "motion/react";
import {
  Trophy,
  ArrowRight,
  CheckCircle2,
  Zap,
  Share2,
  Gauge
} from "lucide-react";

interface LandingChallengeSectionProps {
  onStartChallenge?: (initialText?: string) => void;
  onNavigateToChallengeDemo?: () => void;
}

export const LandingChallengeSection: React.FC<LandingChallengeSectionProps> = ({
  onStartChallenge,
}) => {
  return (
    <section id="challenge" className="py-20 sm:py-28 relative overflow-hidden contain-paint">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Single Premium Clean Glassmorphic Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent backdrop-blur-2xl p-8 sm:p-12 lg:p-14 shadow-[0_25px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden text-center flex flex-col items-center"
        >
          {/* Subtle top edge glow */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md text-white/90 text-xs font-mono uppercase tracking-widest mb-6">
            <Trophy size={13} className="text-[#FFBE0B]" />
            <span className="font-bold">Copy Score Challenge</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#FFBE0B]/20 text-[#FFBE0B] text-[10px] font-black">
              LIVE
            </span>
          </div>

          {/* Headline */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-nohemi leading-[1.15] max-w-3xl mx-auto mb-4"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            Benchmark your copy against{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
              direct response masters.
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Paste any headline, ad, or email to get an instant conversion evaluation and generate a shareable challenge link to see who writes the highest-converting copy.
          </p>

          {/* Key Points Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full max-w-3xl mx-auto mb-9">
            <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/80 font-mono">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 size={12} />
              </div>
              <span className="truncate">0–100 Diagnostic</span>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/80 font-mono">
              <div className="w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Share2 size={12} />
              </div>
              <span className="truncate">Viral Public URL</span>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/80 font-mono">
              <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Gauge size={12} />
              </div>
              <span className="truncate">5 Persuasion Metrics</span>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/80 font-mono">
              <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Zap size={12} />
              </div>
              <span className="truncate">Leverage Fixes</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => onStartChallenge && onStartChallenge("")}
            className="py-4 px-8 rounded-2xl bg-white text-black hover:bg-neutral-200 text-sm font-black transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.35)] flex items-center justify-center gap-3 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Test Your Copy Now</span>
            <ArrowRight size={16} className="stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
