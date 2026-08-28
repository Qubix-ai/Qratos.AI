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
  CheckCircle2
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
   VISUAL 1: 4 Modes Cyclic Activation & Live Typewriter Output
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
      label: "Psych",
      sub: "Biases & Triggers",
      icon: Zap,
      fullText: "Trigger: Loss-aversion framing + micro-commitment CTA."
    }
  ];

  // Cycling timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % modes.length);
    }, 3600);
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
    }, 32);

    return () => clearInterval(typeInterval);
  }, [activeIdx]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white/[0.05] backdrop-blur-2xl rounded-[32px] border border-white/12 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
            4 DEDICATED WORKSPACES
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white]" />
          Memory Locked
        </span>
      </div>

      {/* 4 Mode Chips */}
      <div className="grid grid-cols-2 gap-2.5 my-3">
        {modes.map((mode, idx) => {
          const Icon = mode.icon;
          const isActive = activeIdx === idx;
          return (
            <div
              key={mode.id}
              onClick={() => setActiveIdx(idx)}
              className={`p-3 rounded-2xl transition-all duration-500 cursor-pointer flex items-center gap-2.5 relative overflow-hidden ${
                isActive
                  ? "bg-white/15 border-white/40 shadow-[0_0_24px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.3)] scale-[1.02]"
                  : "bg-white/[0.03] border-white/10 opacity-70 hover:opacity-100 hover:bg-white/[0.06]"
              } border`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent pointer-events-none" />
              )}
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  isActive ? "bg-white text-black shadow-md" : "bg-white/10 text-white"
                }`}
              >
                <Icon size={17} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-white tracking-tight">{mode.label}</span>
                <span className="block text-[10px] text-gray-400 truncate">{mode.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Animated Output Snippet Card with Typewriter */}
      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/15 min-h-[64px] flex items-center justify-between gap-3 shadow-inner">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
              Active Generation Preview ({modes[activeIdx].label})
            </span>
            {isTyping && (
              <span className="text-[8px] font-mono text-white/70 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Synthesizing
              </span>
            )}
          </div>
          <p className="text-xs text-white font-mono truncate transition-all duration-200">
            {typedText}
            <span className="animate-pulse text-white font-bold ml-0.5">|</span>
          </p>
        </div>
        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
          <Check size={12} className="text-white" />
        </div>
      </div>

      {/* Bottom Memory Context Flow */}
      <div className="mt-3 p-3.5 rounded-2xl bg-white/[0.05] border border-white/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0">
            <Database size={13} />
          </div>
          <div>
            <span className="block text-xs font-bold text-white">Persistent Memory & Context</span>
            <span className="block text-[10px] text-gray-400 font-mono">B2B SaaS • High-Ticket • Direct Tone</span>
          </div>
        </div>
        <span className="text-[9px] font-mono text-white uppercase font-bold tracking-wider shrink-0 bg-white/10 px-2 py-1 rounded border border-white/15">
          Sync 100%
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 2: Prompt Compilation (Guided Parameters -> Master Blueprint)
   ═══════════════════════════════════════════════════════════════ */
export const PromptCompilerVisual: React.FC = () => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white/[0.05] backdrop-blur-2xl rounded-[32px] border border-white/12 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
          PROMPT COMPILER ENGINE
        </span>
        <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
          Core & Max Unlocked
        </span>
      </div>

      {/* Comparison Stack */}
      <div className="space-y-3 my-3">
        {/* Flat generic prompt */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 opacity-60">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
            <span>Generic One-Liner (Other AI)</span>
            <span className="text-gray-500">Unstructured</span>
          </div>
          <p className="text-xs text-gray-400 italic">
            &quot;Write me a cold email for my coaching business...&quot;
          </p>
        </div>

        {/* Animated Compilation Beam */}
        <div className="relative h-4 flex items-center justify-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div 
            className={`absolute px-2.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono font-bold tracking-wider uppercase transition-all duration-700 shadow-[0_0_15px_rgba(255,255,255,0.6)] flex items-center gap-1 ${
              pulse ? "scale-110 opacity-100" : "scale-100 opacity-85"
            }`}
          >
            <Sparkles size={10} />
            <span>ROLE COMPILATION</span>
          </div>
        </div>

        {/* Murgii Master Structured Blueprint */}
        <div 
          className={`p-4 rounded-2xl bg-white/[0.08] border transition-all duration-700 ${
            pulse ? "border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.18)]" : "border-white/25 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-white mb-2">
            <span className="font-bold flex items-center gap-1">
              <Check size={12} className="text-white" />
              Murgii Master Prompt Blueprint
            </span>
            <span className="text-[9px] text-gray-300 font-mono">Draft 1 Persuasion</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] text-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold bg-white/15 px-1.5 py-0.5 rounded text-[9px] shrink-0">[ROLE]</span>
              <span className="text-gray-300 text-xs">Direct Response Copywriter & Behavioral Strategist</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold bg-white/15 px-1.5 py-0.5 rounded text-[9px] shrink-0">[FRAME]</span>
              <span className="text-gray-300 text-xs">Cialdini Scarcity + Loss Aversion Angle</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold bg-white/15 px-1.5 py-0.5 rounded text-[9px] shrink-0">[OUTPUT]</span>
              <span className="text-gray-300 text-xs">3 Pattern-Interrupt Hooks + Objection Crusher</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs text-gray-300">
        <span className="font-semibold">Copywriter Alignment</span>
        <span className="text-white font-mono font-bold">100% Market-Ready</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 3: Tiered Daily Credit Meter & Animated Counter Tick-Up
   ═══════════════════════════════════════════════════════════════ */
export const TierExpansionVisual: React.FC = () => {
  const [activeTier, setActiveTier] = useState<0 | 1 | 2>(1);
  const [displayCredits, setDisplayCredits] = useState(20);

  const tiers = [
    { name: "Basic (Free)", credits: 3, desc: "All 4 Modes Included", pct: 15 },
    { name: "Core ($29/mo)", credits: 20, desc: "Prompt Builder Unlocked", pct: 45 },
    { name: "Max ($97/mo)", credits: 60, desc: "Blueprint Studio + Priority", pct: 100 }
  ];

  // Cycling tier loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTier((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Smooth counter tick-up animation on tier change
  useEffect(() => {
    const target = tiers[activeTier].credits;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 12));
    
    const countTimer = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayCredits(target);
        clearInterval(countTimer);
      } else {
        setDisplayCredits(current);
      }
    }, 30);

    return () => clearInterval(countTimer);
  }, [activeTier]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white/[0.05] backdrop-blur-2xl rounded-[32px] border border-white/12 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
          DAILY QUOTA ENGINE
        </span>
        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Resets every 24h
        </span>
      </div>

      {/* 3 Tier Cards */}
      <div className="space-y-2 sm:space-y-2.5 my-2 sm:my-3">
        {tiers.map((tier, idx) => {
          const isSelected = activeTier === idx;
          return (
            <div
              key={tier.name}
              onClick={() => setActiveTier(idx as 0 | 1 | 2)}
              className={`p-2.5 sm:p-3 rounded-2xl transition-all duration-400 cursor-pointer flex items-center justify-between border ${
                isSelected
                  ? "bg-white/15 border-white/40 shadow-[0_4px_20px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.3)] scale-[1.02]"
                  : "bg-white/[0.03] border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block">{tier.name}</span>
                <span className="text-[10px] text-gray-400">{tier.desc}</span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-colors ${
                    isSelected ? "bg-white text-black shadow-sm" : "bg-white/10 text-gray-300"
                  }`}
                >
                  {tier.credits} / day
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry & Overage Section with Clean Spacing */}
      <div className="space-y-2.5 sm:space-y-3 mt-2 sm:mt-3">
        {/* Dynamic Animated Capacity Bar with Counter */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-black/60 border border-white/15 space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
            <span>Active Quota ({tiers[activeTier].name})</span>
            <span className="text-white font-bold font-mono text-xs">{displayCredits} Credits / Day</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative p-[1px]">
            <div
              className="h-full bg-white rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              style={{ width: `${tiers[activeTier].pct}%` }}
            />
          </div>
        </div>

        {/* Overage Policy Card */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs text-gray-300">
          <span className="font-semibold">Overage Policy</span>
          <span className="text-white font-mono font-bold">Zero Surprise Bills</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 4: Bolt Ecosystem & Sequential Node Sync
   ═══════════════════════════════════════════════════════════════ */
export const BoltEcosystemVisual: React.FC = () => {
  const [pulseIdx, setPulseIdx] = useState(0);
  const categories = ["Audience", "Offer", "Funnel", "Copy", "Ads", "Scale"];

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIdx((prev) => (prev + 1) % categories.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [categories.length]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white/[0.05] backdrop-blur-2xl rounded-[32px] border border-white/12 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
          BOLT REVENUE ECOSYSTEM
        </span>
        <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
          Max Full-Suite Link
        </span>
      </div>

      {/* 2 Connected Nodes with Animated Traveling Pulse */}
      <div className="space-y-3 my-2">
        <div className="flex items-center justify-between gap-2">
          {/* Node 1: Bolt Roadmap */}
          <div className="flex-1 p-3 rounded-2xl bg-white/[0.06] border border-white/20 text-center">
            <span className="block text-[10px] font-mono text-gray-400 uppercase">System A</span>
            <span className="block text-xs font-bold text-white mt-0.5">Bolt Execution Roadmap</span>
          </div>

          {/* Animated Connecting Synapse with traveling light packet */}
          <div className="relative w-12 h-6 flex items-center justify-center shrink-0">
            <div className="w-full h-[1.5px] bg-white/20" />
            <div className="absolute w-3 h-3 rounded-full bg-white/40 animate-ping" />
            <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
          </div>

          {/* Node 2: Murgii Engine */}
          <div className="flex-1 p-3 rounded-2xl bg-white/[0.06] border border-white/20 text-center">
            <span className="block text-[10px] font-mono text-gray-400 uppercase">System B</span>
            <span className="block text-xs font-bold text-white mt-0.5">Murgii Persuasion Engine</span>
          </div>
        </div>

        {/* 6 Category Roadmap Grid with sequential light-up */}
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat, i) => {
            const isPulsing = pulseIdx === i;
            return (
              <div
                key={cat}
                className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
                  isPulsing
                    ? "bg-white text-black border-white shadow-[0_0_18px_rgba(255,255,255,0.4)] scale-105"
                    : "bg-white/[0.04] border-white/10 text-white"
                }`}
              >
                <span className="block text-[10px] font-bold">{cat}</span>
                <span className={`block text-[8px] uppercase tracking-wider mt-0.5 ${isPulsing ? "text-neutral-800 font-semibold" : "text-gray-400"}`}>
                  {isPulsing ? "Syncing..." : "Linked"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Blueprint Studio Card */}
      <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/20 space-y-1">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Sparkles size={13} className="text-white" />
          Business Blueprint Studio & AI Assist
        </span>
        <p className="text-[11px] text-gray-300 leading-relaxed">
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
      title: "Define Brief & Lock Memory",
      desc: "Niche, audience, and brand tone load instantly from saved context so you never start from zero.",
      icon: Sliders,
      badge: "Memory-Linked"
    },
    {
      num: "02",
      title: "Cognitive Synthesis",
      desc: "Direct-response formulas, Cialdini triggers, and objection-reversal loops compile seamlessly.",
      icon: Cpu,
      badge: "Psych-Optimized"
    },
    {
      num: "03",
      title: "Conversion-Ready Copy",
      desc: "Multi-angle hook variants and structured body copy ready for instant 1-click deployment.",
      icon: Send,
      badge: "Conversion-Ready"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto rounded-[36px] border border-white/15 p-6 sm:p-10 bg-white/[0.05] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden mb-12">
      {/* Sleek Top Connected Progress Tracker Line (Positioned cleanly above the cards) */}
      <div className="hidden md:flex items-center justify-between mb-8 px-4 relative">
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-white/10 z-0">
          <div 
            className="h-full bg-white shadow-[0_0_12px_white] transition-all duration-700 ease-out"
            style={{ width: `${activeStep === 0 ? "0%" : activeStep === 1 ? "50%" : "100%"}` }}
          />
        </div>
        {steps.map((s, idx) => {
          const isActive = activeStep === idx;
          const isPassed = activeStep >= idx;
          return (
            <div 
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className="relative z-10 flex items-center gap-2.5 cursor-pointer group"
            >
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-500 ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.8)] scale-110"
                    : isPassed
                    ? "bg-white/30 text-white border border-white/40"
                    : "bg-black/80 text-white/40 border border-white/20"
                }`}
              >
                {s.num}
              </div>
              <span className={`text-xs font-bold transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-white/80"}`}>
                {s.badge}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          const isPassed = activeStep >= idx;

          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20, x: idx === 0 ? -16 : idx === 2 ? 16 : 0 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.015 }}
              onClick={() => setActiveStep(idx)}
              className={`p-6 rounded-3xl border transition-all duration-500 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isActive
                  ? "bg-white/15 border-white/45 shadow-[0_0_35px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.35)]"
                  : isPassed
                  ? "bg-white/[0.06] border-white/20 hover:border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                  : "bg-white/[0.02] border-white/10 opacity-70 hover:opacity-100 hover:border-white/25"
              }`}
            >
              {/* Subtle Ambient Radial Highlight for the Active Step */}
              {isActive && (
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/[0.12] rounded-full blur-[36px] pointer-events-none" />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? "bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.4)] scale-105" 
                        : "bg-white/10 text-white group-hover:scale-105 group-hover:bg-white/15"
                    }`}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <span className={`text-3xl font-black font-nohemi transition-colors ${
                    isActive ? "text-white/80" : "text-white/25 group-hover:text-white/50"
                  }`}>
                    {step.num}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 font-nohemi tracking-tight">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono relative z-10">
                <span className="text-white/80 bg-white/10 px-2 py-0.5 rounded border border-white/15 font-bold uppercase tracking-wider text-[9px]">
                  {step.badge}
                </span>
                <span className={isActive ? "text-white font-bold flex items-center gap-1.5" : "text-gray-400"}>
                  {isActive ? "Active Phase" : isPassed ? "Completed" : "Queued"}
                  {isActive && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 MASTER FIX: Interactive Simulated Prompt Builder Demo
   ═══════════════════════════════════════════════════════════════ */
export const PromptStudioInteractiveDemo: React.FC<{ activeArchetype: string; onSelectArchetype: (id: string) => void }> = ({
  activeArchetype,
  onSelectArchetype
}) => {
  // Step in simulated animation sequence:
  // 0: Cursor moving to field 1 (Niche)
  // 1: Click field 1 (lock-in)
  // 2: Cursor moving to field 2 (Goal)
  // 3: Click field 2 (lock-in)
  // 4: Cursor moving to field 3 (Frame)
  // 5: Click field 3 (lock-in)
  // 6: Assembly stage: output label 1 (Role)
  // 7: Assembly stage: output label 2 (Target Market)
  // 8: Assembly stage: output label 3 (Triggers)
  // 9: Assembly stage: output label 4 (Deliverable)
  // 10: Hold complete master state, then loop back
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { step: 0, delay: 600 },
      { step: 1, delay: 600 },
      { step: 2, delay: 700 },
      { step: 3, delay: 600 },
      { step: 4, delay: 700 },
      { step: 5, delay: 600 },
      { step: 6, delay: 500 },
      { step: 7, delay: 500 },
      { step: 8, delay: 500 },
      { step: 9, delay: 600 },
      { step: 10, delay: 2400 } // Pause on finished prompt
    ];

    let currentIdx = 0;
    let timer: NodeJS.Timeout;

    const runNext = () => {
      setAnimStep(sequence[currentIdx].step);
      const nextDelay = sequence[currentIdx].delay;
      currentIdx = (currentIdx + 1) % sequence.length;
      timer = setTimeout(runNext, nextDelay);
    };

    timer = setTimeout(runNext, 400);

    return () => clearTimeout(timer);
  }, [activeArchetype]);

  // Cursor coordinates based on animation step
  const cursorCoords = (() => {
    switch (animStep) {
      case 0:
      case 1:
        return { x: 42, y: 32, isClicking: animStep === 1 };
      case 2:
      case 3:
        return { x: 42, y: 55, isClicking: animStep === 3 };
      case 4:
      case 5:
        return { x: 42, y: 78, isClicking: animStep === 5 };
      default:
        return { x: 92, y: 92, isClicking: false };
    }
  })();

  const field1Locked = animStep >= 1 && animStep <= 10;
  const field2Locked = animStep >= 3 && animStep <= 10;
  const field3Locked = animStep >= 5 && animStep <= 10;

  const showBlock1 = animStep >= 6;
  const showBlock2 = animStep >= 7;
  const showBlock3 = animStep >= 8;
  const showBlock4 = animStep >= 9;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-stretch relative">
      {/* LEFT COLUMN: 3 Simple Guided Input Parameters with Simulated Cursor Lock-in */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-4 relative">
        {/* Animated Simulated Cursor */}
        {animStep <= 5 && (
          <AnimatedCursor 
            x={cursorCoords.x} 
            y={cursorCoords.y} 
            isClicking={cursorCoords.isClicking} 
          />
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
              01. Guided Parameters
            </span>
            <span className="text-[10px] font-mono text-white/80 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/20">
              <Sparkles size={11} className="text-white" />
              Live Simulated Setup
            </span>
          </div>

          {/* Field 1: Target Niche */}
          <div 
            className={`p-3.5 rounded-2xl transition-all duration-400 border ${
              field1Locked
                ? "bg-white/12 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] scale-[1.01]"
                : "bg-white/[0.03] border-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                Target Niche & Audience
              </label>
              {field1Locked && (
                <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1 animate-fadeIn">
                  <Check size={11} className="text-white" /> Locked
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-white">
              {activeArchetype === "email" ? "B2B SaaS & High-Ticket Operators" : activeArchetype === "ads" ? "Performance E-Commerce & Wellness" : activeArchetype === "landing" ? "Enterprise AI Developer Platforms" : "High-Ticket Course Buyers & Founders"}
            </div>
          </div>

          {/* Field 2: Primary Goal */}
          <div 
            className={`p-3.5 rounded-2xl transition-all duration-400 border ${
              field2Locked
                ? "bg-white/12 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] scale-[1.01]"
                : "bg-white/[0.03] border-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                Primary Conversion Goal
              </label>
              {field2Locked && (
                <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1 animate-fadeIn">
                  <Check size={11} className="text-white" /> Locked
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-white">
              {activeArchetype === "email" ? "Drive urgency for demo bookings before launch" : activeArchetype === "ads" ? "Break scroll fatigue with pattern-interrupt hooks" : activeArchetype === "landing" ? "Convert cold traffic with proof & risk reversal" : "Overcome buying friction with cognitive reframing"}
            </div>
          </div>

          {/* Field 3: Persuasion Bias & Tone */}
          <div 
            className={`p-3.5 rounded-2xl transition-all duration-400 border ${
              field3Locked
                ? "bg-white/12 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] scale-[1.01]"
                : "bg-white/[0.03] border-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                Psychological Framing
              </label>
              {field3Locked && (
                <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1 animate-fadeIn">
                  <Check size={11} className="text-white" /> Locked
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-white">
              {activeArchetype === "email" ? "Cialdini Scarcity + Authority Framing" : activeArchetype === "ads" ? "Problem-Agitate-Solve + Loss Aversion" : activeArchetype === "landing" ? "Proof Stacking + Risk Inversion Guarantee" : "Commitment Pacing + Objection Annihilation"}
            </div>
          </div>
        </div>

        {/* Confident Value Hook */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/12 flex items-center gap-3 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.1)]">
          <Sparkles size={16} className="text-white shrink-0" />
          <p className="text-xs text-gray-200 font-medium leading-relaxed">
            Parameters assemble automatically into a structured, role-framed master blueprint.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Pure White Glass Assembling Master Prompt Panel (No fake code chrome) */}
      <div className="lg:col-span-7 flex flex-col rounded-[28px] bg-white/[0.05] backdrop-blur-2xl border border-white/15 p-5 sm:p-7 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.15)] min-h-[380px] justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
            <span className="text-xs font-bold text-white font-nohemi tracking-tight">
              Murgii Master Prompt Assembly
            </span>
          </div>
          <span className="text-[10px] font-mono text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wider font-bold">
            {animStep >= 9 ? "100% Market-Ready" : "Compiling Blueprint..."}
          </span>
        </div>

        {/* Sequential Assembling Master Prompt Cards */}
        <div className="space-y-2.5 my-auto">
          {/* Output Block 1: Role */}
          <div 
            className={`p-3 rounded-2xl border transition-all duration-500 ${
              showBlock1 
                ? "bg-white/10 border-white/30 opacity-100 translate-y-0 shadow-sm" 
                : "bg-white/[0.02] border-white/5 opacity-20 translate-y-2"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                [ROLE & FRAME]
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Expert Direct-Response Copywriter</span>
            </div>
            <p className="text-xs text-gray-200 font-medium">
              Act as an elite direct-response conversion copywriter specializing in {activeArchetype === "email" ? "high-converting email sequencing" : activeArchetype === "ads" ? "viral paid performance ad hooks" : activeArchetype === "landing" ? "high-ticket landing page funnels" : "behavioral persuasion architecture"}.
            </p>
          </div>

          {/* Output Block 2: Target Market */}
          <div 
            className={`p-3 rounded-2xl border transition-all duration-500 ${
              showBlock2 
                ? "bg-white/10 border-white/30 opacity-100 translate-y-0 shadow-sm" 
                : "bg-white/[0.02] border-white/5 opacity-20 translate-y-2"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                [TARGET & PAIN]
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Validated Audience Vector</span>
            </div>
            <p className="text-xs text-gray-200 font-medium">
              Target Audience: {activeArchetype === "email" ? "B2B SaaS executives and agency operators facing pipeline drop-offs" : activeArchetype === "ads" ? "High-intent consumers scrolling through congested feeds" : activeArchetype === "landing" ? "Enterprise decision-makers requiring rapid ROI validation" : "Skeptical buyers requiring proof mechanisms"}.
            </p>
          </div>

          {/* Output Block 3: Triggers */}
          <div 
            className={`p-3 rounded-2xl border transition-all duration-500 ${
              showBlock3 
                ? "bg-white/10 border-white/30 opacity-100 translate-y-0 shadow-sm" 
                : "bg-white/[0.02] border-white/5 opacity-20 translate-y-2"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                [BEHAVIORAL TRIGGERS]
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Cognitive Levers</span>
            </div>
            <p className="text-xs text-gray-200 font-medium">
              Enforce Cialdini Scarcity, loss-aversion pacing, and zero-fluff pattern interrupts to drive immediate conversion action.
            </p>
          </div>

          {/* Output Block 4: Deliverables */}
          <div 
            className={`p-3 rounded-2xl border transition-all duration-500 ${
              showBlock4 
                ? "bg-white/12 border-white/40 opacity-100 translate-y-0 shadow-md" 
                : "bg-white/[0.02] border-white/5 opacity-20 translate-y-2"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                [DELIVERABLES]
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Market-Ready Package</span>
            </div>
            <p className="text-xs text-gray-200 font-medium">
              Output 3 high-impact hook variations, core persuasion body loops, objection-reversal stack, and strong CTA.
            </p>
          </div>
        </div>

        {/* Footer info strip */}
        <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
          <span className="font-medium">Architecture Status:</span>
          <span className="text-white font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-white" />
            Synchronized with Murgii Engine
          </span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: 4 Specialized Mode Micro-Demo Cards
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
          }, 3200);
        }
      }, 35);
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
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: delay * 0.001, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-5 sm:p-6 rounded-3xl border border-white/12 hover:border-white/40 transition-colors duration-300 flex flex-col justify-between group relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.1),0_0_24px_rgba(255,255,255,0.06)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.12)] cursor-pointer"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px) saturate(1.3)",
        WebkitBackdropFilter: "blur(20px) saturate(1.3)"
      }}
    >
      {/* Dynamic Hover Glow Backlight */}
      <div 
        className={`absolute -top-16 -right-16 w-36 h-36 rounded-full bg-white/10 blur-[30px] pointer-events-none transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`} 
      />

      <div>
        <div className="flex items-center justify-between mb-3.5 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all duration-300">
            <Icon size={20} strokeWidth={2.2} />
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1.5 font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
            Active Mode
          </span>
        </div>

        <h4 className="text-base font-bold text-white font-nohemi mb-0.5 relative z-10">
          {name}
        </h4>
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-3 font-semibold relative z-10">
          {role}
        </span>

        {/* 2-3 Short Punchy Key-Point Bullets (max 4-5 words each) */}
        {bullets && bullets.length > 0 ? (
          <ul className="space-y-1.5 mb-5 relative z-10">
            {bullets.map((item, bIdx) => (
              <li key={bIdx} className="text-xs text-neutral-300 flex items-center gap-2 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0 shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
                <span className="leading-tight text-gray-200">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-neutral-300 leading-relaxed mb-5 font-normal relative z-10">
            {desc}
          </p>
        )}
      </div>

      {/* Live Animated Output Preview with Blinking Terminal Cursor */}
      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 min-h-[56px] flex items-center justify-between gap-2 shadow-inner group-hover:border-white/20 transition-colors relative z-10">
        <div className="min-w-0 flex-1">
          <span className="block text-[8px] font-mono uppercase tracking-widest text-gray-400 mb-1 font-bold">
            Live Stream Sample
          </span>
          <p className="text-[11px] font-mono text-white truncate font-medium">
            {typed}
            <span className="animate-pulse font-extrabold text-white ml-0.5 inline-block">|</span>
          </p>
        </div>
        <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
          <Check size={11} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};
