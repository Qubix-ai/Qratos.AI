import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ArrowUp,
  Zap,
  Mail,
  Target,
  Globe,
  Layers,
  Wand2,
  Check,
  X,
  Lock,
  Compass,
  FileText,
  Sliders,
  SlidersHorizontal,
  Send,
  Bookmark,
  ChevronRight,
  ChevronDown,
  Database,
  Menu,
  CreditCard,
  User as UserIcon,
  Shield,
  Crown,
  ExternalLink,
  Trophy,
} from "lucide-react";
import { QreatoLogo } from "./QreatoLogo";
import { AuthModal } from "./AuthModal";
import { LandingChallengeSection } from "./LandingChallengeSection";
import {
  ModesCycleVisual,
  PromptCompilerVisual,
  TierExpansionVisual,
  BoltEcosystemVisual,
  LinearPipelineVisual,
  PromptStudioInteractiveDemo
} from "./FeatureVisuals";

interface LandingPageProps {
  user?: any;
  userData?: any;
  onStart: () => void;
  onLogin?: () => void;
  onOpenBolt?: () => void;
  onNavigate?: (view: string) => void;
  onStartChallenge?: (initialText?: string) => void;
  userTier?: "free" | "core" | "max";
}

export function LandingPage({ user, userData, onStart, onLogin, onOpenBolt, onNavigate, onStartChallenge, userTier }: LandingPageProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);
  const [quickNavOpen, setQuickNavOpen] = useState(false);
  const quickNavRef = useRef<HTMLDivElement>(null);
  
  // Prompt builder interactive demo mode
  const [activeDemoMode, setActiveDemoMode] = useState<"email" | "ads" | "landing" | "psych">("email");

  const effectiveTier = userTier || (userData?.tier as "free" | "core" | "max") || "free";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickNavRef.current && !quickNavRef.current.contains(e.target as Node)) {
        setQuickNavOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuickNavOpen(false);
      }
    };
    if (quickNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [quickNavOpen]);

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      setAuthMode("login");
      setAuthModalOpen(true);
    }
  };

  const handleSignupClick = () => {
    if (onStart) {
      onStart();
    } else {
      setAuthMode("signup");
      setAuthModalOpen(true);
    }
  };

  const handleCraftPromptClick = () => {
    if (onNavigate) {
      onNavigate("prompt-builder");
    } else if (user) {
      onStart();
    } else {
      handleSignupClick();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-neutral-800 selection:text-white relative overflow-x-hidden font-sans">
      {/* Top Floating Glassmorphic Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 py-3 rounded-full bg-[#0E0E12]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative">
          {/* Brand Logo & Name */}
          <div 
            onClick={onStart}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <QreatoLogo size={18} className="text-black" />
            </div>
            <div 
              className="text-white text-lg font-bold tracking-tight font-['Geist',sans-serif] flex items-center gap-1"
            >
              <span className="font-bold text-white">murgii</span>
              <span className="font-semibold text-neutral-400">AI</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-400">
            <a href="#challenge" className="hover:text-white transition-colors flex items-center gap-1.5 text-neutral-300">
              <Trophy size={13} className="text-[#F59E0B]" />
              <span>Copy Challenge</span>
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#prompt-builder" className="hover:text-white transition-colors">Prompt Builder</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-xs font-medium text-neutral-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onStart}
              className="hidden sm:inline-flex text-xs font-semibold text-black bg-white hover:bg-neutral-200 px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              Start Free
            </button>

            {/* Quick Navigation Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setQuickNavOpen(!quickNavOpen)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                quickNavOpen
                  ? "bg-white/20 border border-white/40 text-white"
                  : "bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20"
              }`}
              aria-label="Toggle Quick Navigation"
              aria-expanded={quickNavOpen}
            >
              {quickNavOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Quick Navigation Floating Glassmorphic Panel */}
        <AnimatePresence>
          {quickNavOpen && (
            <>
              {/* Subtle backdrop overlay for outside click dismiss */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setQuickNavOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
              />

              {/* Floating Glassmorphic Panel Container */}
              <motion.div
                ref={quickNavRef}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-20 right-4 sm:right-6 lg:right-10 w-[calc(100vw-2rem)] sm:w-[440px] z-50 rounded-3xl p-4 sm:p-5 shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)]"
                style={{
                  background: "rgba(20, 20, 25, 0.7)",
                  backdropFilter: "blur(24px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                {/* Panel Header */}
                <div className="flex items-center justify-end pb-3 mb-2 border-b border-white/10 px-1">
                  <button
                    type="button"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close navigation panel"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* 6 Navigation Item Rows */}
                <div className="space-y-1">
                  {/* Row 1: Workspace */}
                  <div
                    onClick={() => {
                      setQuickNavOpen(false);
                      if (onNavigate) {
                        onNavigate("chat");
                      } else if (user) {
                        onStart();
                      } else {
                        handleLoginClick();
                      }
                    }}
                    className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-[1.03] group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">
                          Workspace
                        </span>
                        <span className="block text-[11px] text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                          Interactive AI Persuasion Engine
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE
                      </span>
                      <ChevronRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Row 2: Prompt Builder */}
                  <div
                    onClick={() => {
                      setQuickNavOpen(false);
                      handleCraftPromptClick();
                    }}
                    className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-[1.03] group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <Wand2 size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">
                          Prompt Builder
                        </span>
                        <span className="block text-[11px] text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                          Role-framed master prompt compiler
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-[#2E1848] text-purple-200 border border-purple-500/30 text-[9px] font-mono font-bold tracking-wider">
                        CORE / MAX
                      </span>
                      <ChevronRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Row 3: Pricing & Plans */}
                  <div
                    onClick={() => {
                      setQuickNavOpen(false);
                      if (onNavigate) onNavigate("pricing");
                      else handleSignupClick();
                    }}
                    className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-[1.03] group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <CreditCard size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">
                          Pricing & Plans
                        </span>
                        <span className="block text-[11px] text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                          Daily credit quotas & tier features
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ChevronRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Row 4: Account & Profile Settings */}
                  <div
                    onClick={() => {
                      setQuickNavOpen(false);
                      if (onNavigate) onNavigate("account");
                      else handleLoginClick();
                    }}
                    className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-[1.03] group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <UserIcon size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">
                          Account & Profile Settings
                        </span>
                        <span className="block text-[11px] text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                          Manage subscription & security
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ChevronRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Row 5: Memory & Personalization */}
                  <div
                    onClick={() => {
                      setQuickNavOpen(false);
                      if (onNavigate) onNavigate("memory");
                      else handleLoginClick();
                    }}
                    className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-[1.03] group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <SlidersHorizontal size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">
                          Memory & Personalization
                        </span>
                        <span className="block text-[11px] text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                          Brand voice & persistent context
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ChevronRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Row 6: How It Works */}
                  <div
                    onClick={() => {
                      setQuickNavOpen(false);
                      const el = document.getElementById("how-it-works");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.06] cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-[1.03] group-hover:bg-white/[0.15] group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <Compass size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors">
                          How It Works
                        </span>
                        <span className="block text-[11px] text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                          See how Murgii generates converting copy
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ChevronRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* CTA Button: OPEN WORKSPACE */}
                <div className="pt-3 mt-2 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setQuickNavOpen(false);
                      if (onNavigate) {
                        onNavigate("chat");
                      } else {
                        onStart();
                      }
                    }}
                    className="w-full py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-neutral-900 transition-all duration-150 cursor-pointer shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:shadow-[0_0_32px_rgba(255,255,255,0.4)]"
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <span>Open Workspace</span>
                    <ArrowRight size={15} className="text-neutral-900" />
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 sm:pt-40 pb-20 sm:pb-28 px-4 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Standalone White Premium Qreato Logo on top of headline */}
          <div className="flex items-center justify-center mb-7">
            <QreatoLogo size={46} className="text-white" dotClassName="text-white fill-white" />
          </div>

          {/* Main Hero Headline - Editorial Sans-Serif */}
          <div className="w-full max-w-4xl mx-auto mb-6 px-4">
            <h1 
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold font-['Geist',sans-serif] tracking-[-0.035em] leading-[1.08] text-white select-none text-center"
            >
              <span className="block">Word that sells.</span>
              <span className="block">Not just reads well.</span>
            </h1>
          </div>
          
          {/* Benefit-Focused Subheadline: 3 lines strictly balanced */}
          <p 
            className="text-sm sm:text-base md:text-[17px] text-neutral-400 max-w-2xl sm:max-w-3xl mx-auto mb-12 leading-relaxed font-normal px-4 text-center"
          >
            <span className="block">Give Murgii your idea. It applies the frameworks</span>
            <span className="block">copywriting legends Ogilvy, Halbert &amp; Schwartz built careers on.</span>
            <span className="block">All automatically and hands you copy that's built to convert.</span>
          </p>

          {/* Static Chat Interface Demonstration (Fully Visible, No Top Fade) */}
          <div className="w-full max-w-2xl mx-auto text-left">
            <div className="relative rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#09090B] p-4 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Inner messages viewport (fully visible, no clipping or top fade) */}
              <div className="space-y-4 pt-1 sm:pt-2 pb-1">
                {/* User Message Bubble - guaranteed single line */}
                <div className="flex justify-end">
                  <div className="user-bubble w-fit max-w-full bg-[#1A1A1E] border border-white/[0.09] rounded-[20px_20px_6px_20px] px-4 py-2.5 text-xs sm:text-sm md:text-[15px] text-white/95 shadow-[0_4px_18px_rgba(0,0,0,0.45)] whitespace-nowrap">
                    Why not just use ChatGPT or Claude for this?
                  </div>
                </div>

                {/* Murgii Assistant Message Bubble */}
                <div className="flex justify-start">
                  <div className="ai-bubble w-full bg-[#111114] border border-white/[0.07] rounded-2xl p-4 sm:p-5 text-sm sm:text-[15px] text-white/90 leading-relaxed shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <p className="text-white/90 text-sm sm:text-[15px] leading-relaxed m-0 text-left">
                      You can but you would have to already know AIDA, PAS &amp; Schwartz's awareness stages &amp; prompt for them correctly every time. Murgii has those frameworks built in. Give it the idea &amp; it picks the angle, applies the framework &amp; writes copy built to convert, not just built to read well.
                    </p>

                    {/* Qreato logo positioned on the right side of AI response */}
                    <div className="flex items-center justify-end pt-3 mt-3.5 border-t border-white/[0.06] select-none">
                      <div className="flex items-center text-white/40" title="Qreato">
                        <QreatoLogo size={14} className="text-white/40" dotClassName="text-white/40 fill-white/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Call to Action Button directly under the AI Chat Demonstration */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 relative z-20">
            <button
              type="button"
              onClick={onStart}
              className="w-full sm:w-auto px-9 py-4 rounded-full text-base font-bold text-neutral-950 bg-white hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-[0_0_35px_rgba(255,255,255,0.35)] hover:shadow-[0_0_50px_rgba(255,255,255,0.55)] border border-white flex items-center justify-center gap-2.5 select-none"
            >
              <span>Try murgii free</span>
              <ArrowRight size={16} className="text-neutral-950" />
            </button>
          </div>
        </div>
      </section>

      {/* Copy Score Challenge Featured Section - Glassmorphism & Conversion Matrix */}
      <LandingChallengeSection 
        onStartChallenge={(txt) => {
          if (onStartChallenge) {
            onStartChallenge(txt);
          } else if (onNavigate) {
            onNavigate("challenge");
          } else {
            handleSignupClick();
          }
        }}
      />

      {/* How Murgii AI Engineers Conversion Section */}
      <section id="how-it-works" className="py-28 sm:py-36 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 relative">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-5 tracking-tight leading-[1.08] text-white font-['Geist',sans-serif]">
              How Murgii Engineers Conversion
            </h2>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-6" />
            <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed px-4">
              Murgii combines direct-response psychology, conversion diagnostics, and AI to produce copy that captures attention, breaks inertia, and drives action.
            </p>
          </div>

          <div id="features" className="space-y-40 sm:space-y-48">
            {/* BLOCK 1: 5 Dedicated Modes */}
            <FeatureBlock 
              index={1}
              title="5 Dedicated Modes"
              description="Save your niche, audience & brand voice once. Generate conversion-ready assets across all 5 modes instantly."
              points={[
                "Multi-email sequence campaigns",
                "Pattern-interrupt ad hooks",
                "Sales pages & landing assets",
                "Conversion triggers & bias frames",
                "Instagram, TikTok & social content"
              ]}
              visual={<ModesCycleVisual />}
            />

            {/* BLOCK 2: Don't Just Write. Build the Machine. */}
            <FeatureBlock 
              index={2}
              reversed={false}
              title={
                <>
                  Don't Just Write.<br />Build the Machine.
                </>
              }
              description={
                <div className="space-y-3.5 text-gray-300 text-base md:text-lg leading-relaxed">
                  <p className="font-medium text-white/90">
                    Murgii makes your message persuasive. Bolt turns that persuasion into a business.
                  </p>
                  <p className="text-gray-300/90 text-sm sm:text-base">
                    Blueprint your offer. Engineer your funnel. Build your monetization system. Then execute it through a single connected operating system.
                  </p>
                </div>
              }
              trustLine="Strategy → Systems → Execution → Revenue"
              points={[
                "Blueprint Studio",
                "6-Category Revenue Roadmap",
                "AI Blueprint Assist",
                "Connected Revenue Infrastructure"
              ]}
              visual={null}
            />
          </div>
        </div>
      </section>

      {/* PROMPT BUILDER ARCHITECTURE SECTION */}
      <section id="prompt-builder" className="py-24 sm:py-32 px-4 relative overflow-hidden bg-[#09090B]">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 px-4">
            <h2 
              className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white leading-[1.08] font-['Geist',sans-serif]"
            >
              <span className="block">Your Strategy.</span>
              <span className="block">Built Into Every Prompt.</span>
            </h2>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-5" />
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Create powerful, reusable prompts tailored to your business, audience, goals &amp; voice.
            </p>
          </div>

          {/* Interactive Supporting Visual: Clean High-Contrast Card */}
          <div 
            className="max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-[#0E0E12] shadow-2xl p-4 sm:p-6 relative overflow-hidden"
          >
            {/* Mode Selection Pills (Emails / Ads / Pages / Persuasion / Content) */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <Wand2 size={13} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight font-['Geist',sans-serif]">
                    Select Mode
                  </h4>
                </div>
              </div>

              {/* 5 Mode Selection Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10 w-full md:w-auto">
                {[
                  { id: "email", label: "Emails", icon: Mail },
                  { id: "ads", label: "Ads", icon: Target },
                  { id: "landing", label: "Pages", icon: Globe },
                  { id: "psych", label: "Persuasion", icon: Zap },
                  { id: "content", label: "Content", icon: Layers }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeDemoMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveDemoMode(tab.id as any)}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={12} strokeWidth={2} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Assembling Prompt Studio Demo */}
            <PromptStudioInteractiveDemo 
              activeArchetype={activeDemoMode} 
              onSelectArchetype={(m) => setActiveDemoMode(m as any)} 
            />

            {/* Bottom CTA Area */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center">
              <button
                type="button"
                onClick={handleCraftPromptClick}
                className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs tracking-tight transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Build Your First Prompt →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* UPGRADED REPLACEMENT SECTION: Clean, Honest "How Murgii Operates" 3-Step Flow & 5-Mode Capability Grid */}
      <section id="workflow" className="py-24 sm:py-32 px-4 relative overflow-hidden bg-[#09090B]">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 px-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-neutral-300 uppercase tracking-widest mb-4"
            >
              <Compass size={11} className="text-white" />
              THE EXECUTION WORKFLOW
            </div>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-['Geist',sans-serif] max-w-2xl mx-auto leading-[1.1]"
            >
              Strategy In. Better Copy Out.
            </h2>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mt-4" />
          </div>

          {/* Live Linear 3-Stage Pipeline Demonstration */}
          <LinearPipelineVisual />
        </div>
      </section>

      {/* Affiliate Partner Section (Positioned Directly Above Footer) */}
      <section className="relative py-12 sm:py-16 overflow-hidden bg-[#09090B]">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div 
            className="rounded-2xl border border-white/[0.08] p-6 sm:p-8 shadow-xl bg-[#0E0E12] relative overflow-hidden"
          >
            <div className="space-y-6 relative z-10">
              {/* Header Info */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
                  <Sparkles size={11} className="text-white" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
                    Qreato partner program
                  </span>
                </div>

                <h3 
                  className="text-2xl sm:text-3xl font-bold text-white font-['Geist',sans-serif] tracking-tight leading-tight"
                >
                  Your Audience. Your Link. 50% Yours.
                </h3>

                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl">
                  Recommend Murgii to creators and founders who need high-converting copy, and earn 50% of their first paid month when they become a customer.
                </p>
              </div>

              {/* 3 Highlight Metric Cards - Compact & Clean */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-1">
                  <span className="text-xl font-bold text-white font-mono">50%</span>
                  <span className="text-xs text-neutral-400 font-normal">First-month commission</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-1">
                  <span className="text-xl font-bold text-white font-mono">1 Link</span>
                  <span className="text-xs text-neutral-400 font-normal">Everything tracked automatically</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-1">
                  <span className="text-xl font-bold text-white font-mono">0 Dashboards</span>
                  <span className="text-xs text-neutral-400 font-normal">Clicks, signups &amp; earnings in Whop</span>
                </div>
              </div>

              {/* Call to Action Footer Row */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-medium text-neutral-300 font-['Geist',sans-serif]">
                  Turn Your Influence Into Income
                </span>

                <a
                  href="https://whop.com/qreato/ai-leverage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Become a Murgii Partner →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <LandingFAQSection 
        onStartChallenge={onStartChallenge} 
        onNavigate={onNavigate} 
        handleSignupClick={handleSignupClick} 
      />

      {/* Footer Ecosystem */}
      <footer className="relative pt-20 pb-12 overflow-hidden border-t border-white/5 bg-transparent">
        {/* Cinematic Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-12 xl:gap-16 pb-16 border-b border-white/10">
            {/* BRAND & VALUE PROP */}
            <div className="max-w-md space-y-5">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={onStart}>
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <QreatoLogo size={18} className="text-black" />
                </div>
                <div 
                  className="text-white text-xl font-bold tracking-tight font-['Geist',sans-serif] flex items-center gap-1"
                >
                  <span>murgii</span>
                  <span className="text-neutral-400 font-normal">AI</span>
                </div>
              </div>

              {/* Value Statement */}
              <p className="text-neutral-400 text-xs leading-relaxed font-normal max-w-sm">
                Murgii is a direct-response copywriting engine engineered to write emails, ads, sales pages, and content that drives real revenue.
              </p>
            </div>

            {/* CATEGORIZED FOOTER SECTIONS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-6 lg:gap-8 flex-1 w-full">
              {/* 1. COMPANY */}
              <div className="space-y-3.5">
                <h4 
                  className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-['Geist',sans-serif]"
                >
                  Company
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: "Media", href: "/media", key: "media" },
                    { label: "Enterprise", href: "/enterprise", key: "enterprise" },
                    { label: "Security", href: "/security", key: "security" },
                    { label: "Trust Centre", href: "/trust-centre", key: "trust-centre" }
                  ].map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onNavigate) {
                            onNavigate(item.key);
                          } else if (typeof window !== "undefined") {
                            window.history.pushState({}, "", item.href);
                            window.dispatchEvent(new Event("popstate"));
                          }
                        }}
                        className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] block"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. LEGAL */}
              <div className="space-y-3.5">
                <h4 
                  className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-['Geist',sans-serif]"
                >
                  Legal
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: "Terms of Service", href: "/terms", key: "terms" },
                    { label: "Privacy Policy", href: "/privacy", key: "privacy" },
                    { label: "Refund Policy", href: "/refund-policy", key: "refund-policy" },
                    { label: "Platform Rules", href: "/platform-rules", key: "platform-rules" },
                    { label: "General Rules", href: "/general-rules", key: "general-rules" }
                  ].map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onNavigate) {
                            onNavigate(item.key);
                          } else if (typeof window !== "undefined") {
                            window.history.pushState({}, "", item.href);
                            window.dispatchEvent(new Event("popstate"));
                          }
                        }}
                        className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] block"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. PRODUCT */}
              <div className="space-y-3.5">
                <h4 
                  className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-['Geist',sans-serif]"
                >
                  Product
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate("pricing");
                        } else {
                          handleLoginClick();
                        }
                      }}
                      className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] block"
                    >
                      Pricing
                    </button>
                  </li>
                  <li>
                    <a
                      href="/affiliates"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigate) {
                          onNavigate("affiliates");
                        } else if (typeof window !== "undefined") {
                          window.history.pushState({}, "", "/affiliates");
                          window.dispatchEvent(new Event("popstate"));
                        }
                      }}
                      className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] block"
                    >
                      Affiliates
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={onStart}
                      className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] block"
                    >
                      Internal Tools
                    </button>
                  </li>
                </ul>
              </div>

              {/* 4. RESOURCES */}
              <div className="space-y-3.5">
                <h4 
                  className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-['Geist',sans-serif]"
                >
                  Resources
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: "Learn", href: "/learn", key: "learn" },
                    { label: "Guides", href: "/guides", key: "guides" },
                    { label: "Support", href: "/support", key: "support" },
                    { label: "Reviews", href: "/reviews", key: "reviews" }
                  ].map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onNavigate) {
                            onNavigate(item.key);
                          } else if (typeof window !== "undefined") {
                            window.history.pushState({}, "", item.href);
                            window.dispatchEvent(new Event("popstate"));
                          }
                        }}
                        className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] block"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. COMMUNITY */}
              <div className="space-y-3.5">
                <h4 
                  className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-['Geist',sans-serif]"
                >
                  Community
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://www.instagram.com/qreato.io?igsh=MTlmNHN6ampqYWF3bQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] flex items-center gap-2"
                    >
                      <span>Instagram</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/s4lma9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] flex items-center gap-2"
                    >
                      <span>X</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://whop.com/qreato/ai-leverage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-left font-['Geist',sans-serif] flex items-center gap-2"
                    >
                      <span>Whop</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CLEAN RIGHTS RESERVED STRIP */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p 
              className="text-xs text-neutral-500 font-['Geist',sans-serif]"
            >
              © 2026 Qreato Labs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Lightweight Glassmorphic Information / Legal Modal */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-2xl bg-[#0C091A] border border-white/15 p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 
                  className="text-lg font-bold text-white font-nohemi"
                  style={{ fontFamily: "'Nohemi', sans-serif" }}
                >
                  {infoModal.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setInfoModal(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 font-sans">
                {infoModal.content}
              </p>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode} 
        onSuccess={onStart} 
      />
    </div>
  );
}

interface FeatureBlockProps {
  index: number;
  title: React.ReactNode;
  description: React.ReactNode;
  trustLine?: string;
  points: string[];
  visual?: React.ReactNode;
  reversed?: boolean;
}

function FeatureBlock({ index, title, description, trustLine, points, visual, reversed }: FeatureBlockProps) {
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className={`flex flex-col ${visual ? 'lg:flex-row items-center gap-16 md:gap-32' : 'max-w-4xl mx-auto'} ${reversed && visual ? 'lg:flex-row-reverse' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 space-y-8 w-full"
      >
        <div className="inline-flex items-center gap-4">
           <span 
             className="text-4xl md:text-5xl font-bold font-mono text-neutral-500 tracking-tight select-none"
           >
             0{index}
           </span>
           <div className="w-12 h-[1px] bg-white/20" />
        </div>
        <h3 
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white font-['Geist',sans-serif]"
        >
          {title}
        </h3>
        <div className="space-y-4">
          {typeof description === "string" ? (
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">{description}</p>
          ) : (
            description
          )}
          {trustLine && (
            <div className="inline-flex items-center rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-1.5">
              <span className="text-xs font-mono tracking-wider font-semibold text-neutral-300">
                {trustLine}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-3 pt-2">
           {points.map((p, i) => (
             <div key={i} className="flex items-start gap-3 group">
               <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2 shrink-0 group-hover:bg-white transition-colors" />
               <span className="text-sm font-normal text-neutral-300 group-hover:text-white transition-colors leading-relaxed">{p}</span>
             </div>
           ))}
        </div>
      </motion.div>

      {visual && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full relative"
        >
          <div 
            className="w-full rounded-2xl bg-[#0E0E12] border border-white/[0.08] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 sm:p-5 relative"
          >
             <div className="relative w-full flex items-center justify-center">
               {visual}
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface LandingFAQSectionProps {
  onStartChallenge?: (initialText?: string) => void;
  onNavigate?: (view: string) => void;
  handleSignupClick: () => void;
}

function LandingFAQSection({ onStartChallenge, onNavigate, handleSignupClick }: LandingFAQSectionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqData = [
    {
      q: "I'm not a copywriter. What if I just don't have it in me?",
      a: "You're not missing talent. You're missing a system. Nobody sat you down and taught you why one sentence makes someone reach for their wallet and another makes them scroll past. That's not a gift some people are born with — it's a mechanism, and mechanisms can be handed to you. Murgii is that mechanism. You don't need to become a copywriter. You need to stop being the bottleneck between your audience and your offer. Open it, describe what you're selling, and watch what \"having it in me\" actually looks like."
    },
    {
      q: "I've tried ChatGPT. It sounds like a robot wrote a brochure.",
      a: "That's because it did. ChatGPT was built to be agreeable and safe — the two things that kill a sale on contact. Nobody buys from \"helpful.\" They buy from tension, from a hook that won't let them look away, from a close that makes staying the same feel more expensive than saying yes. Murgii was never trained to be nice. It was trained to move people. That's the whole difference, and you'll feel it in the first line it writes you."
    },
    {
      q: "I publish copy and just hope it works. I have no idea if it's actually good.",
      a: "That's the most expensive habit in your business, and you don't even see the bill. Every headline you guess on, every email you send blind — that's revenue leaking out through a hole you can't see, because nobody ever showed you where to look. Copy Score closes that hole. Paste anything you've written and get a real number — Attention, Clarity, Desire, Persuasion, Action — the five things that actually decide whether a stranger becomes a customer. No more hoping. You'll know exactly what's bleeding you dry before your bank account tells you."
    },
    {
      q: "I hired a copywriter once. Slow, expensive, and I explained my business to them every single time.",
      a: "A copywriter is a rented brain — you pay for their attention, and the second the invoice is paid, that attention walks out the door with them. Then you're back to explaining your business from zero, again, on their schedule, at their rate. Murgii doesn't forget you. Tell it your business once in Memory & Personalization, and it's baked into everything it writes, forever, on your schedule, for a fraction of what one good freelancer charges for one email."
    },
    {
      q: "I've built a real audience. It's just not turning into real money.",
      a: "That gap is the most painful place to stand in business — watching people who clearly like you not buy from you. Here's the truth nobody tells you: an audience is just attention, and attention is not revenue. The bridge between the two is persuasion, and if nobody ever taught you persuasion, that bridge simply doesn't exist yet, no matter how many people are watching. You don't have a growth problem. You have a conversion problem. Murgii was built for exactly this moment — the moment attention is finally supposed to become income."
    },
    {
      q: "I'm trying to scale but I can't write everything myself anymore.",
      a: "That's not a discipline problem. That's math. One person has a finite number of hours, and scaling a business demands five different kinds of writing happening at once — emails, ads, pages, content, persuasion — all in your voice, all on time. You were never supposed to be five specialists wearing one body. Murgii gives you all five, pulling from the same brand memory, so growth stops being capped by how many hours you personally have left in a day."
    },
    {
      q: "How do I know this isn't just another overhyped tool?",
      a: "Good. Stay skeptical — most tools have earned it. So don't take our word for anything. Paste your own copy into Copy Score right now, free, no card, no pitch. You'll get the real number, weaknesses and all — not a flattering score designed to make you feel good, an honest one designed to make you better. If it tells you the truth about copy you already wrote, you'll know exactly what it'll do for the copy you haven't written yet."
    }
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 relative overflow-hidden bg-[#09090B]">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-['Geist',sans-serif] leading-tight"
          >
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-[1px] bg-white/20 mx-auto mt-5" />
        </div>

        <div className="space-y-3">
          {faqData.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div 
                key={idx}
                className="rounded-xl bg-[#0E0E12] border border-white/[0.08] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <span className="text-sm sm:text-base font-semibold text-white group-hover:text-neutral-200 transition-colors font-['Geist',sans-serif]">
                    {item.q}
                  </span>
                  <div 
                    className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <ChevronDown size={15} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal border-t border-white/[0.06] pt-3.5">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA below the FAQ block */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => {
              const challengeEl = document.getElementById("challenge");
              if (challengeEl) {
                challengeEl.scrollIntoView({ behavior: "smooth" });
              } else if (onStartChallenge) {
                onStartChallenge();
              } else if (onNavigate) {
                onNavigate("challenge");
              } else {
                handleSignupClick();
              }
            }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors cursor-pointer group shadow-sm"
          >
            <span>See Your Copy Score</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
