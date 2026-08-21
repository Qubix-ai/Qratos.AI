import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Save, 
  ArrowLeft, 
  Check, 
  Loader2, 
  HelpCircle,
  MessageSquareQuote,
  Building,
  Target,
  FileText,
  User,
  Sliders
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

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-transparent text-gray-200 overflow-y-auto custom-scrollbar relative">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoToChat}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#8B5CF6]/40 text-gray-300 hover:text-white transition-all cursor-pointer group"
              title="Return to Workspace"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Memory & Personalization
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[10px] font-bold text-[#E879F9] uppercase tracking-wider">
                  Persistent Tuning
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Configure your brand voice and background context once for seamless copy generation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoToChat}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              Back to Chat
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving || isLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_28px_rgba(217,70,239,0.6)] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
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
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/15 via-white/[0.03] to-[#D946EF]/10 border border-[#8B5CF6]/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              <QreatoLogo size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white mb-1">
                How Murgii Personalization Works
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                Tell Murgii about yourself once — it'll automatically apply this context to every piece of copy it generates for you, so you don't have to repeat yourself in every brief.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="text-[#8B5CF6] animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Preferred Name & Niche Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Preferred Name */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="preferred_name" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User size={14} className="text-[#E879F9]" />
                    Preferred Name / Operator Name
                  </label>
                </div>
                <input
                  id="preferred_name"
                  type="text"
                  placeholder="e.g. Alex Sterling or Acme Marketing"
                  value={memory.preferred_name}
                  onChange={(e) => setMemory({ ...memory, preferred_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
                <p className="text-[11px] text-gray-400">
                  How you'd like Murgii to address you or sign off on personal copy.
                </p>
              </div>

              {/* Niche / Industry */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="niche" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Target size={14} className="text-[#E879F9]" />
                    Niche / Industry
                  </label>
                </div>
                <input
                  id="niche"
                  type="text"
                  placeholder="e.g. B2B SaaS, High-Ticket E-commerce, Info Products"
                  value={memory.niche}
                  onChange={(e) => setMemory({ ...memory, niche: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
                <p className="text-[11px] text-gray-400">
                  Your primary market domain or industry vertical.
                </p>
              </div>
            </div>

            {/* Business Description */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="business_description" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building size={14} className="text-[#E879F9]" />
                  Business / Product Description
                </label>
              </div>
              <textarea
                id="business_description"
                rows={3}
                placeholder="e.g. We build a high-performance analytics platform for subscription commerce brands, helping them reduce churn by 30% through automated win-back workflows."
                value={memory.business_description}
                onChange={(e) => setMemory({ ...memory, business_description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all resize-y"
              />
              <p className="text-[11px] text-gray-400">
                A brief summary of what you sell, your core value proposition, and main offer.
              </p>
            </div>

            {/* Preferred Tone */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="preferred_tone" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquareQuote size={14} className="text-[#E879F9]" />
                  Preferred Tone of Voice
                </label>
                <button
                  type="button"
                  onClick={() => setCustomToneMode(!customToneMode)}
                  className="text-[11px] text-[#E879F9] hover:underline font-semibold cursor-pointer"
                >
                  {customToneMode ? "Choose from presets" : "Write custom tone"}
                </button>
              </div>

              {!customToneMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {DEFAULT_TONE_OPTIONS.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setMemory({ ...memory, preferred_tone: tone })}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                        memory.preferred_tone === tone
                          ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                          : "bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{tone}</span>
                      {memory.preferred_tone === tone && (
                        <Check size={14} className="text-[#E879F9] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  id="preferred_tone"
                  type="text"
                  placeholder="e.g. Sarcastic yet authoritative Wall Street insider with high punchiness"
                  value={memory.preferred_tone}
                  onChange={(e) => setMemory({ ...memory, preferred_tone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                />
              )}
              <p className="text-[11px] text-gray-400">
                The default writing style and personality applied across all four conversion engines.
              </p>
            </div>

            {/* Additional Notes */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="additional_notes" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} className="text-[#E879F9]" />
                  Additional Notes & Guardrails
                </label>
              </div>
              <textarea
                id="additional_notes"
                rows={4}
                placeholder="e.g. Never use clichés like 'game-changer' or 'supercharge'. Always emphasize ROI guarantee. Target audience is CMOs earning $250k+."
                value={memory.additional_notes}
                onChange={(e) => setMemory({ ...memory, additional_notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all resize-y"
              />
              <p className="text-[11px] text-gray-400">
                Any specific guidelines, forbidden words, target persona nuances, or unique selling points.
              </p>
            </div>

            {/* Bottom Save Action */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onGoToChat}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8 z-50 px-4 py-3 rounded-xl bg-[#0D0A18] border border-[#8B5CF6]/50 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400">
                <Check size={14} strokeWidth={3} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Memory context saved</p>
                <p className="text-[10px] text-gray-400">Murgii will automatically apply this to future copy briefs.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
