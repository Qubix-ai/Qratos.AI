import { useState, useRef, useEffect } from "react";
import { 
  Coins, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  Sparkles, 
  CreditCard, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Wand2,
  Settings,
  Sliders,
  SlidersHorizontal,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  maxCredits = 20,
  userPlan = "basic",
  onTabChange,
  onMenuToggle,
  onLogout,
}: TopNavProps) {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target as Node)) {
        setSettingsMenuOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayCredits = remainingCredits !== null ? remainingCredits : maxCredits;

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#07050E]/85 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shrink-0">
      {/* Left: Mobile Sidebar Trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right: Direct Navigation Links + Credits Indicator + Settings Menu + Account */}
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

        {/* Daily Credits Indicator */}
        <button
          type="button"
          onClick={() => onTabChange("pricing")}
          title="Daily credits remaining. Click to view pricing tiers."
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer text-white"
        >
          <Coins size={12} className="text-white" />
          <span className="text-[11px] font-bold text-white tracking-wider font-mono">
            {displayCredits}
          </span>
        </button>

        {/* Top Settings Menu (near credits badge) */}
        <div className="relative" ref={settingsMenuRef}>
          <button
            type="button"
            onClick={() => {
              setSettingsMenuOpen(!settingsMenuOpen);
              setAccountMenuOpen(false);
            }}
            title="App Settings & Personalization"
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              settingsMenuOpen || activeTab === "memory"
                ? "bg-[#8B5CF6]/20 border-[#8B5CF6]/60 text-[#E879F9] shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20"
            }`}
            aria-label="Open settings menu"
          >
            <Settings size={16} className={`transition-transform duration-300 ${settingsMenuOpen ? "rotate-45" : ""}`} />
          </button>

          <AnimatePresence>
            {settingsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2 w-72 rounded-2xl p-3 z-[120]"
                style={{
                  background: "rgba(11, 8, 22, 0.94)",
                  backdropFilter: "blur(32px) saturate(1.8)",
                  WebkitBackdropFilter: "blur(32px) saturate(1.8)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: "0 28px 70px -10px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
                }}
              >
                <div className="px-3 py-2 border-b border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E879F9] shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
                    <p className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest font-bold">Settings & Nav</p>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  {/* Workspace */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsMenuOpen(false);
                      onTabChange("chat");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer text-left group"
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer text-left group"
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer text-left group"
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer text-left group"
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer text-left group"
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer text-left group"
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

        {/* Account Dropdown Avatar */}
        <div className="relative" ref={accountMenuRef}>
          <button
            type="button"
            onClick={() => {
              setAccountMenuOpen(!accountMenuOpen);
              setSettingsMenuOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#8B5CF6]/40 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#D946EF] flex items-center justify-center text-white font-black text-[10px] shadow-[0_0_10px_rgba(139,92,246,0.4)]">
              {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={12} />}
            </div>
            <span className="hidden lg:inline-block text-xs font-semibold text-white/80 max-w-[100px] truncate">
              {user?.email?.split("@")[0] || "Account"}
            </span>
            <ChevronDown size={12} className={`text-white/40 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {accountMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2 w-64 rounded-2xl p-2.5 z-[120]"
                style={{
                  background: "rgba(11, 8, 22, 0.94)",
                  backdropFilter: "blur(32px) saturate(1.8)",
                  WebkitBackdropFilter: "blur(32px) saturate(1.8)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: "0 28px 70px -10px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
                }}
              >
                <div className="px-3 py-2.5 border-b border-white/15">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono text-neutral-300 uppercase tracking-wider font-bold">Account Plan</p>
                    <span className="px-2 py-0.5 rounded bg-[#8B5CF6]/25 border border-[#8B5CF6]/50 text-[9px] font-black text-[#E879F9] uppercase shadow-sm">
                      {userPlan.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white truncate mt-1">{user?.email || "Authenticated User"}</p>
                </div>

                <div className="py-1.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onTabChange("account");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                  >
                    <UserIcon size={14} className="text-white" />
                    <span>My Profile & Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onTabChange("memory");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                  >
                    <SlidersHorizontal size={14} className="text-white" />
                    <span>Memory & Personalization</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onTabChange("pricing");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                  >
                    <CreditCard size={14} className="text-white" />
                    <span>Pricing & Plans</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onTabChange("landing");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                  >
                    <LayoutDashboard size={14} className="text-white" />
                    <span>Landing Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onTabChange("pricing");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#E879F9] hover:bg-[#8B5CF6]/20 transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={13} />
                      <span>Upgrade Plan</span>
                    </span>
                    <ChevronRight size={12} className="text-[#E879F9]" />
                  </button>
                </div>

                <div className="pt-1.5 mt-1 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={14} />
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
