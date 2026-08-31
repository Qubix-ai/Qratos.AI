import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  Trophy,
  ArrowRight,
  CheckCircle2,
  Zap,
  Share2,
  Gauge,
  Sparkles,
  TrendingUp,
  Flame,
  ShieldCheck
} from "lucide-react";

interface LandingChallengeSectionProps {
  onStartChallenge?: (initialText?: string) => void;
  onNavigateToChallengeDemo?: () => void;
}

export const LandingChallengeSection: React.FC<LandingChallengeSectionProps> = ({
  onStartChallenge,
}) => {
  // 3D Motion Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="challenge" className="py-20 sm:py-32 relative overflow-hidden">
      {/* 3D Cinematic Ambient Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,190,11,0.08)_0%,rgba(147,51,234,0.06)_40%,transparent_70%)] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 3D Motion Tilt Container */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[32px] sm:rounded-[40px] border border-white/25 bg-gradient-to-br from-white/[0.10] via-white/[0.03] to-black/80 backdrop-blur-3xl p-6 sm:p-10 lg:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden group"
        >
          {/* Animated Glass Light Reflection Sweep Across the Card */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
          />

          {/* Top Edge Refract Glow */}
          <div className="absolute top-0 left-1/6 right-1/6 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent shadow-[0_0_15px_white]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10" style={{ transform: "translateZ(40px)" }}>
            
            {/* Left Content Area (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Trophy size={14} className="text-[#FFBE0B] drop-shadow-[0_0_8px_rgba(255,190,11,0.8)]" />
                <span className="font-extrabold text-white text-xs font-mono tracking-wider">
                  Copy Score Challenge
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFBE0B]/20 border border-[#FFBE0B]/40 text-[#FFBE0B] text-[10px] font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBE0B] animate-ping" />
                  LIVE
                </span>
              </div>

              {/* Main Headline */}
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-nohemi leading-[1.12]"
                style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              >
                Benchmark your copy against{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
                  direct response masters.
                </span>
              </h2>

              {/* Subheading */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                Paste any headline, ad, or email to get an instant conversion evaluation and generate a shareable challenge link to see who writes the highest-converting copy.
              </p>

              {/* Key Features Pill Matrix */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/15 backdrop-blur-md hover:border-white/30 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold text-white font-mono truncate">0–100 Diagnostic</span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/15 backdrop-blur-md hover:border-white/30 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_10px_rgba(192,132,252,0.3)]">
                    <Share2 size={13} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold text-white font-mono truncate">Viral Public URL</span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/15 backdrop-blur-md hover:border-white/30 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                    <Gauge size={13} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold text-white font-mono truncate">5 Persuasion Metrics</span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/15 backdrop-blur-md hover:border-white/30 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                    <Zap size={13} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold text-white font-mono truncate">Leverage Fixes</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => onStartChallenge && onStartChallenge("")}
                  className="py-3.5 px-8 rounded-xl bg-white text-black hover:bg-neutral-100 text-sm font-extrabold transition-all duration-300 shadow-[0_0_35px_rgba(255,255,255,0.4)] flex items-center justify-center sm:inline-flex gap-2.5 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Test Your Copy Now</span>
                  <ArrowRight size={16} className="stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Visual 3D Motion Graphics Engine (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[300px] sm:min-h-[340px]" style={{ transform: "translateZ(60px)" }}>
              {/* Outer 3D Motion Orbit Rings */}
              <div className="absolute w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full border border-white/15 animate-[spin_25s_linear_infinite] pointer-events-none" />
              <div className="absolute w-[220px] h-[220px] sm:w-[250px] sm:h-[250px] rounded-full border border-dashed border-white/20 animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />

              {/* Central 3D Glass Score Orb */}
              <motion.div 
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-black/90 border border-white/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,255,255,0.15),inset_0_2px_10px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center text-center relative z-10 overflow-hidden"
              >
                {/* Internal Laser Scanner Wave */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent pointer-events-none"
                  style={{ animation: "synthWaveShimmer 2.2s infinite linear" }}
                />

                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  S-Tier Score
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    98.4
                  </span>
                  <span className="text-xs font-mono text-gray-400">/100</span>
                </div>

                <span className="text-[10px] font-mono text-gray-300 mt-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
                  Direct Response Master
                </span>
              </motion.div>

              {/* Floating 3D Movie Metric Badge 1 (Top Right) */}
              <motion.div
                animate={{ y: [-8, 8, -8], x: [3, -3, 3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-2 right-0 sm:right-2 px-3 py-2 rounded-xl bg-black/80 border border-white/25 backdrop-blur-xl shadow-2xl flex items-center gap-2 z-20"
                style={{ transform: "translateZ(80px)" }}
              >
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <TrendingUp size={12} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-white font-mono">Attention Hook</span>
                  <span className="block text-[9px] text-emerald-400 font-mono font-semibold">99% Conversion</span>
                </div>
              </motion.div>

              {/* Floating 3D Movie Metric Badge 2 (Bottom Left) */}
              <motion.div
                animate={{ y: [8, -8, 8], x: [-4, 4, -4] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-2 left-0 sm:left-2 px-3 py-2 rounded-xl bg-black/80 border border-white/25 backdrop-blur-xl shadow-2xl flex items-center gap-2 z-20"
                style={{ transform: "translateZ(80px)" }}
              >
                <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Flame size={12} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-white font-mono">Behavioral Trigger</span>
                  <span className="block text-[9px] text-amber-300 font-mono font-semibold">Loss Aversion Set</span>
                </div>
              </motion.div>

              {/* Floating Sparkle Dot */}
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 left-10 text-white/60 pointer-events-none"
              >
                <Sparkles size={16} />
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
