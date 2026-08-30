import { useState, useRef, useEffect } from "react";
import { 
  User as UserIcon, 
  LogOut, 
  PanelLeft, 
  Sparkles, 
  CreditCard, 
  ExternalLink,
  Wand2,
  Settings,
  SlidersHorizontal,
  SquarePen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QreatoLogo } from "./QreatoLogo";

interface TopNavProps {
  user: any;
  activeTab: string;
  remainingCredits: number | null;
  maxCredits?: number;
  userPlan?: string;
  onTabChange: (tab: string) => void;
  onMenuToggle: () => void;
  onLogout: () => void;
}

export function TopNav({
  user,
  activeTab,
  remainingCredits,
  maxCredits = 3,
  userPlan = "none",
  onTabChange,
  onMenuToggle,
  onLogout,
}: TopNavProps) {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target as Node)) {
        setSettingsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayCredits = remainingCredits !== null ? remainingCredits : maxCredits;

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#000000]/90 backdrop-blur-xl px-3 sm:px-5 flex items-center justify-between z-30 sticky top-0 shrink-0">
      {/* Left: Clean Sidebar Trigger (PanelLeft icon instead of 3-bar hamburger) */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-white/80 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-sm active:scale-95"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <PanelLeft size={18} className="stroke-[2.2]" />
        </button>

        {/* Small Brand Title for Clean Context */}
        <div className="flex items-center gap-2 pl-1">
          <QreatoLogo size={20} className="text-white" dotClassName="text-white fill-white" />
          <span className="text-xs sm:text-sm font-bold tracking-tight text-white font-nohemi hidden xs:inline-block">
            Qreato AI
          </span>
        </div>
      </div>

      {/* Right: Direct Navigation Links + Credits Indicator + Settings Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Primary Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => onTabChange("chat")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-[#8B5CF6]/20 text-[#E879F9] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Workspace
          </button>

          <button
            type="button"
            onClick={() => onTabChange("prompt-builder")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "prompt-builder"
                ? "bg-[#8B5CF6]/20 text-[#E879F9] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Wand2 size={12} />
            <span>Prompt Builder</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("pricing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pricing"
                ? "bg-[#8B5CF6]/20 text-[#E879F9] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CreditCard size={12} />
            <span>Pricing</span>
          </button>
        </div>

        {/* Top Settings Menu with Premium Glow & Rotation */}
        <div className="relative" ref={settingsMenuRef}>
          <button
            type="button"
            onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
            title="App Settings & Navigation"
            className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
              settingsMenuOpen
                ? "bg-white/20 border-white/60 text-white shadow-[0_0_20px_rgba(255,255,255,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] scale-105"
                : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/30"
            }`}
            aria-label="Open settings menu"
          >
            <Settings 
              size={16} 
              className={`transition-transform duration-300 ${settingsMenuOpen ? "rotate-90 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" : ""}`} 
            />
          </button>

          <AnimatePresence>
            {settingsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2.5 w-72 rounded-2xl p-2.5 z-[120]"
                style={{
                  background: "rgba(10, 8, 18, 0.92)",
                  backdropFilter: "blur(36px) saturate(1.9)",
                  WebkitBackdropFilter: "blur(36px) saturate(1.9)",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  boxShadow: "0 28px 70px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 255, 255, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
                }}
              >
                <div className="space-y-1">
                  {/* Workspace */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsMenuOpen(false);
                      onTabChange("chat");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:bg-white/[0.2] group-hover:border-white/40 shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-bold text-white">Workspace</span>
                      <span className="block truncate text-[10px] text-neutral-300">Interactive persuasion engine</span>
                    </div>
                  </button>

                  {/* Prompt Builder */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsMenuOpen(false);
                      onTabChange("prompt-builder");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:bg-white/[0.2] group-hover:border-white/40 shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <Wand2 size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-bold text-white">Prompt Builder</span>
                      <span className="block truncate text-[10px] text-neutral-300">Role-framed master prompts</span>
                    </div>
                  </button>

                  {/* Pricing & Plans */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsMenuOpen(false);
                      onTabChange("pricing");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:bg-white/[0.2] group-hover:border-white/40 shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <CreditCard size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-bold text-white">Pricing & Plans</span>
                      <span className="block truncate text-[10px] text-neutral-300">Credit quotas & tiers</span>
                    </div>
                  </button>

                  {/* Account Settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsMenuOpen(false);
                      onTabChange("account");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:bg-white/[0.2] group-hover:border-white/40 shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <UserIcon size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-bold text-white">Account Settings</span>
                      <span className="block truncate text-[10px] text-neutral-300">Subscription & security</span>
                    </div>
                  </button>

                  {/* Memory & Personalization */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsMenuOpen(false);
                      onTabChange("memory");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:bg-white/[0.2] group-hover:border-white/40 shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <SlidersHorizontal size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-bold text-white">Memory & Context</span>
                      <span className="block truncate text-[10px] text-neutral-300">Brand voice & preferences</span>
                    </div>
                  </button>

                  {/* Landing Control */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsMenuOpen(false);
                      onTabChange("landing");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer text-left group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:bg-white/[0.2] group-hover:border-white/40 shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <ExternalLink size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-bold text-white">Landing Page</span>
                      <span className="block truncate text-[10px] text-neutral-300">Return to landing</span>
                    </div>
                  </button>
                </div>

                <div className="pt-2 mt-1 border-t border-white/15">
                  {/* Sign Out */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400">
                      <LogOut size={14} />
                    </div>
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
