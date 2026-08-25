import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Target, 
  Globe, 
  Zap, 
  Database, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Layers, 
  Sliders, 
  Cpu, 
  Send 
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   VISUAL 1: 4 Modes Cyclic Activation & Persistent Memory Flow
   ═══════════════════════════════════════════════════════════════ */
export const ModesCycleVisual: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const modes = [
    {
      id: "emails",
      label: "Emails",
      sub: "Sequences & Drips",
      icon: Mail,
      snippet: "Subject: Quick question about scaling [Offer]..."
    },
    {
      id: "ads",
      label: "Ads",
      sub: "Hooks & Angles",
      icon: Target,
      snippet: "Hook: Stop losing 64% of qualified clicks on draft 1."
    },
    {
      id: "pages",
      label: "Pages",
      sub: "Sales & Landing",
      icon: Globe,
      snippet: "Headline: The Persuasion Engine Built for Operators."
    },
    {
      id: "psych",
      label: "Psych",
      sub: "Biases & Triggers",
      icon: Zap,
      snippet: "Trigger: Loss-aversion framing + micro-commitment CTA."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % modes.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [modes.length]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white/[0.02] backdrop-blur-2xl rounded-[32px] border border-white/15 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.85)]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold">
            4 DEDICATED WORKSPACES
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
                  ? "bg-white/15 border-white/50 shadow-[0_0_24px_rgba(255,255,255,0.18),inset_0_1px_1px_rgba(255,255,255,0.4)] scale-[1.02]"
                  : "bg-white/[0.04] border-white/10 opacity-70 hover:opacity-100 hover:bg-white/[0.08]"
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

      {/* Live Animated Output Snippet Card */}
      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/15 min-h-[58px] flex items-center justify-between gap-3 shadow-inner">
        <div className="min-w-0">
          <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-0.5">
            Active Generation Preview ({modes[activeIdx].label})
          </span>
          <p className="text-xs text-gray-200 font-mono truncate transition-all duration-300">
            {modes[activeIdx].snippet}
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
            <span className="block text-[10px] text-gray-400 font-mono">B2B SaaS • High-Ticket • Punchy Direct</span>
          </div>
        </div>
        <span className="text-[9px] font-mono text-white/80 uppercase font-bold tracking-wider shrink-0 bg-white/10 px-2 py-1 rounded">
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
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white/[0.02] backdrop-blur-2xl rounded-[32px] border border-white/15 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.85)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold">
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
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div 
            className={`absolute px-2.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono font-bold tracking-wider uppercase transition-all duration-700 shadow-[0_0_15px_rgba(255,255,255,0.6)] flex items-center gap-1 ${
              pulse ? "scale-110 opacity-100" : "scale-100 opacity-80"
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
   VISUAL 3: Tiered Daily Credit Meter & Capacity Expansion
   ═══════════════════════════════════════════════════════════════ */
export const TierExpansionVisual: React.FC = () => {
  const [activeTier, setActiveTier] = useState<0 | 1 | 2>(1);

  const tiers = [
    { name: "Basic (Free)", credits: 20, desc: "All 4 Modes Included", pct: "20%" },
    { name: "Core ($29/mo)", credits: 40, desc: "Prompt Builder Unlocked", pct: "40%" },
    { name: "Max ($97/mo)", credits: 100, desc: "Blueprint Studio + Priority", pct: "100%" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTier((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white/[0.02] backdrop-blur-2xl rounded-[32px] border border-white/15 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.85)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold">
          DAILY QUOTA ENGINE
        </span>
        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
          Resets every 24h
        </span>
      </div>

      {/* 3 Tier Cards */}
      <div className="space-y-2.5 my-3">
        {tiers.map((tier, idx) => {
          const isSelected = activeTier === idx;
          return (
            <div
              key={tier.name}
              onClick={() => setActiveTier(idx as 0 | 1 | 2)}
              className={`p-3 rounded-2xl transition-all duration-400 cursor-pointer flex items-center justify-between border ${
                isSelected
                  ? "bg-white/15 border-white/40 shadow-[0_4px_20px_rgba(255,255,255,0.15)] scale-[1.02]"
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
                    isSelected ? "bg-white text-black" : "bg-white/10 text-gray-300"
                  }`}
                >
                  {tier.credits} / day
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Animated Capacity Bar */}
      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/15 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
          <span>Active Capacity ({tiers[activeTier].name})</span>
          <span className="text-white font-bold font-mono">{tiers[activeTier].credits} Credits/Day</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-white rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{ width: tiers[activeTier].pct }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs text-gray-300">
        <span className="font-semibold">Overage Policy</span>
        <span className="text-white font-mono font-bold">Zero Surprise Bills</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VISUAL 4: Bolt Ecosystem & Blueprint Studio Synchronization
   ═══════════════════════════════════════════════════════════════ */
export const BoltEcosystemVisual: React.FC = () => {
  const [pulseIdx, setPulseIdx] = useState(0);
  const categories = ["Audience", "Offer", "Funnel", "Copy", "Ads", "Scale"];

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIdx((prev) => (prev + 1) % categories.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [categories.length]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 bg-white/[0.02] backdrop-blur-2xl rounded-[32px] border border-white/15 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.85)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold">
          BOLT REVENUE ECOSYSTEM
        </span>
        <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
          Max Full-Suite Link
        </span>
      </div>

      {/* 2 Connected Nodes with Animated Pulse Link */}
      <div className="space-y-3 my-2">
        <div className="flex items-center justify-between gap-2">
          {/* Node 1: Bolt Roadmap */}
          <div className="flex-1 p-3 rounded-2xl bg-white/[0.06] border border-white/20 text-center">
            <span className="block text-[10px] font-mono text-gray-400 uppercase">System A</span>
            <span className="block text-xs font-bold text-white mt-0.5">Bolt Execution Roadmap</span>
          </div>

          {/* Animated Connecting Synapse */}
          <div className="relative w-12 h-6 flex items-center justify-center shrink-0">
            <div className="w-full h-[1.5px] bg-white/20" />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-90 shadow-[0_0_10px_white]" />
            <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
          </div>

          {/* Node 2: Murgii Engine */}
          <div className="flex-1 p-3 rounded-2xl bg-white/[0.06] border border-white/20 text-center">
            <span className="block text-[10px] font-mono text-gray-400 uppercase">System B</span>
            <span className="block text-xs font-bold text-white mt-0.5">Murgii Persuasion Engine</span>
          </div>
        </div>

        {/* 6 Category Roadmap Grid */}
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat, i) => {
            const isPulsing = pulseIdx === i;
            return (
              <div
                key={cat}
                className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
                  isPulsing
                    ? "bg-white text-black border-white shadow-[0_0_16px_rgba(255,255,255,0.4)] scale-105"
                    : "bg-white/[0.04] border-white/10 text-white"
                }`}
              >
                <span className="block text-[10px] font-bold">{cat}</span>
                <span className={`block text-[8px] uppercase tracking-wider mt-0.5 ${isPulsing ? "text-neutral-700" : "text-gray-400"}`}>
                  Active Sync
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
      desc: "Niche, audience, and tone load instantly from saved context.",
      icon: Sliders
    },
    {
      num: "02",
      title: "Cognitive Synthesis",
      desc: "Direct-response formulas & behavioral triggers compile seamlessly.",
      icon: Cpu
    },
    {
      num: "03",
      title: "Conversion-Ready Copy",
      desc: "Market-tested variants ready for instant 1-click publishing.",
      icon: Send
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-[32px] border border-white/15 p-6 sm:p-8 bg-white/[0.03] backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] relative overflow-hidden mb-12">
      {/* Background Subtle Linear Track */}
      <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[1.5px] bg-gradient-to-r from-white/10 via-white/30 to-white/10 z-0">
        <div 
          className="h-full bg-white shadow-[0_0_12px_white] transition-all duration-700"
          style={{ width: `${(activeStep + 1) * 33.3}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          const isPassed = activeStep >= idx;

          return (
            <div
              key={step.num}
              onClick={() => setActiveStep(idx)}
              className={`p-5 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "bg-white/15 border-white/40 shadow-[0_0_24px_rgba(255,255,255,0.15)] scale-[1.02]"
                  : isPassed
                  ? "bg-white/[0.06] border-white/20"
                  : "bg-white/[0.02] border-white/10 opacity-70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                      isActive ? "bg-white text-black shadow-md" : "bg-white/10 text-white"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <span className="text-2xl font-black font-nohemi text-white/40">
                    {step.num}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1.5 font-nohemi">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-400">Step {idx + 1} of 3</span>
                <span className={isActive ? "text-white font-bold flex items-center gap-1" : "text-gray-500"}>
                  {isActive ? "Active Processing" : isPassed ? "Complete" : "Queued"}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
