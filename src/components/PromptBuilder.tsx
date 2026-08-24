import { useState, useMemo } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Lock, 
  ExternalLink, 
  Mail, 
  Target, 
  FileText, 
  Zap, 
  RefreshCw, 
  Sliders, 
  CheckCircle2,
  Wand2,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MurgiiMode } from "../lib/supabase";
import { FloatingIridescentBlobs } from "./FloatingIridescentBlobs";

interface PromptBuilderProps {
  user: any;
  userData?: any;
  onSendToWorkspace: (prompt: string, mode: MurgiiMode) => void;
  onGoToChat: () => void;
  onMenuToggle?: () => void;
}

export function PromptBuilder({
  user,
  userData,
  onSendToWorkspace,
  onGoToChat,
  onMenuToggle,
}: PromptBuilderProps) {
  // Plan check: Core and Max get full access, 'none' gets locked state
  const rawPlan = (user?.user_metadata?.plan || user?.app_metadata?.plan || user?.plan || userData?.plan || 'none').toLowerCase();
  const hasAccess = rawPlan === 'core' || rawPlan === 'max' || rawPlan === 'admin' || rawPlan === 'pro';

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<MurgiiMode>("email");
  const [niche, setNiche] = useState("B2B SaaS & Productivity");
  const [productType, setProductType] = useState("Software Subscription");
  const [desiredOutcome, setDesiredOutcome] = useState("Drive urgency for a limited-time offer");
  const [customOutcome, setCustomOutcome] = useState("");
  const [tone, setTone] = useState("Bold and direct");
  const [keyUSP, setKeyUSP] = useState("");
  
  // Customization & editing state
  const [customPromptText, setCustomPromptText] = useState<string | null>(null);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories: { id: MurgiiMode; label: string; icon: any; desc: string }[] = [
    { id: "email", label: "Email Sequence", icon: Mail, desc: "High-CTR campaigns, launches & onboarding" },
    { id: "ads", label: "Ad Copy & Hooks", icon: Target, desc: "Pattern interrupts, headlines & paid media" },
    { id: "landing", label: "Landing Page", icon: FileText, desc: "Hero headlines, value pillars & sales copy" },
    { id: "psych", label: "Psych / Persuasion", icon: Zap, desc: "Cognitive bias stack & objection reversal" },
  ];

  const outcomeOptions = [
    "Drive urgency for a limited-time offer",
    "Build trust with a skeptical audience",
    "Explain a complex product simply",
    "Create curiosity/intrigue",
    "Handle a specific objection",
    "Convert trial users into annual paid subscribers",
    "Re-engage cold leads with pattern interrupt",
    "Other (describe)"
  ];

  const toneOptions = [
    "Bold and direct",
    "Warm and friendly",
    "Professional and authoritative",
    "Playful and casual",
    "Urgent and high-stakes",
    "Story-driven and empathetic",
    "Contrarian and provocative"
  ];

  const effectiveOutcome = desiredOutcome === "Other (describe)" 
    ? (customOutcome.trim() || "Drive high-converting customer action")
    : desiredOutcome;

  // Real-time Template Generation
  const assembledPrompt = useMemo(() => {
    const effectiveNiche = niche.trim() || "general industry";
    const effectiveProduct = productType.trim() || "product/service";
    const effectiveTone = tone || "Bold and direct";
    const uspSection = keyUSP.trim() ? `\n- Unique Mechanism / Key USP: ${keyUSP.trim()}` : "";

    switch (selectedCategory) {
      case "email":
        return `Act as a world-class direct-response email copywriter and behavioral strategist.

Context & Offer:
- Industry / Niche: ${effectiveNiche}
- Product / Offer Type: ${effectiveProduct}
- Target Outcome: ${effectiveOutcome}
- Tone & Voice: ${effectiveTone}${uspSection}

Task & Output Architecture:
Write a complete, high-converting email designed specifically to achieve the target outcome above. Structure the output into:
1. 3 High-CTR Subject Line Variations (Curiosity-based, Direct benefit, Urgency/Loss aversion)
2. Compelling Preview Text (under 80 characters)
3. Opening Hook (first 2 lines designed to stop the scan and command attention)
4. Core Email Body (story-driven problem agitation, unique mechanism, and desire amplification)
5. Frictionless Call-to-Action (clear, high-intent button/link copy)
6. High-Impact P.S. (reinforcing the urgency, deadline, or risk-reversal guarantee)`;

      case "ads":
        return `Act as a top 1% direct-response paid media copywriter and creative strategist.

Context & Offer:
- Industry / Niche: ${effectiveNiche}
- Product / Offer Type: ${effectiveProduct}
- Target Outcome: ${effectiveOutcome}
- Tone & Voice: ${effectiveTone}${uspSection}

Task & Output Architecture:
Write a high-converting paid ad creative asset suite tailored for Facebook, Instagram, and LinkedIn ads. Structure the output into:
1. 5 Scroll-Stopping Hooks (Pattern interrupt, contrarian question, visceral pain point, transformation teaser, and social proof)
2. Primary Ad Body Copy (both Short-Form punchy version and Medium-Form story/PAS framework version)
3. 3 Magnetic Headline Variations (5-8 words with high curiosity and clear payoff)
4. Strong Call-to-Action (CTA button text and closing momentum)
5. Creative Visual Framing Notes (recommended visual or video backdrop concept)`;

      case "landing":
        return `Act as an elite conversion rate optimization (CRO) specialist and direct-response sales page copywriter.

Context & Offer:
- Industry / Niche: ${effectiveNiche}
- Product / Offer Type: ${effectiveProduct}
- Target Outcome: ${effectiveOutcome}
- Tone & Voice: ${effectiveTone}${uspSection}

Task & Output Architecture:
Architect a high-converting landing page lead and core structure. Structure the output into:
1. Above-The-Fold Hero Section (Magnetic H1 Headline, Subheadline clarifying the mechanism, and Primary CTA)
2. Problem Agitation & Root Cause Section (Diagnosing why previous solutions failed)
3. 3-4 Core Value Pillars (Translating features into tangible psychological and financial benefits)
4. Social Proof & Authority Placement Strategy
5. Objection Annihilation Section (FAQ neutralizing the top 3 buying hesitations)
6. Final Urgency Push & Risk-Reversal Guarantee`;

      case "psych":
      default:
        return `Act as a behavioral psychologist, cognitive persuasion master, and consumer decision strategist.

Context & Offer:
- Industry / Niche: ${effectiveNiche}
- Product / Offer Type: ${effectiveProduct}
- Target Outcome: ${effectiveOutcome}
- Tone & Voice: ${effectiveTone}${uspSection}

Task & Output Architecture:
Develop a deep behavioral persuasion framework and psychological hook stack. Structure the output into:
1. Cognitive Bias Stack (Identify top 3 psychological levers for this offer: e.g. Loss Aversion, Status Signaling, Hyperbolic Discounting)
2. 5 Visceral Psychological Hooks (Targeting subconscious pain and hidden desires)
3. Objection-Reversal Matrix (Subconscious Fear vs. Psychological Reframe)
4. Framing & Metaphor Architecture (A memorable analogy that makes the offer value undeniable)
5. Urgency & Commitment Trigger (Ethical scarcity and immediate decision driver)`;
    }
  }, [selectedCategory, niche, productType, effectiveOutcome, tone, keyUSP]);

  const activePromptText = isEditingCustom && customPromptText !== null ? customPromptText : assembledPrompt;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activePromptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt:", err);
    }
  };

  const handleSendToWorkspace = () => {
    onSendToWorkspace(activePromptText, selectedCategory);
  };

  const handleReset = () => {
    setNiche("B2B SaaS & Productivity");
    setProductType("Software Subscription");
    setDesiredOutcome("Drive urgency for a limited-time offer");
    setCustomOutcome("");
    setTone("Bold and direct");
    setKeyUSP("");
    setCustomPromptText(null);
    setIsEditingCustom(false);
  };

  // LOCKED STATE FOR PLAN === 'NONE'
  if (!hasAccess) {
    return (
      <div className="flex-1 flex flex-col relative overflow-hidden font-sans h-full min-h-0 bg-[#07060B] text-white">
        <FloatingIridescentBlobs />

        {/* Section Header with Clear Vertical Spacing from App TopNav */}
        <div className="mt-6 sm:mt-8 mx-4 sm:mx-6 mb-2 p-4 sm:px-6 sm:py-4 rounded-2xl border border-white/08 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 backdrop-blur-xl bg-[#0B0914]/80 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#D946EF]/30 border border-[#8B5CF6]/40 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] shrink-0">
              <Wand2 size={20} className="text-[#D946EF]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Custom Prompt Builder
                <span className="px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[9px] font-extrabold text-[#C084FC] uppercase tracking-wider">
                  Core & Max
                </span>
              </h1>
              <p className="text-xs text-gray-400 font-medium">Architect tailored, role-framed persuasion prompts</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoToChat}
            className="text-xs font-semibold text-gray-300 hover:text-white px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Go to Workspace
          </button>
        </div>

        {/* Locked Hero Container */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-[480px] w-full"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F0B1E]/95 to-[#0A0714]/95 border border-[rgba(168,85,247,0.4)] backdrop-blur-2xl shadow-[0_0_24px_rgba(168,85,247,0.25),0_20px_50px_rgba(0,0,0,0.6)] text-center relative overflow-hidden">
              {/* Top iridescent shimmer */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#D946EF] to-transparent" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#8B5CF6]/20 rounded-full blur-[50px] pointer-events-none" />

              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/20 to-[#D946EF]/20 border border-[#8B5CF6]/50 flex items-center justify-center shadow-[0_0_24px_rgba(217,70,239,0.3)]">
                <Lock size={22} className="text-[#E879F9]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[10px] font-black text-[#D946EF] uppercase tracking-widest mb-3">
                <Sparkles size={11} />
                Bolt Core & Max Exclusive
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                Available on Bolt Core or Max
              </h2>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm mx-auto mb-5">
                The Custom Prompt Generator architects tailored, role-framed master prompts engineered specifically for Murgii&apos;s persuasion engine.
              </p>

              <div className="space-y-2.5 text-left max-w-sm mx-auto mb-6 p-3.5 rounded-xl bg-white/[0.03] border border-white/06">
                {[
                  "Multi-category prompt synthesis (Email, Ads, Pages, Psych)",
                  "Industry & offer-specific context injection",
                  "Behavioral outcome and cognitive trigger alignment",
                  "1-click workspace execution & direct neural generation",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 size={14} className="text-[#D946EF] shrink-0" />
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href="https://whop.com/qreato/ai-leverage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] text-white font-extrabold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
                >
                  <span>Upgrade on Whop</span>
                  <ExternalLink size={13} />
                </a>

                <button
                  type="button"
                  onClick={onGoToChat}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  Return to Workspace
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // UNLOCKED STATE (CORE & MAX USERS)
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden font-sans h-full min-h-0 bg-[#07060B] text-white">
      <FloatingIridescentBlobs />

      {/* Top Navigation Bar */}
      <div className="mt-6 sm:mt-8 mx-4 sm:mx-6 mb-2 p-4 sm:px-6 sm:py-4 rounded-2xl border border-white/08 flex items-center justify-between relative z-10 backdrop-blur-xl bg-[#0B0914]/85 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#D946EF]/30 border border-[#8B5CF6]/40 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Wand2 size={20} className="text-[#D946EF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Custom Prompt Generator
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[9px] font-black text-[#E879F9] uppercase tracking-wider">
                Instant Template
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Guided template builder — assemble and send directly to the Neural Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset to defaults"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            type="button"
            onClick={onGoToChat}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 hover:from-[#8B5CF6]/50 hover:to-[#D946EF]/50 border border-[#8B5CF6]/40 text-xs font-bold text-white transition-all cursor-pointer"
          >
            Chat Workspace
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-12">
          
          {/* LEFT COLUMN: GUIDED INPUT FORM (5/12 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0E0B1B]/80 border border-[#8B5CF6]/25 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-5">
              
              {/* Category Selector */}
              <div>
                <label className="block text-[11px] font-black text-[#C084FC] uppercase tracking-wider mb-2.5">
                  1. Category / Objective
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-br from-[#8B5CF6]/25 to-[#D946EF]/20 border-[#D946EF]/60 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                            : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={14} className={isSelected ? "text-[#E879F9]" : "text-gray-400"} />
                          <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-300"}`}>
                            {cat.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1">
                          {cat.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Niche / Industry */}
              <div>
                <label className="block text-[11px] font-black text-[#C084FC] uppercase tracking-wider mb-1.5">
                  2. Niche / Industry
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. Fitness Coaching, B2B SaaS, E-Commerce Apparel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#8B5CF6]/60 focus:outline-none text-xs text-white placeholder:text-gray-600 transition-colors shadow-inner"
                />
                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["B2B SaaS", "Fitness & Wellness", "Personal Finance", "Real Estate", "Creator Coaching"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNiche(tag)}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/08 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product / Offer Type */}
              <div>
                <label className="block text-[11px] font-black text-[#C084FC] uppercase tracking-wider mb-1.5">
                  3. Product / Offer Type
                </label>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. Online Course, Physical Product, Coaching Program, Software"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#8B5CF6]/60 focus:outline-none text-xs text-white placeholder:text-gray-600 transition-colors shadow-inner"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["Software Subscription", "High-Ticket Coaching", "Online Masterclass", "Physical Goods"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setProductType(tag)}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/08 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desired Outcome */}
              <div>
                <label className="block text-[11px] font-black text-[#C084FC] uppercase tracking-wider mb-1.5">
                  4. Desired Outcome
                </label>
                <select
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#140F24] border border-white/10 focus:border-[#8B5CF6]/60 focus:outline-none text-xs text-white transition-colors cursor-pointer"
                >
                  {outcomeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#140F24] text-white">
                      {opt}
                    </option>
                  ))}
                </select>

                {desiredOutcome === "Other (describe)" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2"
                  >
                    <input
                      type="text"
                      value={customOutcome}
                      onChange={(e) => setCustomOutcome(e.target.value)}
                      placeholder="Describe your custom desired outcome..."
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-[#8B5CF6]/40 focus:border-[#D946EF]/60 focus:outline-none text-xs text-white placeholder:text-gray-600"
                    />
                  </motion.div>
                )}
              </div>

              {/* Tone */}
              <div>
                <label className="block text-[11px] font-black text-[#C084FC] uppercase tracking-wider mb-1.5">
                  5. Tone & Style
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#140F24] border border-white/10 focus:border-[#8B5CF6]/60 focus:outline-none text-xs text-white transition-colors cursor-pointer"
                >
                  {toneOptions.map((t) => (
                    <option key={t} value={t} className="bg-[#140F24] text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional USP / Key Hook */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>6. Key Promise / Unique Mechanism (Optional)</span>
                  <span className="text-[9px] text-gray-500 font-normal">Bonus context</span>
                </label>
                <input
                  type="text"
                  value={keyUSP}
                  onChange={(e) => setKeyUSP(e.target.value)}
                  placeholder="e.g. 14-day zero-risk guarantee, proprietary AI pipeline"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#8B5CF6]/60 focus:outline-none text-xs text-white placeholder:text-gray-600 transition-colors shadow-inner"
                />
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME ASSEMBLED PROMPT PREVIEW (7/12 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0E0B1B]/85 border border-[#8B5CF6]/30 backdrop-blur-2xl shadow-[0_4px_35px_rgba(0,0,0,0.6)] flex flex-col h-full min-h-[520px]">
              
              {/* Output Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/08">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Assembled Prompt Preview
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono">
                    Mode: {selectedCategory.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditingCustom) {
                        setCustomPromptText(assembledPrompt);
                      }
                      setIsEditingCustom(!isEditingCustom);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      isEditingCustom
                        ? "bg-[#8B5CF6]/30 border-[#8B5CF6] text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {isEditingCustom ? "Lock Dynamic" : "Edit Prompt"}
                  </button>
                </div>
              </div>

              {/* Textarea or Structured Display */}
              <div className="flex-1 relative mb-5">
                <textarea
                  value={activePromptText}
                  onChange={(e) => {
                    setCustomPromptText(e.target.value);
                    if (!isEditingCustom) setIsEditingCustom(true);
                  }}
                  rows={16}
                  className="w-full h-full min-h-[340px] p-4 rounded-xl bg-black/60 border border-white/10 focus:border-[#8B5CF6]/60 focus:outline-none text-xs sm:text-sm text-gray-200 font-mono leading-relaxed resize-none selection:bg-[#8B5CF6]/40"
                  placeholder="Your assembled prompt will appear here..."
                />

                {isEditingCustom && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-[#D946EF]/20 border border-[#D946EF]/40 text-[10px] font-bold text-[#E879F9]">
                    Manual Edit Active
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-2 border-t border-white/08 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-gray-500 font-medium">
                  {activePromptText.length} characters • Ready to run
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 hover:text-white transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToWorkspace}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] text-white font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer group"
                  >
                    <span>Send to Workspace</span>
                    <Send size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
