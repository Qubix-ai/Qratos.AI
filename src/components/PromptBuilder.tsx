import { useState, useMemo } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  ExternalLink, 
  Mail, 
  Target, 
  FileText, 
  Zap, 
  Megaphone,
  RefreshCw, 
  X,
  Wand2, 
  ArrowRight, 
  ArrowLeft,
  MousePointerClick, 
  Compass 
} from "lucide-react";
import { motion } from "motion/react";
import { MurgiiMode } from "../lib/supabase";
import { FloatingIridescentBlobs } from "./FloatingIridescentBlobs";
import { copyToClipboard } from "../lib/clipboard";

interface PromptBuilderProps {
  user: any;
  userData?: any;
  onSendToWorkspace: (prompt: string, mode: MurgiiMode) => void;
  onGoToChat: () => void;
  onGoToPricing?: () => void;
  onGoToLanding?: () => void;
  onMenuToggle?: () => void;
}

export function PromptBuilder({
  user,
  userData,
  onSendToWorkspace,
  onGoToChat,
  onGoToPricing,
  onGoToLanding,
  onMenuToggle: _onMenuToggle,
}: PromptBuilderProps) {
  // Plan check: Core and Max get full access, 'none' gets locked state
  const rawPlan = (user?.user_metadata?.plan || user?.app_metadata?.plan || user?.plan || userData?.plan || 'none').toLowerCase();
  const hasAccess = rawPlan === 'core' || rawPlan === 'max' || rawPlan === 'admin' || rawPlan === 'pro';

  // For unlocked users, allow toggling between the interactive builder and the framework overview
  const [viewMode, setViewMode] = useState<"builder" | "overview">("builder");

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
    { id: "landing", label: "Sales Page / Landing", icon: FileText, desc: "Hero headlines, value pillars & conversion copy" },
    { id: "psych", label: "Psych & Biases", icon: Zap, desc: "Cognitive bias stack & psychological hooks" },
    { id: "content", label: "Social & Content Scripts", icon: Megaphone, desc: "Shorts, video scripts, carousels & organic posts" },
  ];

  const outcomeOptions = [
    "Capture attention & stop the scroll",
    "Build desire & amplify value",
    "Overcome resistance & eliminate objections",
    "Drive urgent limited-time action",
    "Convert trial users into annual paid subscribers",
    "Explain a complex product simply",
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
    const effectiveProduct = productType.trim() || "digital offering";
    const effectiveTone = tone.trim() || "high-converting direct response";
    const uspSection = keyUSP.trim() ? `\n- Core Mechanism / USP: ${keyUSP.trim()}` : "";

    switch (selectedCategory) {
      case "email":
        return `Act as a world-class direct response email copywriter and marketing strategist.

Context & Offer:
- Industry / Niche: ${effectiveNiche}
- Product / Offer Type: ${effectiveProduct}
- Target Outcome: ${effectiveOutcome}
- Tone & Voice: ${effectiveTone}${uspSection}

Task & Output Architecture:
Draft a high-converting 3-email sequence designed to achieve the target outcome. Structure the output into:
1. Email 1: The Pattern Interrupt & Problem Agitation (Subject Line Variants + Body Copy)
2. Email 2: The Logic, Mechanism & Proof Layer (Case study or transformation angle)
3. Email 3: The Hard Deadline & Final Scarcity Push (Loss-aversion frame + Direct CTA)
Include 3 psychological subject lines for each email.`;

      case "ads":
        return `Act as an elite paid media copywriter and growth creative director.

Context & Offer:
- Industry / Niche: ${effectiveNiche}
- Product / Offer Type: ${effectiveProduct}
- Target Outcome: ${effectiveOutcome}
- Tone & Voice: ${effectiveTone}${uspSection}

Task & Output Architecture:
Generate a high-performing ad creative stack. Structure the output into:
1. 3 Disruptive First-3-Second Visual/Text Hooks (Stopping the scroll)
2. 2 High-Converting Ad Body Angles (Angle A: Pain/Agitation/Solution; Angle B: Direct Transformation)
3. 3 High-CTR Call-to-Action (CTA) Button & Headline variations
4. Psychological Mechanism Explanation (Why this angle converts for this audience)`;

      case "landing":
        return `Act as a principal conversion rate optimization (CRO) specialist and direct response sales page copywriter.

Context & Offer:
- Industry / Niche: ${effectiveNiche}
- Product / Offer Type: ${effectiveProduct}
- Target Outcome: ${effectiveOutcome}
- Tone & Voice: ${effectiveTone}${uspSection}

Task & Output Architecture:
Architect a high-converting sales page lead and core structure. Structure the output into:
1. Above-The-Fold Hero Section (Magnetic H1 Headline, Subheadline clarifying the mechanism, and Primary CTA)
2. Problem Agitation & Root Cause Section (Diagnosing why previous solutions failed)
3. 3-4 Core Value Pillars (Translating features into tangible psychological and financial benefits)
4. Social Proof & Authority Placement Strategy
5. Objection Annihilation Section (FAQ neutralizing the top 3 buying hesitations)
6. Final Urgency Push & Risk-Reversal Guarantee`;

      case "psych":
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

      case "content":
      default:
        return `Act as an elite organic content strategist, viral scriptwriter, and audience engagement architect.

Context & Offer:
- Industry / Niche: ${effectiveNiche}
- Product / Offer Type: ${effectiveProduct}
- Target Outcome: ${effectiveOutcome}
- Tone & Voice: ${effectiveTone}${uspSection}

Task & Output Architecture:
Generate a high-impact social content & video script architecture. Structure the output into:
1. 3 High-Retention First-3-Second Spoken/Text Hooks (Optimized for organic virality)
2. Complete Script / Post Framework (Hook, Story/Mechanism, Key Takeaways, Actionable Takeaway)
3. 2 High-Engagement Question CTAs (Designed to trigger organic comments & shares)
4. Platform Repurposing Guide (How to adapt for LinkedIn, X/Twitter thread, and Short-form video)`;
    }
  }, [selectedCategory, niche, productType, effectiveOutcome, tone, keyUSP]);

  const activePromptText = isEditingCustom && customPromptText !== null ? customPromptText : assembledPrompt;

  const handleCopy = async () => {
    const success = await copyToClipboard(activePromptText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  // Render the Rich Framework Overview (used in locked state & viewMode === 'overview')
  const renderFrameworkOverview = () => (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-12">
      
      {/* 1. HERO SECTION */}
      <div className="text-center space-y-4 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-nohemi tracking-tight text-white leading-[1.15]">
          Custom <span className="text-white font-bold">Prompt</span> Builder
        </h1>

        <div className="space-y-1 max-w-2xl mx-auto">
          <p className="text-lg sm:text-xl font-bold text-white font-nohemi">
            Turn a rough idea into a prompt built to perform.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed pt-2 font-normal">
          Tell Murgii what you&apos;re selling, who you&apos;re speaking to, what you want them to do &amp; how you want it to feel. The Prompt Builder turns those inputs into a deeply structured, role-framed prompt engineered for the kind of copy you need.
        </p>
      </div>

      {/* 2. SECTION: BUILT AROUND YOUR OBJECTIVE */}
      <div className="space-y-5">
        <div className="text-center sm:text-left border-b border-white/10 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2.5 font-nohemi">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
            <span>Built around your objective</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Step 1 */}
          <div 
            className="p-5 rounded-2xl bg-white/[0.05] border border-white/12 hover:border-white/25 transition-all duration-300 space-y-2 backdrop-blur-2xl relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-white uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 shadow-sm">
                Step 01
              </span>
              <Mail size={16} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-base font-bold text-white font-nohemi">Choose your format</h3>
            <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-normal">
              Email, Ad, Sales Page, or Contents.
            </p>
          </div>

          {/* Step 2 */}
          <div 
            className="p-5 rounded-2xl bg-white/[0.05] border border-white/12 hover:border-white/25 transition-all duration-300 space-y-2 backdrop-blur-2xl relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-white uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 shadow-sm">
                Step 02
              </span>
              <Compass size={16} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-base font-bold text-white font-nohemi">Define the context</h3>
            <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-normal">
              Your niche, offer, audience, positioning &amp; message.
            </p>
          </div>

          {/* Step 3 */}
          <div 
            className="p-5 rounded-2xl bg-white/[0.05] border border-white/12 hover:border-white/25 transition-all duration-300 space-y-2 backdrop-blur-2xl relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-white uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 shadow-sm">
                Step 03
              </span>
              <Target size={16} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-base font-bold text-white font-nohemi">Set the outcome</h3>
            <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-normal">
              Choose exactly what you want the copy to accomplish. Capture attention, build desire, overcome resistance, drive action &amp; more.
            </p>
          </div>

          {/* Step 4 */}
          <div 
            className="p-5 rounded-2xl bg-white/[0.05] border border-white/12 hover:border-white/25 transition-all duration-300 space-y-2 backdrop-blur-2xl relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-white uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 shadow-sm">
                Step 04
              </span>
              <Zap size={16} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-base font-bold text-white font-nohemi">Shape the persuasion</h3>
            <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-normal">
              Select the tone, angle &amp; psychological direction that fits your message.
            </p>
          </div>

          {/* Step 5 - Full Width on md */}
          <div 
            className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-white/[0.07] border border-white/20 hover:border-white/35 transition-all duration-300 space-y-2 backdrop-blur-2xl relative overflow-hidden group shadow-[0_12px_40px_rgba(255,255,255,0.06)]"
            style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-white uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 shadow-sm">
                Step 05 • Final Assembly
              </span>
              <Wand2 size={18} className="text-white group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-base font-bold text-white font-nohemi">Generate the prompt</h3>
            <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed font-normal max-w-2xl">
              Murgii assembles everything into one structured, ready-to-run prompt so you don&apos;t have to figure out what to tell AI.
            </p>
          </div>

        </div>
      </div>

      {/* 3. SECTION: MORE THAN A PROMPT GENERATOR */}
      <div 
        className="p-6 sm:p-8 rounded-3xl bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] space-y-6"
        style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 font-nohemi">
            More than a prompt generator.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Every prompt is structured around the context that actually matters to persuasive copy, who you&apos;re talking to, what you&apos;re offering, why it matters &amp; what needs to happen next.
          </p>
        </div>

        {/* 3 Contrast Bullets */}
        <div className="space-y-3 pt-1">
          {[
            "No generic “write me an ad” prompts.",
            "No starting from scratch.",
            "No endless prompt engineering."
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <X size={12} className="text-gray-300" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-neutral-200">{item}</span>
            </div>
          ))}
        </div>

        {/* Highlight Result Formula with Glassmorphism */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.2)] text-center transition-all duration-300">
          <p className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide flex items-center justify-center flex-wrap gap-2">
            <span>Just better inputs</span>
            <span className="text-gray-400 font-black text-base">→</span>
            <span>better instructions</span>
            <span className="text-gray-400 font-black text-base">→</span>
            <span className="text-white font-extrabold underline decoration-white/40 underline-offset-4">stronger copy</span>.
          </p>
        </div>
      </div>

      {/* 4. SECTION: ONE CLICK. STRAIGHT INTO MURGII */}
      <div 
        className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/12 backdrop-blur-2xl space-y-4"
        style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <MousePointerClick size={16} className="text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-nohemi">
            One click. Straight into Murgii.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl font-normal">
          Build your prompt, send it directly to the Murgii workspace &amp; turn the strategy into finished copy without breaking your flow.
        </p>
      </div>

      {/* 5. CLOSING CLIMAX & CTA */}
      <div 
        className="p-6 sm:p-10 rounded-3xl bg-white/[0.06] border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-center space-y-6 relative overflow-hidden"
        style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
      >
        {/* Subtle white sheen sweep */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <div className="space-y-1.5">
          <p className="text-lg sm:text-2xl font-bold text-white font-nohemi">
            Your idea goes in.
          </p>
          <p className="text-lg sm:text-2xl font-bold text-white font-nohemi">
            A purpose-built prompt comes out.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {hasAccess ? (
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96, y: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              type="button"
              onClick={() => setViewMode("builder")}
              className="relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)] cursor-pointer group"
            >
              <span className="relative z-10">Build a Custom Prompt</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96, y: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              type="button"
              onClick={onGoToPricing}
              className="relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)] cursor-pointer group"
            >
              <span className="relative z-10">Build a Custom Prompt</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}

          <button
            type="button"
            onClick={onGoToChat}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-sm"
          >
            Return to Workspace
          </button>
        </div>
      </div>

    </div>
  );

  // LOCKED STATE FOR PLAN === 'NONE'
  if (!hasAccess) {
    return (
      <div className="flex-1 flex flex-col relative overflow-hidden font-sans h-full min-h-0 bg-[#07050E] text-white">
        <FloatingIridescentBlobs />

        {/* Section Top Header */}
        <div 
          className="mt-6 sm:mt-8 mx-4 sm:mx-6 mb-2 p-4 sm:px-6 sm:py-4 rounded-2xl border border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 backdrop-blur-2xl bg-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0">
              <Wand2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 font-nohemi">
                Custom Prompt Builder
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[9px] font-extrabold text-white uppercase tracking-wider">
                  Core &amp; Max
                </span>
              </h1>
              <p className="text-xs text-gray-300 font-medium">Turn a rough idea into a prompt built to perform</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {onGoToLanding && (
              <button
                type="button"
                onClick={onGoToLanding}
                className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Home</span>
              </button>
            )}
            {onGoToPricing ? (
              <button
                type="button"
                onClick={onGoToPricing}
                className="text-xs font-bold text-black px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.25)]"
              >
                <span>Upgrade</span>
                <Sparkles size={12} />
              </button>
            ) : (
              <a
                href="https://whop.com/qreato/ai-leverage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-black px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.25)]"
              >
                <span>Upgrade</span>
                <ExternalLink size={12} />
              </a>
            )}
            <button
              type="button"
              onClick={onGoToChat}
              className="text-xs font-semibold text-white px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 transition-colors cursor-pointer"
            >
              Go to Workspace
            </button>
          </div>
        </div>

        {/* Scrollable Overview Container */}
        <div className="flex-1 overflow-y-auto relative z-10 pb-16 custom-scrollbar">
          {renderFrameworkOverview()}
        </div>
      </div>
    );
  }

  // UNLOCKED STATE (CORE & MAX USERS)
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden font-sans h-full min-h-0 bg-[#07050E] text-white">
      <FloatingIridescentBlobs />

      {/* Top Navigation Bar */}
      <div 
        className="mt-6 sm:mt-8 mx-4 sm:mx-6 mb-2 p-4 sm:px-6 sm:py-4 rounded-2xl border border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 backdrop-blur-2xl bg-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0">
            <Wand2 size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-nohemi">
                Custom Prompt Builder
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[9px] font-black text-white uppercase tracking-wider">
                Core &amp; Max
              </span>
            </div>
            <p className="text-xs text-gray-300 font-medium">
              Turn a rough idea into a prompt built to perform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onGoToLanding && (
            <button
              type="button"
              onClick={onGoToLanding}
              className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Home</span>
            </button>
          )}

          {/* Toggle between interactive builder & framework copy */}
          <div className="p-1 rounded-xl bg-black/40 border border-white/10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode("builder")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "builder" 
                  ? "bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Builder
            </button>
            <button
              type="button"
              onClick={() => setViewMode("overview")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "overview" 
                  ? "bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              How it works
            </button>
          </div>

          {viewMode === "builder" && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset to defaults"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGoToChat}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-xs font-bold text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Chat Workspace
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === "overview" ? (
        <div className="flex-1 overflow-y-auto relative z-10 pb-16 custom-scrollbar">
          {renderFrameworkOverview()}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-12">
            
            {/* LEFT COLUMN: GUIDED INPUT FORM (5/12 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div 
                className="p-5 sm:p-6 rounded-2xl bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-5"
                style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
              >
                
                {/* 1. Choose your format */}
                <div>
                  <label className="block text-[11px] font-black text-white uppercase tracking-wider mb-2.5">
                    1. Choose your format
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
                              ? "bg-white/20 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                              : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon size={14} className={isSelected ? "text-white" : "text-gray-400"} />
                            <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-300"}`}>
                              {cat.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 line-clamp-1">
                            {cat.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Define the context */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-black text-white uppercase tracking-wider">
                    2. Define the context
                  </label>
                  
                  {/* Niche */}
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Niche / Industry &amp; Audience
                    </span>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="e.g. B2B SaaS Founders, Fitness Coaching, E-Commerce"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white placeholder:text-gray-600 transition-colors shadow-inner"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["B2B SaaS", "Fitness & Wellness", "Creator Coaching", "E-Commerce", "Finance"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNiche(tag)}
                          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product / Offer */}
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Offer / Product Type
                    </span>
                    <input
                      type="text"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      placeholder="e.g. Software Subscription, High-Ticket Mastermind"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white placeholder:text-gray-600 transition-colors shadow-inner"
                    />
                  </div>
                </div>

                {/* 3. Set the outcome */}
                <div>
                  <label className="block text-[11px] font-black text-white uppercase tracking-wider mb-1.5">
                    3. Set the outcome
                  </label>
                  <select
                    value={desiredOutcome}
                    onChange={(e) => setDesiredOutcome(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F1D] border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white transition-colors cursor-pointer"
                  >
                    {outcomeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#120F1D] text-white">
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
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 focus:border-white/40 focus:outline-none text-xs text-white placeholder:text-gray-600"
                      />
                    </motion.div>
                  )}
                </div>

                {/* 4. Shape the persuasion */}
                <div>
                  <label className="block text-[11px] font-black text-white uppercase tracking-wider mb-1.5">
                    4. Shape the persuasion (Tone &amp; Angle)
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F1D] border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white transition-colors cursor-pointer"
                  >
                    {toneOptions.map((t) => (
                      <option key={t} value={t} className="bg-[#120F1D] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Key USP / Unique Mechanism */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Key Promise / Unique Mechanism (Optional)</span>
                    <span className="text-[9px] text-gray-500 font-normal">Context layer</span>
                  </label>
                  <input
                    type="text"
                    value={keyUSP}
                    onChange={(e) => setKeyUSP(e.target.value)}
                    placeholder="e.g. 14-day risk reversal, proprietary neural pipeline"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-white/40 focus:outline-none text-xs text-white placeholder:text-gray-600 transition-colors shadow-inner"
                  />
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: 5. GENERATE THE PROMPT (7/12 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div 
                className="p-5 sm:p-6 rounded-2xl bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_35px_rgba(0,0,0,0.6)] flex flex-col h-full min-h-[520px]"
                style={{ backdropFilter: "blur(20px) saturate(1.3)", WebkitBackdropFilter: "blur(20px) saturate(1.3)" }}
              >
                
                {/* Output Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
                    <span className="text-xs font-black uppercase tracking-wider text-white font-nohemi">
                      5. Generated Structured Prompt
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white font-mono font-bold">
                      {selectedCategory.toUpperCase()}
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
                          ? "bg-white/20 border-white text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {isEditingCustom ? "Lock Dynamic" : "Edit Prompt"}
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <div className="flex-1 relative mb-5">
                  <textarea
                    value={activePromptText}
                    onChange={(e) => {
                      setCustomPromptText(e.target.value);
                      if (!isEditingCustom) setIsEditingCustom(true);
                    }}
                    rows={16}
                    className="w-full h-full min-h-[340px] p-4 rounded-xl bg-black/60 border border-white/10 focus:border-white/40 focus:outline-none text-xs sm:text-sm text-gray-200 font-mono leading-relaxed resize-none selection:bg-white/20"
                    placeholder="Your assembled prompt will appear here..."
                  />

                  {isEditingCustom && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-white/20 border border-white/30 text-[10px] font-bold text-white">
                      Manual Edit Active
                    </div>
                  )}
                </div>

                {/* Action Buttons Bar */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-gray-400 font-medium">
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
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all cursor-pointer group"
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
      )}
    </div>
  );
}
