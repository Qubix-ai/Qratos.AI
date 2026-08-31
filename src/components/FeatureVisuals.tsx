import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Target, 
  Globe, 
  Zap, 
  Database, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Sliders, 
  Cpu, 
  Send,
  MousePointer,
  CheckCircle2,
  Layers,
  FileText
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CURSOR ICON COMPONENT (Clean White Glass Aesthetic)
   ═══════════════════════════════════════════════════════════════ */
const AnimatedCursor: React.FC<{ x: number; y: number; isClicking: boolean }> = ({ x, y, isClicking }) => {
  return (
    <div 
      className="absolute pointer-events-none z-30 transition-all duration-700 ease-out"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: `translate(-2px, -2px) scale(${isClicking ? 0.85 : 1})`
      }}
    >
      <div className="relative">
        <MousePointer 
          size={16} 
          className="text-white fill-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] filter" 
        />
        {isClicking && (
          <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-white/40 animate-ping pointer-events-none" />
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 1: 5 Modes Cyclic Activation & Live Typewriter Output
   (Distinct Style: Smooth LayoutId Glow Glide + Synthesizing Shimmer + Blinking Typewriter Cursor)
   ═══════════════════════════════════════════════════════════════ */
export const ModesCycleVisual: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const modes = [
    {
      id: "emails",
      label: "Emails",
      sub: "Sequences & Drips",
      icon: Mail,
      fullText: "Subject: Quick question about scaling [Offer]..."
    },
    {
      id: "ads",
      label: "Ads",
      sub: "Hooks & Angles",
      icon: Target,
      fullText: "Hook: Stop losing 64% of qualified clicks on draft 1."
    },
    {
      id: "pages",
      label: "Pages",
      sub: "Sales & Landing",
      icon: Globe,
      fullText: "Headline: The Persuasion Engine Built for Operators."
    },
    {
      id: "psych",
      label: "Persuasion",
      sub: "Conversion Triggers",
      icon: Zap,
      fullText: "Trigger: Loss-aversion framing + micro-commitment CTA."
    },
    {
      id: "content",
      label: "Content",
      sub: "Reels & Scripts",
      icon: Layers,
      fullText: "Script: 3 subtle mistakes killing your organic reach..."
    }
  ];

  // Cycling timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % modes.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [modes.length]);

  // Live Typewriter Effect for the active mode
  useEffect(() => {
    setTypedText("");
    setIsTyping(true);
    const targetText = modes[activeIdx].fullText;
    let currentIdx = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIdx <= targetText.length) {
        setTypedText(targetText.slice(0, currentIdx));
        currentIdx++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 28);

    return () => clearInterval(typeInterval);
  }, [activeIdx]);

  return (
    <div className="relative w-full flex flex-col gap-2.5 p-4 sm:p-5 bg-[#0b0c10] rounded-[24px] border border-white/20 overflow-hidden shadow-2xl subpixel-antialiased">
      <style>{`
        @keyframes synthWaveShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes cursorBlinkKeyframe {
          0%, 45% { opacity: 1; }
          50%, 95% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Top Header - Removed "5 DEDICATED WORKSPACES", Closed Top Gap */}
      <div className="flex items-center justify-between pb-2 border-b border-white/15">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-mono text-white font-bold tracking-wider">
            WORKSPACE READY
          </span>
        </div>
        <span className="text-[11px] font-mono text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/25 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white]" />
          Memory Locked
        </span>
      </div>

      {/* 5 Mode Chips Grid - Compact & Crystal Clear */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-1">
        {modes.map((mode, idx) => {
          const Icon = mode.icon;
          const isActive = activeIdx === idx;
          return (
            <div
              key={mode.id}
              onClick={() => setActiveIdx(idx)}
              className={`p-2.5 rounded-xl cursor-pointer flex items-center gap-2 relative overflow-hidden transition-all duration-300 border ${
                isActive
                  ? "border-white/60 bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  : "bg-white/[0.04] border-white/15 hover:border-white/30 hover:bg-white/[0.08]"
              } ${idx === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              {/* Smooth Active Mode Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeModeGlowPill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent pointer-events-none rounded-xl"
                />
              )}

              <div 
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 relative z-10 transition-all duration-300 ${
                  isActive ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-105" : "bg-white/10 text-white"
                }`}
              >
                <Icon size={14} strokeWidth={2.4} />
              </div>
              <div className="min-w-0 relative z-10">
                <span className="block text-xs font-bold text-white tracking-tight leading-tight">{mode.label}</span>
                <span className="block text-[10px] text-gray-300 truncate font-medium">{mode.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Animated Output Snippet Card - Positioned immediately after mode buttons without gap */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-black/80 border border-white/20 flex items-center justify-between gap-3 shadow-inner relative overflow-hidden">
        {/* Background Shimmer Wave when Synthesizing */}
        {isTyping && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            style={{ animation: "synthWaveShimmer 1.8s infinite linear" }}
          />
        )}

        <div className="min-w-0 flex-1 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-gray-300 font-semibold uppercase tracking-wider">
              Active Generation Preview ({modes[activeIdx].label})
            </span>
            {isTyping ? (
              <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1.5 bg-white/15 px-2 py-0.5 rounded border border-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white] animate-ping" />
                Synthesizing
              </span>
            ) : (
              <span className="text-[9px] font-mono text-white/80 font-bold flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Ready
              </span>
            )}
          </div>
          <p className="text-xs text-white font-mono truncate font-medium">
            {typedText}
            {/* Authentic Typewriter Cursor */}
            <span 
              className="inline-block w-1.5 h-3.5 bg-white ml-0.5 align-middle shadow-[0_0_8px_white]"
              style={{ animation: "cursorBlinkKeyframe 0.9s infinite steps(1)" }}
            />
          </p>
        </div>
        <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center shrink-0 border border-white/25 relative z-10">
          <Check size={12} className="text-white stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 2: Prompt Compilation (Guided Parameters -> Master Blueprint)
   (Distinct Style: Mechanical Construction & Sequential Assembly Sliding In)
   ═══════════════════════════════════════════════════════════════ */
export const PromptCompilerVisual: React.FC = () => {
  const [assemblyPhase, setAssemblyPhase] = useState(0);

  useEffect(() => {
    // Stage sequence: 0 = scanning, 1 = [ROLE] slides in, 2 = [FRAME] locks in, 3 = [OUTPUT] compiled, 4 = Complete lock
    const intervals = [
      { phase: 0, delay: 1000 },
      { phase: 1, delay: 900 },
      { phase: 2, delay: 900 },
      { phase: 3, delay: 900 },
      { phase: 4, delay: 2400 },
    ];

    let cur = 0;
    let timer: NodeJS.Timeout;

    const tick = () => {
      setAssemblyPhase(intervals[cur].phase);
      const nextDelay = intervals[cur].delay;
      cur = (cur + 1) % intervals.length;
      timer = setTimeout(tick, nextDelay);
    };

    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, []);

  const hasRole = assemblyPhase >= 1;
  const hasFrame = assemblyPhase >= 2;
  const hasOutput = assemblyPhase >= 3;
  const isComplete = assemblyPhase >= 4;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-white/[0.05] backdrop-blur-2xl rounded-[30px] border border-white/12 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
          PROMPT COMPILER ENGINE
        </span>
        <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
          Core & Max Unlocked
        </span>
      </div>

      {/* Comparison Stack with Sequential Construction Motion */}
      <div className="space-y-2.5 my-2.5">
        {/* Flat generic prompt */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 opacity-60">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-0.5">
            <span>Generic One-Liner (Other AI)</span>
            <span className="text-gray-500">Unstructured</span>
          </div>
          <p className="text-xs text-gray-400 italic">
            &quot;Write me a cold email for my coaching business...&quot;
          </p>
        </div>

        {/* Animated Active Compilation Beam */}
        <div className="relative h-4 flex items-center justify-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <motion.div 
            animate={{ 
              scale: isComplete ? 1.05 : [1, 1.06, 1],
              opacity: assemblyPhase === 0 ? 0.7 : 1 
            }}
            transition={{ duration: 0.6, repeat: isComplete ? 0 : Infinity }}
            className="absolute px-2.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(255,255,255,0.6)] flex items-center gap-1"
          >
            <Sparkles size={10} />
            <span>{isComplete ? "ASSEMBLY LOCKED" : "COMPILING STRUCTURE..."}</span>
          </motion.div>
        </div>

        {/* Murgii Master Structured Blueprint with Sequential Slide-in Assembly */}
        <motion.div 
          animate={{
            borderColor: isComplete ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.2)",
            boxShadow: isComplete ? "0 0 28px rgba(255,255,255,0.22)" : "0 4px 12px rgba(0,0,0,0.3)"
          }}
          transition={{ duration: 0.4 }}
          className="p-3.5 rounded-xl bg-white/[0.08] border relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-white mb-2">
            <span className="font-bold flex items-center gap-1">
              <Check size={12} className="text-white" />
              Murgii Master Prompt Blueprint
            </span>
            <span className="text-[9px] text-gray-300 font-mono">
              {isComplete ? "100% Persuasion Ready" : `Assembling (${assemblyPhase}/3)`}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-gray-200">
            {/* [ROLE] Block - Slides in sequentially */}
            <motion.div 
              initial={false}
              animate={{ 
                opacity: hasRole ? 1 : 0.25, 
                x: hasRole ? 0 : -14,
                scale: hasRole ? 1 : 0.98
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 p-1 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] shrink-0 transition-colors duration-300 ${
                hasRole ? "bg-white text-black shadow-sm font-black" : "bg-white/10 text-white/50"
              }`}>
                [ROLE]
              </span>
              <span className="text-gray-300 text-xs truncate">Direct Response Copywriter & Strategist</span>
            </motion.div>

            {/* [FRAME] Block - Drops in sequentially */}
            <motion.div 
              initial={false}
              animate={{ 
                opacity: hasFrame ? 1 : 0.25, 
                y: hasFrame ? 0 : -8,
                scale: hasFrame ? 1 : 0.98
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 p-1 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] shrink-0 transition-colors duration-300 ${
                hasFrame ? "bg-white text-black shadow-sm font-black" : "bg-white/10 text-white/50"
              }`}>
                [FRAME]
              </span>
              <span className="text-gray-300 text-xs truncate">Cialdini Scarcity + Loss Aversion</span>
            </motion.div>

            {/* [OUTPUT] Block - Slides in from bottom */}
            <motion.div 
              initial={false}
              animate={{ 
                opacity: hasOutput ? 1 : 0.25, 
                x: hasOutput ? 0 : 14,
                scale: hasOutput ? 1 : 0.98
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 p-1 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] shrink-0 transition-colors duration-300 ${
                hasOutput ? "bg-white text-black shadow-sm font-black" : "bg-white/10 text-white/50"
              }`}>
                [OUTPUT]
              </span>
              <span className="text-gray-300 text-xs truncate">3 Pattern-Interrupt Hooks + Objection Crusher</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs text-gray-300">
        <span className="font-semibold">Copywriter Alignment</span>
        <span className="text-white font-mono font-bold">100% Market-Ready</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 3: Tiered Daily Credit Meter & Animated Counter Tick-Up
   (Distinct Style: Smooth Count-up Easing + Warm-Toned Ambient Glow Pulse)
   ═══════════════════════════════════════════════════════════════ */
export const TierExpansionVisual: React.FC = () => {
  const [activeTier, setActiveTier] = useState<0 | 1 | 2>(2); // Highlight Max Tier
  const [displayCredits, setDisplayCredits] = useState(60);

  const tiers = [
    { name: "Basic (Free)", credits: 3, desc: "All 5 Modes Included", pct: 15 },
    { name: "Core ($29/mo)", credits: 20, desc: "Prompt Builder Unlocked", pct: 45 },
    { name: "Max ($97/mo)", credits: 60, desc: "Blueprint Studio + Priority", pct: 100 }
  ];

  // Cycling tier loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTier((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  // Smooth Animated Count-up Tick for numbers
  useEffect(() => {
    const target = tiers[activeTier].credits;
    const startVal = displayCredits;
    const duration = 750; // ms
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * easeProgress);
      setDisplayCredits(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [activeTier]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-white/[0.05] backdrop-blur-2xl rounded-[30px] border border-white/12 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)]">
      <style>{`
        /* Warmer-Toned Ambient Glow Pulse for the selected Tier Row */
        @keyframes warmTierGlowPulse {
          0%, 100% {
            box-shadow: 0 0 14px rgba(251, 191, 36, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.35);
            border-color: rgba(251, 191, 36, 0.45);
          }
          50% {
            box-shadow: 0 0 28px rgba(251, 191, 36, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.65);
            border-color: rgba(255, 235, 180, 0.9);
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
          DAILY QUOTA ENGINE
        </span>
        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Resets every 24h
        </span>
      </div>

      {/* 3 Tier Cards with Warm Ambient Glow on Selected Row */}
      <div className="space-y-2 my-2">
        {tiers.map((tier, idx) => {
          const isSelected = activeTier === idx;
          return (
            <div
              key={tier.name}
              onClick={() => setActiveTier(idx as 0 | 1 | 2)}
              style={isSelected ? { animation: "warmTierGlowPulse 3.2s infinite ease-in-out" } : undefined}
              className={`p-2.5 rounded-xl transition-all duration-400 cursor-pointer flex items-center justify-between border ${
                isSelected
                  ? "bg-white/15 scale-[1.01]"
                  : "bg-white/[0.03] border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block leading-tight">{tier.name}</span>
                <span className="text-[10px] text-gray-400">{tier.desc}</span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md transition-colors ${
                    isSelected ? "bg-white text-black shadow-sm font-black" : "bg-white/10 text-gray-300"
                  }`}
                >
                  {tier.credits} / day
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry & Animated Fill Meter */}
      <div className="space-y-2 mt-2">
        <div className="p-3 rounded-xl bg-black/60 border border-white/15 space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
            <span>Active Quota ({tiers[activeTier].name})</span>
            <span className="text-white font-bold font-mono text-xs">
              {displayCredits} Credits / Day
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative p-[1px]">
            <motion.div
              className="h-full bg-gradient-to-r from-white/80 to-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
              animate={{ width: `${tiers[activeTier].pct}%` }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs text-gray-300">
          <span className="font-semibold">Overage Policy</span>
          <span className="text-white font-mono font-bold">Zero Surprise Bills</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 4: Bolt Ecosystem & Sequential Node Sync
   (Distinct Style: Back-and-Forth Traveling Connector Synapse + Staggered One-by-One Sync Cycle)
   ═══════════════════════════════════════════════════════════════ */
export const BoltEcosystemVisual: React.FC = () => {
  const [syncingIdx, setSyncingIdx] = useState(0);
  const [syncedSet, setSyncedSet] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const categories = ["Audience", "Offer", "Funnel", "Copy", "Ads", "Scale"];

  // Staggered sequential sync progression: sync one category at a time
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncingIdx((prev) => (prev + 1) % categories.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [categories.length]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-white/[0.05] backdrop-blur-2xl rounded-[30px] border border-white/12 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)]">
      <style>{`
        @keyframes badgeSyncFlash {
          0% { transform: scale(1.08); filter: drop-shadow(0 0 12px rgba(255,255,255,0.9)); }
          100% { transform: scale(1); filter: none; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
          BOLT REVENUE ECOSYSTEM
        </span>
        <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
          Max Full-Suite Link
        </span>
      </div>

      {/* 2 Connected Nodes with Back-and-Forth Traveling Synapse Dot */}
      <div className="space-y-2.5 my-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 p-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-center relative overflow-hidden">
            <span className="block text-[9px] font-mono text-gray-400 uppercase">System A</span>
            <span className="block text-xs font-bold text-white mt-0.5">Bolt Roadmap</span>
          </div>

          {/* Synapse Connector with Smooth Traveling Particle Looping Back and Forth */}
          <div className="relative w-12 h-6 flex items-center justify-center shrink-0">
            <div className="w-full h-[1.5px] bg-white/20" />
            
            {/* Traveling Connector Dot ping-ponging back and forth */}
            <motion.div
              animate={{ x: [-18, 18, -18] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute flex items-center justify-center"
            >
              <div className="w-3 h-3 rounded-full bg-white/30 animate-ping absolute" />
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
            </motion.div>
          </div>

          <div className="flex-1 p-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-center relative overflow-hidden">
            <span className="block text-[9px] font-mono text-gray-400 uppercase">System B</span>
            <span className="block text-xs font-bold text-white mt-0.5">Murgii Engine</span>
          </div>
        </div>

        {/* 6 Category Roadmap Grid with Staggered, One-at-a-Time Sync Pulse */}
        <div className="grid grid-cols-3 gap-1.5">
          {categories.map((cat, i) => {
            const isSyncing = syncingIdx === i;
            return (
              <div
                key={cat}
                className={`p-2 rounded-lg border text-center transition-all duration-300 relative overflow-hidden ${
                  isSyncing
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.45)] scale-105"
                    : "bg-white/[0.04] border-white/10 text-white"
                }`}
                style={isSyncing ? { animation: "badgeSyncFlash 0.5s ease-out" } : undefined}
              >
                <span className="block text-[10px] font-bold">{cat}</span>
                <span className={`block text-[8px] uppercase tracking-wider mt-0.5 ${
                  isSyncing ? "text-neutral-900 font-black" : "text-gray-400 font-mono"
                }`}>
                  {isSyncing ? "Syncing..." : "Linked"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Blueprint Studio Card */}
      <div className="p-3 rounded-xl bg-white/[0.05] border border-white/20 space-y-1">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Sparkles size={12} className="text-white" />
          Business Blueprint Studio & AI Assist
        </span>
        <p className="text-[10px] text-gray-300 leading-relaxed">
          Map multi-channel offer architectures and connect direct copy outputs across all funnel stages.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 5: Linear 3-Stage Pipeline (Pre-Footer Workflow Section)
   ═══════════════════════════════════════════════════════════════ */
export const LinearPipelineVisual: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "01 — CONTEXT",
      desc: "Your audience, offer, voice & objective.",
      icon: Sliders,
      badge: "CONTEXT"
    },
    {
      num: "02",
      title: "02 — INTELLIGENCE",
      desc: "Psychology, proven frameworks & conversion strategy.",
      icon: Cpu,
      badge: "INTELLIGENCE"
    },
    {
      num: "03",
      title: "03 — EXECUTION",
      desc: "High-impact hooks, persuasive messaging & ready-to-use copy.",
      icon: Send,
      badge: "EXECUTION"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-[32px] border border-white/15 p-5 sm:p-8 bg-white/[0.04] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden mb-10">
      {/* Sleek Top Connected Progress Tracker Line */}
      <div className="hidden md:flex items-center justify-between mb-7 px-6 relative">
        {/* Background Tracker Track sitting behind the badge circles */}
        <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-[2px] bg-white/10 z-0 pointer-events-none">
          <motion.div 
            className="h-full bg-white shadow-[0_0_12px_white]"
            animate={{ width: activeStep === 0 ? "0%" : activeStep === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {steps.map((s, idx) => {
          const isActive = activeStep === idx;
          const isPassed = activeStep >= idx;
          return (
            <div 
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className="relative z-10 flex items-center gap-2 cursor-pointer group"
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.8)] scale-110"
                    : isPassed
                    ? "bg-white/30 text-white border border-white/40"
                    : "bg-[#07060B] text-white/40 border border-white/20"
                }`}
              >
                {s.num}
              </div>
              <span className={`text-xs font-semibold transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-white/80"}`}>
                {s.badge}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3 Step Cards - Rigid in place with 1, 2, 3 glowing one by one */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          const isPassed = activeStep >= idx;

          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveStep(idx)}
              className={`p-5 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isActive
                  ? "bg-white/12 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.4)]"
                  : isPassed
                  ? "bg-white/[0.04] border-white/15 hover:border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
                  : "bg-white/[0.02] border-white/10 opacity-70 hover:opacity-100 hover:border-white/20"
              }`}
            >
              {/* Active Step Glow Backlight */}
              {isActive && (
                <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/[0.15] rounded-full blur-[30px] pointer-events-none" />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? "bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.5)] scale-105" 
                        : "bg-white/10 text-white group-hover:scale-105 group-hover:bg-white/15"
                    }`}
                  >
                    <Icon size={17} strokeWidth={2.2} />
                  </div>
                  <span className={`text-2xl font-black font-nohemi transition-colors ${
                    isActive ? "text-white" : "text-white/20 group-hover:text-white/40"
                  }`}>
                    {step.num}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 font-nohemi tracking-tight">
                  {step.title}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono relative z-10">
                <span className="text-white/80 bg-white/10 px-2 py-0.5 rounded border border-white/15 font-bold uppercase tracking-wider text-[8px]">
                  {step.badge}
                </span>
                <span className={isActive ? "text-white font-bold flex items-center gap-1" : "text-gray-400"}>
                  {isActive ? "Active Phase" : isPassed ? "Completed" : "Queued"}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Punchline */}
      <div className="mt-6 pt-4 border-t border-white/10 text-center relative z-10">
        <p className="text-xs sm:text-sm font-mono text-white/90 font-bold tracking-wider">
          One brief. One system. Copy built for action.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 MASTER FIX: Interactive Simulated Prompt Builder Demo
   ═══════════════════════════════════════════════════════════════ */
export const PromptStudioInteractiveDemo: React.FC<{ activeArchetype: string; onSelectArchetype: (id: string) => void }> = ({
  activeArchetype
}) => {
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { step: 0, delay: 600 },  // Hover Card 1
      { step: 1, delay: 600 },  // Click Card 1 -> Glow
      { step: 2, delay: 650 },  // Hover Card 2
      { step: 3, delay: 600 },  // Click Card 2 -> Glow
      { step: 4, delay: 650 },  // Hover Card 3
      { step: 5, delay: 600 },  // Click Card 3 -> Glow
      { step: 6, delay: 2200 }  // Hold all 3 glowing
    ];

    let currentIdx = 0;
    let timer: NodeJS.Timeout;

    const runNext = () => {
      setAnimStep(sequence[currentIdx].step);
      const nextDelay = sequence[currentIdx].delay;
      currentIdx = (currentIdx + 1) % sequence.length;
      timer = setTimeout(runNext, nextDelay);
    };

    timer = setTimeout(runNext, 200);

    return () => clearTimeout(timer);
  }, [activeArchetype]);

  const activeTarget = (() => {
    switch (animStep) {
      case 0:
      case 1:
        return { cardIdx: 0, isClicking: animStep === 1 };
      case 2:
      case 3:
        return { cardIdx: 1, isClicking: animStep === 3 };
      case 4:
      case 5:
        return { cardIdx: 2, isClicking: animStep === 5 };
      default:
        return { cardIdx: -1, isClicking: false };
    }
  })();

  const field1Locked = animStep >= 1 && animStep <= 6;
  const field2Locked = animStep >= 3 && animStep <= 6;
  const field3Locked = animStep >= 5 && animStep <= 6;

  // Responsive cursor percentage positions
  const getCursorStyle = () => {
    if (activeTarget.cardIdx === 0) {
      return {
        left: "clamp(12%, 16%, 20%)",
        top: "50%",
        mobileLeft: "82%",
        mobileTop: "18%"
      };
    }
    if (activeTarget.cardIdx === 1) {
      return {
        left: "50%",
        top: "50%",
        mobileLeft: "82%",
        mobileTop: "50%"
      };
    }
    if (activeTarget.cardIdx === 2) {
      return {
        left: "clamp(80%, 84%, 88%)",
        top: "50%",
        mobileLeft: "82%",
        mobileTop: "82%"
      };
    }
    return {
      left: "95%",
      top: "95%",
      mobileLeft: "95%",
      mobileTop: "95%"
    };
  };

  const cStyle = getCursorStyle();

  return (
    <div className="pt-3 sm:pt-4 relative">
      {/* Guided Prompts Container */}
      <div className="flex flex-col space-y-2.5 relative">
        <div className="flex items-center justify-between pb-0.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-white font-bold">
            Guided Prompts
          </span>
        </div>

        {/* 3 Parameter Cards - Thin, sleek, and compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 relative">
          {/* Animated Interactive Mouse Pointer */}
          {animStep <= 5 && (
            <div 
              className="absolute pointer-events-none z-30 transition-all duration-500 ease-out hidden md:block"
              style={{
                left: cStyle.left,
                top: cStyle.top,
                transform: `translate(-50%, -50%) scale(${activeTarget.isClicking ? 0.8 : 1})`
              }}
            >
              <div className="relative">
                <MousePointer 
                  size={15} 
                  className="text-white fill-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" 
                />
                {activeTarget.isClicking && (
                  <span className="absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full bg-white/40 animate-ping pointer-events-none" />
                )}
              </div>
            </div>
          )}

          {/* Mobile Cursor Pointer */}
          {animStep <= 5 && (
            <div 
              className="absolute pointer-events-none z-30 transition-all duration-500 ease-out md:hidden"
              style={{
                left: cStyle.mobileLeft,
                top: cStyle.mobileTop,
                transform: `translate(-50%, -50%) scale(${activeTarget.isClicking ? 0.8 : 1})`
              }}
            >
              <div className="relative">
                <MousePointer 
                  size={15} 
                  className="text-white fill-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" 
                />
                {activeTarget.isClicking && (
                  <span className="absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full bg-white/40 animate-ping pointer-events-none" />
                )}
              </div>
            </div>
          )}

          {/* Field 1: 01 — Define */}
          <div 
            className={`py-3 px-3.5 rounded-xl transition-all duration-400 border flex flex-col justify-center relative overflow-hidden ${
              field1Locked
                ? "bg-white/[0.14] border-white/60 shadow-[0_0_24px_rgba(255,255,255,0.22),inset_0_1px_1px_rgba(255,255,255,0.4)] scale-[1.015]"
                : "bg-white/[0.03] border-white/10 opacity-75"
            }`}
          >
            {field1Locked && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none" />
            )}
            <div className="flex items-center justify-between mb-1 relative z-10">
              <label className="text-[10px] font-mono text-white font-bold tracking-wider">
                01 — Define
              </label>
              {field1Locked ? (
                <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1">
                  <Check size={10} className="text-white" /> Locked
                </span>
              ) : (
                <span className="text-[9px] font-mono text-gray-500">Ready</span>
              )}
            </div>
            <div className="text-xs sm:text-[13px] font-semibold text-white leading-snug relative z-10">
              {activeArchetype === "email"
                ? "B2B SaaS & Cold Outreach Leads"
                : activeArchetype === "ads"
                ? "Performance E-Commerce & DTC Brands"
                : activeArchetype === "landing"
                ? "Enterprise Software Platforms & SaaS"
                : activeArchetype === "content"
                ? "Creators, Thought Leaders & Media Brands"
                : "High-Ticket Buyers & Decision-Makers"}
            </div>
          </div>

          {/* Field 2: 02 — Build */}
          <div 
            className={`py-3 px-3.5 rounded-xl transition-all duration-400 border flex flex-col justify-center relative overflow-hidden ${
              field2Locked
                ? "bg-white/[0.14] border-white/60 shadow-[0_0_24px_rgba(255,255,255,0.22),inset_0_1px_1px_rgba(255,255,255,0.4)] scale-[1.015]"
                : "bg-white/[0.03] border-white/10 opacity-75"
            }`}
          >
            {field2Locked && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none" />
            )}
            <div className="flex items-center justify-between mb-1 relative z-10">
              <label className="text-[10px] font-mono text-white font-bold tracking-wider">
                02 — Build
              </label>
              {field2Locked ? (
                <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1">
                  <Check size={10} className="text-white" /> Compiled
                </span>
              ) : (
                <span className="text-[9px] font-mono text-gray-500">Ready</span>
              )}
            </div>
            <div className="text-xs sm:text-[13px] font-semibold text-white leading-snug relative z-10">
              {activeArchetype === "email"
                ? "Demo Bookings + Scarcity Framework"
                : activeArchetype === "ads"
                ? "Scroll-Stopping Hook + Loss Aversion"
                : activeArchetype === "landing"
                ? "Cold Traffic Conversion + Proof Stacking"
                : activeArchetype === "content"
                ? "High-Retention Hook + Curiosity Gap"
                : "Friction Removal & Commitment Pacing"}
            </div>
          </div>

          {/* Field 3: 03 — Create */}
          <div 
            className={`py-3 px-3.5 rounded-xl transition-all duration-400 border flex flex-col justify-center relative overflow-hidden ${
              field3Locked
                ? "bg-white/[0.14] border-white/60 shadow-[0_0_24px_rgba(255,255,255,0.22),inset_0_1px_1px_rgba(255,255,255,0.4)] scale-[1.015]"
                : "bg-white/[0.03] border-white/10 opacity-75"
            }`}
          >
            {field3Locked && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none" />
            )}
            <div className="flex items-center justify-between mb-1 relative z-10">
              <label className="text-[10px] font-mono text-white font-bold tracking-wider">
                03 — Create
              </label>
              {field3Locked ? (
                <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1">
                  <Check size={10} className="text-white" /> Active
                </span>
              ) : (
                <span className="text-[9px] font-mono text-gray-500">Ready</span>
              )}
            </div>
            <div className="text-xs sm:text-[13px] font-semibold text-white leading-snug relative z-10">
              {activeArchetype === "email"
                ? "Cold Email Campaign Master Prompt"
                : activeArchetype === "ads"
                ? "Direct-Response Ad Copy Master Prompt"
                : activeArchetype === "landing"
                ? "Sales Page & Landing Master Prompt"
                : activeArchetype === "content"
                ? "Viral Hook & Content Engine Prompt"
                : "Persuasion Vector & Objection Prompt"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: 5 Specialized Mode Micro-Demo Cards
   ═══════════════════════════════════════════════════════════════ */
export const SpecializedModeCard: React.FC<{
  name: string;
  role: string;
  desc?: string;
  bullets?: string[];
  icon: any;
  sampleCopy: string;
  delay?: number;
}> = ({ name, role, desc, bullets, icon: Icon, sampleCopy, delay = 0 }) => {
  const [typed, setTyped] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let currentIdx = 0;
    let isCancelled = false;
    let timeoutId: any = null;
    let intervalId: any = null;

    const startTyping = () => {
      if (isCancelled) return;
      currentIdx = 0;
      setTyped("");

      intervalId = setInterval(() => {
        if (isCancelled) {
          clearInterval(intervalId);
          return;
        }
        if (currentIdx <= sampleCopy.length) {
          setTyped(sampleCopy.slice(0, currentIdx));
          currentIdx++;
        } else {
          clearInterval(intervalId);
          timeoutId = setTimeout(() => {
            if (!isCancelled) startTyping();
          }, 3000);
        }
      }, 32);
    };

    const initialTimer = setTimeout(startTyping, delay);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [sampleCopy, delay]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: delay * 0.001, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.015 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-4 sm:p-5 rounded-2xl border border-white/12 hover:border-white/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_40px_rgba(255,255,255,0.08)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)] cursor-pointer"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(20px) saturate(1.3)",
        WebkitBackdropFilter: "blur(20px) saturate(1.3)"
      }}
    >
      {/* Subtle Ambient Hover Glow */}
      <div 
        className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-white/10 blur-[24px] pointer-events-none transition-opacity duration-400 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`} 
      />

      <div>
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-white group-hover:text-black transition-all duration-200">
            <Icon size={16} strokeWidth={2.2} />
          </div>
          <span className="text-[8px] font-mono uppercase tracking-wider text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white] animate-pulse" />
            Mode Active
          </span>
        </div>

        <h4 className="text-sm sm:text-base font-bold text-white font-nohemi mb-0.5 relative z-10 leading-tight">
          {name}
        </h4>
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-2.5 font-semibold relative z-10">
          {role}
        </span>

        {/* Short Punchy Key-Point Bullets (max 3-5 words each) */}
        {bullets && bullets.length > 0 ? (
          <ul className="space-y-1 mb-3.5 relative z-10">
            {bullets.map((item, bIdx) => (
              <li key={bIdx} className="text-xs text-neutral-300 flex items-center gap-1.5 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0 shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                <span className="leading-tight text-gray-200">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-neutral-300 leading-relaxed mb-3.5 font-normal relative z-10">
            {desc}
          </p>
        )}
      </div>

      {/* Live Stream Character-by-Character Sample with Blinking Cursor */}
      <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 min-h-[50px] flex items-center justify-between gap-2 shadow-inner group-hover:border-white/20 transition-colors relative z-10">
        <div className="min-w-0 flex-1">
          <span className="block text-[8px] font-mono uppercase tracking-widest text-gray-400 mb-0.5 font-bold">
            Live Stream Sample
          </span>
          <p className="text-[11px] font-mono text-white truncate font-medium">
            {typed}
            <span className="animate-pulse font-extrabold text-white ml-0.5 inline-block">|</span>
          </p>
        </div>
        <div className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
          <Check size={10} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

