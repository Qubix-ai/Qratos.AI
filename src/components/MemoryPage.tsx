import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Save, 
  ArrowLeft, 
  Check, 
  Loader2, 
  MessageSquareQuote,
  Building,
  Target,
  FileText,
  User,
  Sliders,
  CheckCircle2,
  Brain,
  Layers,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchUserMemory, saveUserMemory, MurgiiMemory, DEFAULT_TONE_OPTIONS } from "../lib/memory";
import { QreatoLogo } from "./QreatoLogo";

interface MemoryPageProps {
  user: any;
  onGoToChat: () => void;
}

export function MemoryPage({ user, onGoToChat }: MemoryPageProps) {
  const [memory, setMemory] = useState<MurgiiMemory>({
    preferred_name: "",
    business_description: "",
    niche: "",
    preferred_tone: "Bold and direct",
    additional_notes: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [customToneMode, setCustomToneMode] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await fetchUserMemory(user.id);
        setMemory(data);
        if (data.preferred_tone && !DEFAULT_TONE_OPTIONS.includes(data.preferred_tone)) {
          setCustomToneMode(true);
        }
      } catch (err) {
        console.error("Failed loading user memory:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      await saveUserMemory(user.id, memory);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
      }, 3000);
    } catch (err) {
      console.error("Error saving memory context:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const filledCount = [
    Boolean(memory.preferred_name?.trim()),
    Boolean(memory.niche?.trim()),
    Boolean(memory.business_description?.trim()),
    Boolean(memory.preferred_tone?.trim()),
    Boolean(memory.additional_notes?.trim()),
  ].filter(Boolean).length;

  const tuningStrength = Math.round((filledCount / 5) * 100);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#07060B] text-white overflow-y-auto custom-scrollbar relative selection:bg-white/30 selection:text-white">
      
      {/* Premium Multi-Layer White Specular Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[760px] h-[580px] bg-gradient-to-b from-white/[0.12] via-[#8B5CF6]/15 to-transparent rounded-full blur-[130px]" />
        <div className="absolute top-[25%] -left-[10%] w-[550px] h-[550px] bg-white/[0.06] rounded-full blur-[140px]" />
        <div className="absolute top-[45%] -right-[10%] w-[580px] h-[580px] bg-white/[0.06] rounded-full blur-[140px]" />
        <div className="absolute bottom-[0%] left-[25%] w-[650px] h-[450px] bg-white/[0.04] rounded-full blur-[130px]" />
        
        {/* Crisp geometric grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10 space-y-8">
        
        {/* Navigation & Header with High-Contrast White Glass Accent */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={onGoToChat}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 text-white transition-all cursor-pointer group shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-xl hover:scale-105"
              title="Return to Workspace"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform text-white" />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-xl text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1.5 font-mono">
                <Brain size={12} className="text-white" />
                Brand Context Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
                Memory & Personalization
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                Configure your brand voice and offer background once for seamless, zero-brief copy generation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onGoToChat}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-bold text-white transition-all cursor-pointer backdrop-blur-xl hover:scale-[1.02]"
            >
              Workspace
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving || isLoading}
              className="px-6 py-2 rounded-xl bg-white text-black hover:bg-neutral-100 text-xs font-bold shadow-[0_0_30px_rgba(255,255,255,0.35)] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Memory</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informative Explanation Banner with White Frosted Glass Sheen */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden transition-all duration-300 group hover:border-white/40"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
          }}
        >
          {/* Top specular highlight overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.08] rounded-full blur-[50px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(255,255,255,0.35)]">
                <QreatoLogo size={22} className="text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    How Murgii Personalization Works
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/30 text-[9px] font-mono font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    AUTO-INJECTED
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                  Tell Murgii your background once — it automatically injects this context into every copy brief across Email, Ads, Sales Pages, and Psychology modes without repetitive manual prompting.
                </p>
              </div>
            </div>

            {/* Tuning Strength Metric Box */}
            <div className="w-full sm:w-48 p-4 rounded-2xl bg-black/50 border border-white/15 shrink-0 shadow-inner">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300 mb-1.5 font-bold">
                <span>TUNING STRENGTH</span>
                <span className="text-white font-bold">{tuningStrength}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 p-[1px] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white via-white/90 to-white/70 rounded-full transition-all duration-700 shadow-[0_0_10px_#ffffff]"
                  style={{ width: `${Math.max(8, tuningStrength)}%` }}
                />
              </div>
              <span className="block text-[9px] text-neutral-400 mt-1 font-mono">
                {filledCount} of 5 vectors configured
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-white animate-spin drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Preferred Name & Niche Grid (Frosted White Glassmorphism) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Preferred Name */}
              <div 
                className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden transition-all duration-300 group hover:border-white/40 space-y-3"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(24px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <label htmlFor="preferred_name" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shadow-sm">
                      <User size={15} strokeWidth={2.2} />
                    </div>
                    <span>Preferred / Operator Name</span>
                  </label>
                </div>
                <div className="relative z-10">
                  <input
                    id="preferred_name"
                    type="text"
                    placeholder="e.g. Alex Sterling or Acme Marketing"
                    value={memory.preferred_name}
                    onChange={(e) => setMemory({ ...memory, preferred_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
                  />
                  <p className="text-[11px] text-neutral-300 mt-2">
                    How you'd like Murgii to address you or sign off on personal copy.
                  </p>
                </div>
              </div>

              {/* Niche / Industry */}
              <div 
                className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden transition-all duration-300 group hover:border-white/40 space-y-3"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(24px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <label htmlFor="niche" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shadow-sm">
                      <Target size={15} strokeWidth={2.2} />
                    </div>
                    <span>Niche / Industry Vertical</span>
                  </label>
                </div>
                <div className="relative z-10">
                  <input
                    id="niche"
                    type="text"
                    placeholder="e.g. B2B SaaS, High-Ticket E-commerce, Info Products"
                    value={memory.niche}
                    onChange={(e) => setMemory({ ...memory, niche: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
                  />
                  <p className="text-[11px] text-neutral-300 mt-2">
                    Your primary market domain or industry vertical for laser-targeted framing.
                  </p>
                </div>
              </div>
            </div>

            {/* Business Description (Frosted White Glassmorphism Card) */}
            <div 
              className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden transition-all duration-300 group hover:border-white/40 space-y-3"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <label htmlFor="business_description" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shadow-sm">
                    <Building size={15} strokeWidth={2.2} />
                  </div>
                  <span>Business / Product Value Proposition</span>
                </label>
              </div>
              <div className="relative z-10">
                <textarea
                  id="business_description"
                  rows={3}
                  placeholder="e.g. We build a high-performance analytics platform for subscription commerce brands, helping them reduce churn by 30% through automated win-back workflows."
                  value={memory.business_description}
                  onChange={(e) => setMemory({ ...memory, business_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/20 transition-all resize-y shadow-inner"
                />
                <p className="text-[11px] text-neutral-300 mt-2">
                  A brief summary of what you sell, your core transformation, and target customer outcome.
                </p>
              </div>
            </div>

            {/* Preferred Tone (Frosted White Glassmorphic Card) */}
            <div 
              className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden transition-all duration-300 group hover:border-white/40 space-y-4"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <label htmlFor="preferred_tone" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shadow-sm">
                    <MessageSquareQuote size={15} strokeWidth={2.2} />
                  </div>
                  <span>Preferred Tone & Psychological Cadence</span>
                </label>
                <button
                  type="button"
                  onClick={() => setCustomToneMode(!customToneMode)}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-xs text-white font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                >
                  {customToneMode ? "Choose Presets" : "Custom Tone"}
                </button>
              </div>

              <div className="relative z-10">
                {!customToneMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {DEFAULT_TONE_OPTIONS.map((tone) => {
                      const isSelected = memory.preferred_tone === tone;
                      return (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setMemory({ ...memory, preferred_tone: tone })}
                          className={`px-4 py-3.5 rounded-2xl text-xs font-medium text-left border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.4)] font-bold scale-[1.02]"
                              : "bg-white/[0.04] border-white/15 text-neutral-200 hover:bg-white/[0.09] hover:border-white/30 hover:text-white"
                          }`}
                        >
                          <span className="font-semibold">{tone}</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Check size={11} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    id="preferred_tone"
                    type="text"
                    placeholder="e.g. Sarcastic yet authoritative Wall Street insider with high punchiness"
                    value={memory.preferred_tone}
                    onChange={(e) => setMemory({ ...memory, preferred_tone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
                  />
                )}
                <p className="text-[11px] text-neutral-300 mt-2">
                  The baseline voice framing applied automatically to your copy outputs.
                </p>
              </div>
            </div>

            {/* Additional Notes & Guardrails (Frosted White Glassmorphism Card) */}
            <div 
              className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden transition-all duration-300 group hover:border-white/40 space-y-3"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <label htmlFor="additional_notes" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shadow-sm">
                    <FileText size={15} strokeWidth={2.2} />
                  </div>
                  <span>Forbidden Clichés, Guardrails & Audience Nuances</span>
                </label>
              </div>
              <div className="relative z-10">
                <textarea
                  id="additional_notes"
                  rows={4}
                  placeholder="e.g. Never use clichés like 'game-changer' or 'supercharge'. Always emphasize ROI guarantee. Target audience is CMOs earning $250k+."
                  value={memory.additional_notes}
                  onChange={(e) => setMemory({ ...memory, additional_notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/20 transition-all resize-y shadow-inner"
                />
                <p className="text-[11px] text-neutral-300 mt-2">
                  Any specific guidelines, negative constraints, forbidden buzzwords, or pricing anchors.
                </p>
              </div>
            </div>

            {/* LIVE SYNTHESIS PREVIEW (Frosted White Glass Card) */}
            <div 
              className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden transition-all duration-300 group hover:border-white/40"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    <Sparkle size={14} />
                  </div>
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Live System Prompt Context Injection Preview
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white font-bold bg-white/15 px-2.5 py-1 rounded-full border border-white/25 shadow-sm">
                  Synchronized
                </span>
              </div>
              
              <div className="p-5 rounded-2xl bg-black/60 border border-white/15 font-mono text-[11px] text-neutral-200 leading-relaxed space-y-2 shadow-inner">
                <div><span className="text-white font-bold">OPERATOR_IDENTITY:</span> {memory.preferred_name ? `"${memory.preferred_name}"` : `<Default User>`}</div>
                <div><span className="text-white font-bold">INDUSTRY_NICHE:</span> {memory.niche ? `"${memory.niche}"` : `<General Conversion Marketing>`}</div>
                <div><span className="text-white font-bold">TONE_SIGNATURE:</span> "{memory.preferred_tone || "Bold and direct"}"</div>
                <div><span className="text-white font-bold">CORE_OFFER_CONTEXT:</span> {memory.business_description ? `"${memory.business_description.slice(0, 90)}..."` : `<Not specified - standard framing applied>`}</div>
                {memory.additional_notes && (
                  <div><span className="text-white font-bold">CONSTRAINTS_&_GUARDRAILS:</span> "{memory.additional_notes.slice(0, 90)}..."</div>
                )}
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={onGoToChat}
                className="px-5 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-bold text-white transition-all cursor-pointer backdrop-blur-xl hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isLoading}
                className="px-8 py-3 rounded-2xl bg-white text-black hover:bg-neutral-100 text-xs font-bold shadow-[0_0_30px_rgba(255,255,255,0.35)] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Memory Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Saved Success Toast with White Glassmorphism */}
        <AnimatePresence>
          {showSavedToast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-8 right-8 z-50 px-5 py-4 rounded-2xl bg-black/90 border border-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(255,255,255,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] flex items-center gap-3.5"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                <CheckCircle2 size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Memory Context Saved</p>
                <p className="text-[10px] text-neutral-300">Murgii will automatically apply this across all future copy briefs.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
