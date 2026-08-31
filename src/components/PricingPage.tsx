import { useState, useEffect } from "react";
import { ExternalLink, Zap, Shield, Crown, ArrowRight, ArrowLeft, ChevronDown, Sparkles } from "lucide-react";
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
  description: string;
}

const BASIC_FEATURES: FeatureItemData[] = [
  {
    id: "basic-emails",
    title: "Emails & campaigns",
    description: "Draft high-converting email sequences and campaign messages with structured direct-response strategy."
  },
  {
    id: "basic-hooks",
    title: "Hooks & angles",
    description: "Generate scroll-stopping hooks and unique positioning angles tailored to your target audience."
  },
  {
    id: "basic-pages",
    title: "Landing Pages",
    description: "Structure persuasive sales pages and landing copy built for cold traffic conversion."
  },
  {
    id: "basic-psych",
    title: "Psych",
    description: "Leverage behavioral triggers, urgency vectors, and deep psychological persuasion frameworks."
  },
  {
    id: "basic-contents",
    title: "Contents",
    description: "Create high-retention content scripts, social posts, and thought leadership copy."
  },
  {
    id: "basic-challenge",
    title: "Challenge",
    description: "Access the Copy Score Challenge to benchmark your copy against direct response standards."
  }
];

const CORE_FEATURES: FeatureItemData[] = [
  {
    id: "core-limits",
    title: "Higher usage limits",
    description: "More room to research, iterate, rewrite and develop campaigns without constantly hitting limits."
  },
  {
    id: "core-gen",
    title: "Full Murgii generation",
    description: "Create emails, ads, pages, contents and persuasion strategies whenever you need them."
  },
  {
    id: "core-builder",
    title: "Guided Prompt Builder",
    description: "Turn a rough idea into a structured prompt without learning prompt engineering."
  },
  {
    id: "core-bolt",
    title: "Bolt Core",
    description: "Move from copy into the complete creator-business roadmap."
  },
  {
    id: "core-library",
    title: "Full Prompt Library",
    description: "Start from proven structures instead of blank pages."
  },
  {
    id: "core-workspace",
    title: "Connected workspace",
    description: "Your Murgii activity and Bolt progress stay connected under one Qreato account."
  }
];

const MAX_FEATURES: FeatureItemData[] = [
  {
    id: "max-bolt",
    title: "Bolt Max",
    description: "Unlock the complete execution system and advanced roadmap."
  },
  {
    id: "max-assist",
    title: "AI Blueprint Assist",
    description: "Turn your completed business decisions into intelligent, context-aware next steps."
  },
  {
    id: "max-qreato",
    title: "Qreato AI",
    description: "A dedicated strategic AI workspace built around your business."
  },
  {
    id: "max-blueprint",
    title: "Your Business Blueprint",
    description: "Turn everything you've built across the roadmap into one living business blueprint."
  },
  {
    id: "max-limits",
    title: "Highest usage limits",
    description: "More room to research, iterate, rewrite and develop campaigns without constantly hitting limits."
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
    <div className="rounded-xl transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/[0.07] active:bg-white/[0.1] transition-all cursor-pointer text-left group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 group-hover:bg-white group-hover:scale-125 transition-all shrink-0" />
          <span className="text-xs font-semibold text-white tracking-tight leading-tight">
            {item.title}
          </span>
        </div>
        <div className="shrink-0 text-gray-400 group-hover:text-white transition-colors">
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
              <p className="text-[11px] text-gray-300 leading-relaxed bg-black/60 p-2.5 rounded-lg border border-white/10 shadow-inner">
                {item.description}
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,5,14,0.35)_0%,rgba(7,5,14,0.85)_100%)] pointer-events-none" />
      </div>

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        {/* Navigation Header */}
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
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent font-nohemi leading-tight mb-4"
          >
            The more you build, the more Murgii gives you.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          >
            From writing better copy today to building an entire revenue system around your business. Start free. Upgrade when you need more leverage.
          </motion.p>
        </div>

        {/* 3 Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-16">
          
          {/* TIER 1: BASIC (FREE) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border transition-all duration-300 ${
              isBasic && user
                ? "bg-[#0c081e]/55 border-white/30 shadow-[0_20px_44px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
                : "bg-[#0c081e]/40 border-white/15 hover:border-white/30 shadow-[0_16px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]"
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
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight font-nohemi">$0</span>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">Free forever</span>
                </div>
                <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-normal">
                  A simple way to experience Murgii's 5 persuasion modes and put its thinking to work.
                </p>
              </div>

              <div className="h-px bg-white/10 my-5" />

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-mono text-white/90 font-bold uppercase tracking-wider">You get:</p>
                  <span className="text-[9px] font-mono text-gray-400">Click arrow for details</span>
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

              <p className="text-[11px] text-gray-400 font-medium italic border-t border-white/10 pt-3 mb-4">
                Best for: Trying Murgii before committing.
              </p>
            </div>

            <div className="pt-2">
              {isBasic && user ? (
                <div className="w-full py-3.5 rounded-xl bg-white/10 border border-white/20 text-center text-xs font-bold text-white cursor-default">
                  Active Default Tier
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onGoToChat}
                  className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-center text-xs font-bold text-white transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Start Free →</span>
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
                ? "bg-[#0c081e]/60 border-white/40 shadow-[0_22px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                : "bg-[#0c081e]/45 border-white/20 hover:border-white/35 shadow-[0_16px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]"
            }`}
            style={{
              backdropFilter: "blur(20px) saturate(1.3)",
              WebkitBackdropFilter: "blur(20px) saturate(1.3)"
            }}
          >
            <div>
              {/* Tagline */}
              <p className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold mb-2">
                Turn Murgii into your daily copy engine.
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                    <Zap size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight font-nohemi">CORE</h2>
                </div>
                {isCore && (
                  <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/30 text-[9px] font-black text-white tracking-wider uppercase">
                    Your Current Plan
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight font-nohemi">$29</span>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">/ month</span>
                </div>
                <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-normal">
                  For creators who need to consistently turn ideas, offers &amp; campaigns into persuasive copy, while building their business inside Bolt.
                </p>
              </div>

              <div className="h-px bg-white/10 my-5" />

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-mono text-white/90 font-bold uppercase tracking-wider">Everything in Basic, plus:</p>
                  <span className="text-[9px] font-mono text-gray-400">Click arrow for details</span>
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

              {/* Ecosystem Callout Box */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/12 space-y-1.5 mb-4 text-xs">
                <p className="font-bold text-white text-xs">One subscription. Two systems.</p>
                <p className="text-gray-300 text-[11px] leading-snug">
                  Murgii helps you sell the idea.<br />
                  Bolt helps you build the business around it.
                </p>
              </div>
            </div>

            <div>
              <div className="pt-2">
                {isCore ? (
                  <div className="w-full py-3.5 rounded-xl bg-white/15 border border-white/30 text-center text-xs font-black text-white uppercase tracking-wider cursor-default">
                    Your Current Plan
                  </div>
                ) : (
                  <a
                    href="https://whop.com/qreato/ai-leverage"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-center text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,255,255,0.25)] cursor-pointer"
                  >
                    <span>Get Core — $29/mo →</span>
                  </a>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-center mt-2.5">
                For creators ready to stop improvising their marketing.
              </p>
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
                  ? "!bg-[#0e0924]/85 !border-white/45 shadow-[0_26px_58px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]"
                  : "!bg-[#0e0924]/65 !border-white/25 hover:!border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
              }`}
              color="magenta"
              speed="5s"
              thickness={1}
            >
              {/* MOST POPULAR BADGE */}
              <div className="absolute top-0 right-0 z-20">
                <div className="bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] py-1.5 px-5 rounded-bl-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Most Popular
                </div>
              </div>

              <div>
                {/* Tagline */}
                <p className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-bold mb-2">
                  Build the business. Not just the copy.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-[0_0_16px_rgba(255,255,255,0.25)]">
                      <Crown size={16} />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight font-nohemi">MAX</h2>
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
                  <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-normal">
                    For creators who want Murgii to work alongside the full Qreato AI ecosystem, from positioning and offers to execution and scale.
                  </p>
                </div>

                <div className="h-px bg-white/10 my-5" />

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-mono text-white/90 font-bold uppercase tracking-wider">Everything in Core, plus:</p>
                    <span className="text-[9px] font-mono text-gray-400">Click arrow for details</span>
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

                {/* Ecosystem Callout Box */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/12 space-y-2 mb-4 text-xs">
                  <p className="font-bold text-white text-xs">Your entire business, connected.</p>
                  <p className="text-[10px] font-mono text-gray-300 font-medium tracking-tight">
                    Strategy → Offer → Product → Launch → Sales → Scale
                  </p>
                  <p className="text-gray-300 text-[11px] leading-snug pt-0.5 border-t border-white/10">
                    Murgii handles the persuasion layer.<br />
                    Bolt handles the execution layer.<br />
                    <span className="text-white font-semibold">Together, they become your creator operating system.</span>
                  </p>
                </div>
              </div>

              <div>
                <div className="pt-2">
                  {isMax ? (
                    <div className="w-full py-3.5 rounded-xl bg-white/15 border border-white/30 text-center text-xs font-black text-white uppercase tracking-wider cursor-default">
                      Your Current Plan
                    </div>
                  ) : (
                    <a
                      href="https://whop.com/qreato/qreato-max"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-center text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
                    >
                      <span>Get Max — $97/mo →</span>
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 font-medium text-center mt-2.5">
                  For creators building something serious.
                </p>
              </div>
            </StarBorder>
          </motion.div>

        </div>

        {/* SECTION UNDER THE CARDS: Why Murgii is different */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto rounded-[32px] border border-white/20 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent backdrop-blur-2xl p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] text-center relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[70px] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Sparkles size={13} className="text-amber-400" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-white font-bold">
                Why Murgii is different
              </span>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Most AI tools start with:<br />
                <span className="text-white font-semibold italic">“What do you want me to write?”</span>
              </p>

              <div className="py-3 px-5 rounded-2xl bg-white/[0.04] border border-white/15 max-w-lg mx-auto space-y-2">
                <p className="text-xs font-mono uppercase text-amber-300 font-bold tracking-wider">
                  Murgii starts deeper:
                </p>
                <p className="text-base sm:text-lg font-bold text-white font-nohemi">
                  What are you trying to make happen?
                </p>
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                It looks at the message, the audience, the desired action and the psychology behind the decision, then helps you find the leverage.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 max-w-xl mx-auto">
              <p className="text-base sm:text-lg font-bold text-white font-nohemi leading-snug">
                That's why Murgii isn't just another AI writer.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                  It's where your message gets sharper.
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Unified Cross-App Infrastructure Note */}
        <div className="mt-12 rounded-2xl p-6 bg-[#0c081e]/40 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-lg">
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
