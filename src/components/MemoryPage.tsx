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
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#07060B] text-white overflow-y-auto custom-scrollbar relative selection:bg-zinc-800 selection:text-white">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={onGoToChat}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer group"
              title="Return to Workspace"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1 flex items-center gap-1.5">
                <Brain size={12} className="text-zinc-400" />
                Brand Context Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Memory & Personalization
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Configure your brand voice and offer background once for seamless, zero-brief copy generation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onGoToChat}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Workspace
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving || isLoading}
              className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
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

        {/* Informative Explanation Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0B14] border border-zinc-800 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="pt-0.5 shrink-0">
                <QreatoLogo size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    How Murgii Personalization Works
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    AUTO-INJECTED
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  Tell Murgii your background once — it automatically injects this context into every copy brief across Email, Ads, Sales Pages, and Psychology modes without repetitive manual prompting.
                </p>
              </div>
            </div>

            {/* Tuning Strength Metric Box */}
            <div className="w-full sm:w-48 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 shrink-0">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5 font-bold">
                <span>TUNING STRENGTH</span>
                <span className="text-white font-bold">{tuningStrength}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(8, tuningStrength)}%` }}
                />
              </div>
              <span className="block text-[9px] text-zinc-500 mt-1 font-mono">
                {filledCount} of 5 vectors configured
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="text-zinc-400 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Preferred Name & Niche Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Preferred Name */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0B14] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="preferred_name" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User size={15} className="text-zinc-400" />
                    <span>Preferred / Operator Name</span>
                  </label>
                </div>
                <div>
                  <input
                    id="preferred_name"
                    type="text"
                    placeholder="e.g. Alex Sterling or Acme Marketing"
                    value={memory.preferred_name}
                    onChange={(e) => setMemory({ ...memory, preferred_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-zinc-500 transition-all"
                  />
                  <p className="text-[11px] text-zinc-400 mt-2">
                    How you'd like Murgii to address you or sign off on personal copy.
                  </p>
                </div>
              </div>

              {/* Niche / Industry */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0B14] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="niche" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Target size={15} className="text-zinc-400" />
                    <span>Niche / Industry Vertical</span>
                  </label>
                </div>
                <div>
                  <input
                    id="niche"
                    type="text"
                    placeholder="e.g. B2B SaaS, High-Ticket E-commerce, Info Products"
                    value={memory.niche}
                    onChange={(e) => setMemory({ ...memory, niche: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-zinc-500 transition-all"
                  />
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Your primary market domain or industry vertical for laser-targeted framing.
                  </p>
                </div>
              </div>
            </div>

            {/* Business Description */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0B14] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="business_description" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building size={15} className="text-zinc-400" />
                  <span>Business / Product Value Proposition</span>
                </label>
              </div>
              <div>
                <textarea
                  id="business_description"
                  rows={3}
                  placeholder="e.g. We build a high-performance analytics platform for subscription commerce brands, helping them reduce churn by 30% through automated win-back workflows."
                  value={memory.business_description}
                  onChange={(e) => setMemory({ ...memory, business_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-zinc-500 transition-all resize-y"
                />
                <p className="text-[11px] text-zinc-400 mt-2">
                  A brief summary of what you sell, your core transformation, and target customer outcome.
                </p>
              </div>
            </div>

            {/* Preferred Tone */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0B14] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="preferred_tone" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquareQuote size={15} className="text-zinc-400" />
                  <span>Preferred Tone & Psychological Cadence</span>
                </label>
                <button
                  type="button"
                  onClick={() => setCustomToneMode(!customToneMode)}
                  className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white font-medium transition-all cursor-pointer"
                >
                  {customToneMode ? "Choose Presets" : "Custom Tone"}
                </button>
              </div>

              <div>
                {!customToneMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {DEFAULT_TONE_OPTIONS.map((tone) => {
                      const isSelected = memory.preferred_tone === tone;
                      return (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setMemory({ ...memory, preferred_tone: tone })}
                          className={`px-4 py-3 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-white text-black border-white font-bold"
                              : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                          }`}
                        >
                          <span>{tone}</span>
                          {isSelected && (
                            <Check size={14} className="text-black shrink-0" />
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
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-zinc-500 transition-all"
                  />
                )}
                <p className="text-[11px] text-zinc-400 mt-2">
                  The baseline voice framing applied automatically to your copy outputs.
                </p>
              </div>
            </div>

            {/* Additional Notes & Guardrails */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0B14] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="additional_notes" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText size={15} className="text-zinc-400" />
                  <span>Forbidden Clichés, Guardrails & Audience Nuances</span>
                </label>
              </div>
              <div>
                <textarea
                  id="additional_notes"
                  rows={4}
                  placeholder="e.g. Never use clichés like 'game-changer' or 'supercharge'. Always emphasize ROI guarantee. Target audience is CMOs earning $250k+."
                  value={memory.additional_notes}
                  onChange={(e) => setMemory({ ...memory, additional_notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-zinc-500 transition-all resize-y"
                />
                <p className="text-[11px] text-zinc-400 mt-2">
                  Any specific guidelines, negative constraints, forbidden buzzwords, or pricing anchors.
                </p>
              </div>
            </div>

            {/* HOW MURGII USES YOUR SAVED MEMORY */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0B14] border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkle size={15} className="text-zinc-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    How Murgii Personalizes Your Copy
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  ACTIVE IN EVERY GENERATION
                </span>
              </div>
              
              <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-300 leading-relaxed space-y-3">
                <p>
                  Murgii will address you as{" "}
                  {memory.preferred_name?.trim() ? (
                    <strong className="text-white font-semibold">{memory.preferred_name.trim()}</strong>
                  ) : (
                    <span className="text-zinc-500 italic">Add your name above so Murgii can personalize your copy</span>
                  )}
                  , write specifically for the{" "}
                  {memory.niche?.trim() ? (
                    <strong className="text-white font-semibold">{memory.niche.trim()}</strong>
                  ) : (
                    <span className="text-zinc-500 italic">your selected industry</span>
                  )}{" "}
                  market, and speak in a{" "}
                  <strong className="text-white font-semibold">{memory.preferred_tone || "Bold and direct"}</strong>{" "}
                  tone.
                </p>

                <p>
                  {memory.business_description?.trim() ? (
                    <span>
                      Outputs will automatically spotlight your core offer:{" "}
                      <span className="text-white font-medium italic">“{memory.business_description.trim()}”</span>
                    </span>
                  ) : (
                    <span className="text-zinc-500 italic">
                      Add your product or service description above so Murgii seamlessly anchors your value proposition without you having to retype it.
                    </span>
                  )}
                </p>

                <p>
                  {memory.additional_notes?.trim() ? (
                    <span>
                      Murgii will also strictly obey your custom guardrails:{" "}
                      <span className="text-white font-medium italic">“{memory.additional_notes.trim()}”</span>
                    </span>
                  ) : (
                    <span className="text-zinc-500 italic">
                      Add any forbidden clichés or negative constraints above to automatically keep every output on-brand.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={onGoToChat}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isLoading}
                className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
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

        {/* Saved Success Toast */}
        <AnimatePresence>
          {showSavedToast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-8 right-8 z-50 px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center gap-3.5 shadow-2xl"
            >
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Memory Context Saved</p>
                <p className="text-[10px] text-zinc-400">Murgii will automatically apply this across all future copy briefs.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
