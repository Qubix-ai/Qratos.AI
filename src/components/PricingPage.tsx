import { useState, useEffect } from "react";
import { Check, X, Sparkles, ExternalLink, Zap, Shield, Crown, ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchUserPlan } from "../lib/userAccount";
import LightPillar from "./LightPillar";
import StarBorder from "./StarBorder";

interface PricingPageProps {
  user: any;
  onGoToChat?: () => void;
  onGoToAccount?: () => void;
}

interface FeatureItemData {
  id: string;
  title: string;
  highlight?: string;
  explanation: string;
  included: boolean;
}

const BASIC_FEATURES: FeatureItemData[] = [
  {
    id: "basic-credits",
    title: "3 credits per day",
    highlight: "3 credits",
    explanation: "Generate 3 complete assets every 24 hours to test hooks, draft urgent emails, or evaluate psychology angles.",
    included: true
  },
  {
    id: "basic-modes",
    title: "Access to all 4 modes: Emails, Ads, Pages, Psych",
    highlight: "Emails, Ads, Pages, Psych",
    explanation: "Write across multi-email flows, high-CTR ads, landing page sections, and behavioral persuasion triggers.",
    included: true
  },
  {
    id: "basic-builder",
    title: "Prompt Builder access",
    explanation: "Guided prompt architecture with conversion vectors is reserved for Core and Max tiers.",
    included: false
  },
  {
    id: "basic-bolt",
    title: "Bolt account activity visibility",
    explanation: "Multi-category roadmap tracking and interactive blueprints require a connected Core or Max plan.",
    included: false
  }
];

const CORE_FEATURES: FeatureItemData[] = [
  {
    id: "core-credits",
    title: "20 credits per day",
    highlight: "20 credits",
    explanation: "Ample daily generation bandwidth designed for regular publishing, client deliverables, and multi-angle testing.",
    included: true
  },
  {
    id: "core-builder",
    title: "Prompt Builder access (Guided input architect)",
    highlight: "Prompt Builder access",
    explanation: "Assembles role-framed master prompts from guided questions for tailored, high-converting first drafts.",
    included: true
  },
  {
    id: "core-bolt",
    title: "Connects to Bolt Core: full 6-category roadmap",
    highlight: "Bolt Core",
    explanation: "Syncs your workspace with Bolt Core's 6-category execution roadmap to keep strategy and copy aligned.",
    included: true
  },
  {
    id: "core-library",
    title: "Full AI Prompt Library access",
    highlight: "Prompt Library",
    explanation: "Browse and deploy proven direct-response templates across emails, VSLs, ads, and landing funnels.",
    included: true
  }
];

const MAX_FEATURES: FeatureItemData[] = [
  {
    id: "max-credits",
    title: "60 credits per day (3x Core capacity)",
    highlight: "60 credits",
    explanation: "Maximum generation quota for aggressive multi-channel scaling, agency workloads, and volume testing.",
    included: true
  },
  {
    id: "max-bolt",
    title: "Connects to Bolt Max suite",
    highlight: "Bolt Max",
    explanation: "Complete cross-ecosystem synchronization with Bolt Max's advanced roadmap and revenue execution suite.",
    included: true
  },
  {
    id: "max-blueprint-assist",
    title: "AI Blueprint Assist & Qreato AI engine",
    highlight: "AI Blueprint Assist",
    explanation: "Automated structure recommendations and high-performance model routing for complete marketing funnels.",
    included: true
  },
  {
    id: "max-studio",
    title: "Your Business Blueprint interactive studio",
    highlight: "Business Blueprint",
    explanation: "Visually architect and iterate on entire offer funnels, customer journeys, and monetization systems.",
    included: true
  }
];

function ExpandableFeatureRow({
  item,
  isExpanded,
  onToggle
}: {
  item: FeatureItemData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-xl transition-colors duration-200 ${item.included ? "text-gray-200" : "text-gray-400 opacity-65"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/[0.06] active:bg-white/[0.09] transition-all cursor-pointer text-left group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              item.included
                ? "bg-white/15 border border-white/30 text-white group-hover:bg-white group-hover:text-black"
                : "bg-white/5 border border-white/10 text-gray-500"
            }`}
          >
            {item.included ? <Check size={11} /> : <X size={11} className="text-gray-400" />}
          </div>
          <span className={`text-xs font-medium leading-tight ${item.included ? "text-gray-200" : "text-gray-400 line-through"}`}>
            {item.highlight && item.title.includes(item.highlight) ? (
              <>
                {item.title.split(item.highlight)[0]}
                <strong className="text-white font-bold">{item.highlight}</strong>
                {item.title.split(item.highlight)[1]}
              </>
            ) : (
              item.title
            )}
          </span>
        </div>
        <div className="shrink-0 pl-1 text-gray-400 group-hover:text-white transition-colors">
          <ChevronDown
            size={13}
            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180 text-white" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-6 pr-2 pt-1 pb-2">
              <p className="text-[11px] text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/10 shadow-inner">
                {item.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PricingPage({ user, onGoToChat, onGoToAccount }: PricingPageProps) {
  const [currentPlan, setCurrentPlan] = useState<"basic" | "core" | "max" | "none">("none");
  const [, setLoading] = useState(true);
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

  const toggleFeature = (id: string) => {
    setExpandedFeatureId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    async function loadPlan() {
      const uid = user?.id || user?.uid;
      if (uid) {
        const planData = await fetchUserPlan(uid, user.user_metadata, user.email);
        setCurrentPlan(planData.plan);
      } else {
        setCurrentPlan("none");
      }
      setLoading(false);
    }
    loadPlan();
  }, [user]);

  // Is user effectively on basic (either 'basic' or 'none' default tier)?
  const isBasic = currentPlan === "basic" || currentPlan === "none";
  const isCore = currentPlan === "core";
  const isMax = currentPlan === "max";

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#07050E] text-gray-200 overflow-y-auto custom-scrollbar relative">
      {/* Light Pillar Shader Background Behind Pricing Area & Cards */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <LightPillar
          topColor="#3410c5"
          bottomColor="#84CC16"
          intensity={0.6}
          rotationSpeed={2}
          glowAmount={0.015}
          pillarWidth={5}
          pillarHeight={0.4}
          noiseIntensity={1.8}
          pillarRotation={154}
          interactive={false}
          mixBlendMode="normal"
          quality="low"
        />
        {/* Subtle contrast gradient ensuring card text readability remains pristine */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,5,14,0.35)_0%,rgba(7,5,14,0.85)_100%)] pointer-events-none" />
      </div>

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        {/* Back / Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onGoToChat}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-200 hover:text-white transition-colors cursor-pointer bg-[#0e0c18]/90 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 backdrop-blur-md shadow-md"
          >
            <ArrowLeft size={14} />
            <span>Back to Workspace</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={onGoToAccount}
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-gray-200 transition-all cursor-pointer bg-[#0e0c18]/90 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 backdrop-blur-md shadow-md"
            >
              <span>View Account Details</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent font-nohemi leading-tight mb-4"
          >
            Scale Your Direct Response Machine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-200 text-sm sm:text-base leading-relaxed"
          >
            From essential daily persuasion triggers to full multi-modal roadmap acceleration with Bolt.
          </motion.p>
        </div>

        {/* 3 Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
          
          {/* TIER 1: BASIC (FREE) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border transition-all duration-300 ${
              isBasic && user
                ? "bg-[#0c081e]/50 border-white/30 shadow-[0_20px_44px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
                : "bg-[#0c081e]/35 border-white/15 hover:border-white/30 shadow-[0_16px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]"
            }`}
            style={{
              backdropFilter: "blur(20px) saturate(1.3)",
              WebkitBackdropFilter: "blur(20px) saturate(1.3)"
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-sm">
                    <Shield size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight font-nohemi">Basic</h2>
                </div>
                {isBasic && user && (
                  <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/30 text-[9px] font-black text-white tracking-wider uppercase">
                    Your Current Plan
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight font-nohemi">$0</span>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">/ Free</span>
                </div>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Applies to Murgii only. Not connected to Bolt roadmap.
                </p>
              </div>

              <div className="h-px bg-white/10 my-6" />

              <div className="space-y-2 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Included Capabilities</p>
                  <span className="text-[9px] font-mono text-gray-400">Click for details</span>
                </div>
                
                {BASIC_FEATURES.map((item) => (
                  <ExpandableFeatureRow
                    key={item.id}
                    item={item}
                    isExpanded={expandedFeatureId === item.id}
                    onToggle={() => toggleFeature(item.id)}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              {isBasic && user ? (
                <div className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-center text-xs font-bold text-white cursor-default">
                  Active Default Tier
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onGoToChat}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-center text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
                >
                  Start with Basic
                </button>
              )}
            </div>
          </motion.div>

          {/* TIER 2: CORE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border transition-all duration-300 ${
              isCore
                ? "bg-[#0c081e]/55 border-white/40 shadow-[0_22px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                : "bg-[#0c081e]/40 border-white/20 hover:border-white/35 shadow-[0_16px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]"
            }`}
            style={{
              backdropFilter: "blur(20px) saturate(1.3)",
              WebkitBackdropFilter: "blur(20px) saturate(1.3)"
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                    <Zap size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight font-nohemi">Core</h2>
                </div>
                {isCore ? (
                  <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/30 text-[9px] font-black text-white tracking-wider uppercase">
                    Your Current Plan
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-gray-300 uppercase">
                    Direct Response
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight font-nohemi">$29</span>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">/ month</span>
                </div>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Full direct response generation &amp; shared Bolt Core integration.
                </p>
              </div>

              <div className="h-px bg-white/10 my-6" />

              <div className="space-y-2 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Everything in Basic, plus:</p>
                  <span className="text-[9px] font-mono text-gray-400">Click for details</span>
                </div>
                
                {CORE_FEATURES.map((item) => (
                  <ExpandableFeatureRow
                    key={item.id}
                    item={item}
                    isExpanded={expandedFeatureId === item.id}
                    onToggle={() => toggleFeature(item.id)}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              {isCore ? (
                <div className="w-full py-3.5 rounded-xl bg-white/15 border border-white/30 text-center text-xs font-black text-white uppercase tracking-wider cursor-default">
                  Your Current Plan
                </div>
              ) : (
                <a
                  href="https://whop.com/qreato/ai-leverage"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-center text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,255,255,0.25)] cursor-pointer"
                >
                  <span>Get Core</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </motion.div>

          {/* TIER 3: MAX (MOST POPULAR) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="relative h-full flex flex-col"
          >
            <StarBorder
              as="div"
              className="w-full h-full !flex !flex-col"
              innerClassName={`relative p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 overflow-hidden h-full ${
                isMax
                  ? "!bg-[#0e0924]/80 !border-white/45 shadow-[0_26px_58px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]"
                  : "!bg-[#0e0924]/60 !border-white/25 hover:!border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
              }`}
              color="magenta"
              speed="5s"
              thickness={1}
            >
              {/* MOST POPULAR BADGE - Clean White/Silver Ribbon */}
              <div className="absolute top-0 right-0 z-20">
                <div className="bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] py-1.5 px-5 rounded-bl-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Most Popular
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-[0_0_16px_rgba(255,255,255,0.25)]">
                      <Crown size={16} />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight font-nohemi">Max</h2>
                  </div>
                  {isMax && (
                    <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/30 text-[9px] font-black text-white tracking-wider uppercase">
                      Your Current Plan
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight font-nohemi">$97</span>
                    <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">/ month</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    Maximum credit capacity &amp; complete Qreato AI ecosystem integration.
                  </p>
                </div>

                <div className="h-px bg-white/10 my-6" />

                <div className="space-y-2 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Everything in Core, plus:</p>
                    <span className="text-[9px] font-mono text-gray-400">Click for details</span>
                  </div>
                  
                  {MAX_FEATURES.map((item) => (
                    <ExpandableFeatureRow
                      key={item.id}
                      item={item}
                      isExpanded={expandedFeatureId === item.id}
                      onToggle={() => toggleFeature(item.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                {isMax ? (
                  <div className="w-full py-3.5 rounded-xl bg-white/15 border border-white/30 text-center text-xs font-black text-white uppercase tracking-wider cursor-default">
                    Your Current Plan
                  </div>
                ) : (
                  <a
                    href="https://whop.com/qreato/qreato-max"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-center text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
                  >
                    <span>Get Max</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </StarBorder>
          </motion.div>

        </div>

        {/* Enterprise & Shared Database Note */}
        <div className="rounded-2xl p-6 bg-[#0c081e]/40 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white font-nohemi">Unified Cross-App Infrastructure</h3>
            <p className="text-xs text-gray-300">
              Murgii shares authenticated state and roadmap milestones directly with your Bolt account.
            </p>
          </div>
          <a
            href="https://bolt.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white flex items-center gap-2 transition-colors shrink-0"
          >
            <span>Open Bolt Studio</span>
            <ExternalLink size={12} className="text-white" />
          </a>
        </div>
      </div>
    </div>
  );
}

