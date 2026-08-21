import { useState, useEffect } from "react";
import { Check, X, Sparkles, ExternalLink, Zap, Shield, Crown, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { fetchUserPlan, normalizePlan } from "../lib/userAccount";

interface PricingPageProps {
  user: any;
  onGoToChat?: () => void;
  onGoToAccount?: () => void;
}

export function PricingPage({ user, onGoToChat, onGoToAccount }: PricingPageProps) {
  const [currentPlan, setCurrentPlan] = useState<"basic" | "core" | "max" | "none">("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      if (user?.id) {
        const planData = await fetchUserPlan(user.id, user.user_metadata);
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
    <div className="flex-1 flex flex-col h-full min-h-0 bg-transparent text-gray-200 overflow-y-auto custom-scrollbar relative">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        {/* Back / Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onGoToChat}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Back to Workspace</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={onGoToAccount}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#E879F9] hover:underline transition-all cursor-pointer"
            >
              <span>View Account Details</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[10px] font-black text-[#E879F9] uppercase tracking-[0.2em] mb-4 backdrop-blur-md"
          >
            <Sparkles size={12} className="text-[#D946EF]" />
            Transparent Intelligence Tiers
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white/95 to-white/60 bg-clip-text text-transparent italic leading-tight mb-4"
          >
            Scale Your Direct Response Machine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-sm sm:text-base leading-relaxed"
          >
            From essential daily persuasion triggers to full multi-modal roadmap acceleration with Bolt.
          </motion.p>
        </div>

        {/* 3 Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
          
          {/* TIER 1: BASIC (FREE) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border transition-all duration-300 ${
              isBasic && user
                ? "bg-white/[0.04] border-[#8B5CF6]/40 shadow-[0_10px_30px_rgba(139,92,246,0.15)]"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Shield size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Basic</h2>
                </div>
                {isBasic && user && (
                  <span className="px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[9px] font-black text-[#E879F9] tracking-wider uppercase">
                    Your Current Plan
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$0</span>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">/ Free</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Applies to Murgii only. Not connected to Bolt roadmap.
                </p>
              </div>

              <div className="h-px bg-white/10 my-6" />

              <div className="space-y-3.5 mb-8">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Included Capabilities</p>
                
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#E879F9]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    <strong className="text-white font-bold">20 credits</strong> per day
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#E879F9]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    Access to all 4 modes: <strong className="text-white">Emails, Ads, Pages, Psych</strong>
                  </span>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={11} className="text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium leading-tight line-through">
                    Prompt Builder access
                  </span>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={11} className="text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium leading-tight line-through">
                    Bolt account activity visibility
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/05">
              {isBasic && user ? (
                <div className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center text-xs font-bold text-gray-300 cursor-default">
                  Active Default Tier
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onGoToChat}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Start with Basic
                </button>
              )}
            </div>
          </motion.div>

          {/* TIER 2: CORE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border transition-all duration-300 ${
              isCore
                ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/60 shadow-[0_20px_40px_rgba(139,92,246,0.25)]"
                : "bg-white/[0.03] border-white/15 hover:border-[#8B5CF6]/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]">
                    <Zap size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Core</h2>
                </div>
                {isCore ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[9px] font-black text-[#E879F9] tracking-wider uppercase">
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
                  <span className="text-4xl font-extrabold text-white tracking-tight">$29</span>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">/ month</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Full direct response generation & shared Bolt Core integration.
                </p>
              </div>

              <div className="h-px bg-white/10 my-6" />

              <div className="space-y-3.5 mb-8">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Everything in Basic, plus:</p>
                
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#E879F9]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    <strong className="text-white font-bold">40 credits</strong> per day (2x capacity)
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#E879F9]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    <strong className="text-[#E879F9] font-bold">Prompt Builder access</strong> (Guided input architect)
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#E879F9]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    Connects to <strong className="text-white">Bolt Core</strong>: full 6-category roadmap
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#E879F9]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    Full AI Prompt Library access
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/05">
              {isCore ? (
                <div className="w-full py-3.5 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-center text-xs font-black text-[#E879F9] uppercase tracking-wider cursor-default">
                  Your Current Plan
                </div>
              ) : (
                <a
                  href="https://whop.com/qreato/ai-leverage"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-white text-center text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(139,92,246,0.4)] cursor-pointer"
                >
                  <span>Get Core</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </motion.div>

          {/* TIER 3: MAX (MOST POPULAR) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border transition-all duration-300 overflow-hidden ${
              isMax
                ? "bg-gradient-to-b from-[#8B5CF6]/15 via-[#D946EF]/10 to-transparent border-[#D946EF]/60 shadow-[0_25px_60px_rgba(217,70,239,0.3)]"
                : "bg-gradient-to-b from-white/[0.05] to-white/[0.02] border-[#8B5CF6]/40 hover:border-[#D946EF]/60 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(139,92,246,0.15)]"
            }`}
          >
            {/* MOST POPULAR BADGE */}
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-l from-[#D946EF] to-[#8B5CF6] text-white text-[9px] font-black uppercase tracking-[0.2em] py-1.5 px-5 rounded-bl-2xl shadow-[0_0_15px_rgba(217,70,239,0.6)]">
                Most Popular
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D946EF] via-[#A855F7] to-[#8B5CF6] flex items-center justify-center text-white shadow-[0_0_16px_rgba(217,70,239,0.6)]">
                    <Crown size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Max</h2>
                </div>
                {isMax && (
                  <span className="px-2.5 py-1 rounded-full bg-[#D946EF]/25 border border-[#D946EF]/50 text-[9px] font-black text-[#F472B6] tracking-wider uppercase">
                    Your Current Plan
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$97</span>
                  <span className="text-[#E879F9] text-xs font-bold uppercase tracking-wider">/ month</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Maximum credit capacity & complete Qreato AI ecosystem integration.
                </p>
              </div>

              <div className="h-px bg-white/10 my-6" />

              <div className="space-y-3.5 mb-8">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Everything in Core, plus:</p>
                
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#D946EF]/25 border border-[#D946EF]/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#F472B6]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    <strong className="text-white font-bold">100 credits</strong> per day (5x capacity)
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#D946EF]/25 border border-[#D946EF]/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#F472B6]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    Connects to <strong className="text-white">Bolt Max</strong> suite
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#D946EF]/25 border border-[#D946EF]/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#F472B6]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    <strong className="text-[#E879F9] font-bold">AI Blueprint Assist</strong> & Qreato AI engine
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#D946EF]/25 border border-[#D946EF]/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#F472B6]" />
                  </div>
                  <span className="text-xs text-gray-200 font-medium leading-tight">
                    Your Business Blueprint interactive studio
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/05">
              {isMax ? (
                <div className="w-full py-3.5 rounded-xl bg-[#D946EF]/20 border border-[#D946EF]/40 text-center text-xs font-black text-[#F472B6] uppercase tracking-wider cursor-default">
                  Your Current Plan
                </div>
              ) : (
                <a
                  href="https://whop.com/qreato/qreato-max"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] hover:opacity-90 text-white text-center text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(217,70,239,0.5)] cursor-pointer"
                >
                  <span>Get Max</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </motion.div>

        </div>

        {/* Enterprise & Shared Database Note */}
        <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/08 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white">Unified Cross-App Infrastructure</h3>
            <p className="text-xs text-gray-400">
              Murgii shares authenticated state and roadmap milestones directly with your Bolt account.
            </p>
          </div>
          <a
            href="https://bolt.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-colors shrink-0"
          >
            <span>Open Bolt Studio</span>
            <ExternalLink size={12} className="text-[#C084FC]" />
          </a>
        </div>
      </div>
    </div>
  );
}
