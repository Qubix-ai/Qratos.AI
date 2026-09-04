import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "motion/react";
import {
  Sparkles,
  ArrowRight,
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
import { Murgii3DChicken } from "./Murgii3DChicken";
import { TrueFocus } from "./TrueFocus";
import { ShinyText } from "./ShinyText";
import LightPillar from "./LightPillar";
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
    <div className="min-h-screen bg-[#07060B] text-white selection:bg-[#8B5CF6]/40 selection:text-white relative overflow-x-hidden font-sans">
      {/* Top Floating Glassmorphic Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 py-3 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
          {/* Brand Logo & Name */}
          <div 
            onClick={onStart}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.35)] group-hover:scale-105 transition-transform shrink-0">
              <QreatoLogo size={20} className="text-black" />
            </div>
            <div 
              className="text-white text-xl font-bold tracking-tight font-nohemi flex items-center gap-1"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              <span className="font-extrabold text-white">murgii</span>
              <span className="font-extrabold text-white">AI</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-gray-300">
            <a href="#challenge" className="hover:text-white transition-colors flex items-center gap-1.5 text-white/90">
              <Trophy size={13} className="text-[#FFBE0B]" />
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
              className="text-xs font-bold text-gray-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={handleSignupClick}
              className="hidden sm:inline-flex text-xs font-bold text-black bg-white hover:bg-gray-100 px-4 py-2 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 cursor-pointer"
            >
              Start Free
            </button>

            {/* Quick Navigation Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setQuickNavOpen(!quickNavOpen)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                quickNavOpen
                  ? "bg-white/20 border border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
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
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                      QUICK NAVIGATION
                    </span>
                  </div>
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
      <section className="relative pt-36 sm:pt-44 pb-24 sm:pb-32 px-4 overflow-hidden">
        {/* Subtle Dark Vignette Overlay for High Contrast Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/40 via-transparent to-[#050508]/90 pointer-events-none z-[1]" />

        {/* Cinematic Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none z-[2]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none z-[2]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-[#D946EF]/10 rounded-full blur-[160px] pointer-events-none z-[2]" />
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-[2]" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* 3D Animated Murgii Circular Orb Mascot Showcase with Centered Qreato Geometric Mark */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center mb-6"
          >
            <Murgii3DChicken size="lg" interactive={true} showPedestal={true} showHologram={true} showMagicRings={false} />
          </motion.div>
          
          {/* Main Hero Headline in Nohemi Bold with Gold Shimmer Wave Effect */}
          <div className="w-full max-w-6xl mx-auto mb-8 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.75rem] 2xl:text-[6.5rem] font-bold font-nohemi tracking-[-0.02em] leading-[1.05] text-white [text-shadow:0_4px_35px_rgba(0,0,0,0.9)] select-none text-center"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              <ShinyText
                text="Say Less. Make It Land."
                speed={2.4}
                delay={0.1}
                color="#ffffff"
                shineColor="#FFBE0B"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
                disabled={false}
                className="font-nohemi font-bold"
              />
            </motion.h1>
          </div>
          
          {/* Benefit-Focused Subheadline with Balanced Line Wrapping */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-base sm:text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto mb-10 leading-relaxed font-normal px-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            style={{ textWrap: "balance" }}
          >
            Give murgii the idea, offer or message. It finds the strongest angle &amp; turns it into clear, persuasive copy your audience can understand &amp; act on.
          </motion.p>

          {/* Primary Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.18)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLoginClick}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold text-white flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(16px) saturate(1.5)",
                WebkitBackdropFilter: "blur(16px) saturate(1.5)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
              }}
            >
              <span className="font-bold text-white tracking-tight">Try murgii free →</span>
            </motion.button>
          </motion.div>
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
      <section id="how-it-works" className="py-36 sm:py-44 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-28 relative">
            <h2 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 tracking-tight leading-[1.12] text-white select-none text-center font-nohemi"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              <span className="block text-white font-nohemi" style={{ fontFamily: "'Nohemi', sans-serif" }}>
                How Murgii AI
              </span>
              <span className="block mt-2 sm:mt-3 font-nohemi" style={{ fontFamily: "'Nohemi', sans-serif" }}>
                <TrueFocus 
                  sentence="Engineers Conversion"
                  manualMode={false}
                  blurAmount={5.5}
                  borderColor="#EAB308"
                  glowColor="rgba(234, 179, 8, 0.6)"
                  animationDuration={0.5}
                  pauseBetweenAnimations={0.5}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-nohemi"
                  wordClassName="font-nohemi font-bold text-white"
                />
              </span>
            </h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-10" />
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-6">
              Murgii AI combines psychology, conversion insights & AI to create persuasive content that gets attention, drives action & turns ideas into growth.
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
      <section id="prompt-builder" className="py-36 sm:py-44 px-4 relative overflow-hidden">
        {/* Ambient Pure White/Glass Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 px-4">
            <h2 
              className="text-4xl md:text-7xl font-bold tracking-tight mb-5 text-white leading-[1.05] font-nohemi [text-shadow:0_4px_30px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              Your Strategy. <br className="hidden md:block" /> Built Into Every Prompt.
            </h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Create powerful, reusable prompts tailored to your business, audience, goals & voice.
            </p>
          </div>

          {/* Interactive Supporting Visual: Clean High-Contrast Glassmorphic Card */}
          <div 
            className="max-w-4xl mx-auto rounded-[28px] sm:rounded-[32px] border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.85)] p-4 sm:p-6 sm:py-6 relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)"
            }}
          >
            {/* Mode Selection Pills (Emails / Ads / Pages / Persuasion / Content) */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.2)] shrink-0">
                  <Wand2 size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight font-nohemi" style={{ fontFamily: "'Nohemi', sans-serif" }}>
                    Select Mode
                  </h4>
                </div>
              </div>

              {/* 5 Mode Selection Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-full md:w-auto">
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
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={12} strokeWidth={2.2} />
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
              {/* Primary CTA Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCraftPromptClick}
                className="px-6 py-3 rounded-xl bg-white text-black font-extrabold text-sm tracking-tight shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Build Your First Prompt →</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* UPGRADED REPLACEMENT SECTION: Clean, Honest "How Murgii Operates" 3-Step Flow & 5-Mode Capability Grid */}
      <section id="workflow" className="py-36 sm:py-44 px-4 relative overflow-hidden">
        {/* Cinematic Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-white uppercase tracking-[0.25em] mb-5 backdrop-blur-md"
            >
              <Compass size={12} className="text-white" />
              THE EXECUTION WORKFLOW
            </motion.div>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-nohemi max-w-4xl mx-auto leading-[1.15]"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              Strategy In. Better Copy Out.
            </h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mt-5" />
          </div>

          {/* Live White/Glass Linear 3-Stage Pipeline Demonstration */}
          <LinearPipelineVisual />
        </div>
      </section>

      {/* Affiliate Partner Section (Positioned Directly Above Footer) */}
      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[24px] border border-white/20 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden [box-shadow:inset_0_1px_0_rgba(255,255,255,0.15)]"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)"
            }}
          >
            {/* Subtle Ambient Backlight Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.05] rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/[0.03] rounded-full blur-[60px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header Info */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
                  <Sparkles size={12} className="text-white" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
                    Qreato partner program
                  </span>
                </div>

                <h3 
                  className="text-2xl sm:text-3xl font-bold text-white font-nohemi tracking-tight leading-tight"
                  style={{ fontFamily: "'Nohemi', sans-serif" }}
                >
                  Your Audience. Your Link. 50% Yours.
                </h3>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl">
                  Recommend murgii to people who can benefit from it & earn 50% of their first paid month when they become a customer.
                </p>
              </div>

              {/* 3 Highlight Metric Cards - Compact & Clean */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/12 flex flex-col justify-between space-y-1">
                  <span className="text-lg sm:text-xl font-bold text-white font-mono">50%</span>
                  <span className="text-[11px] text-gray-300 font-normal">First-month commission</span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/12 flex flex-col justify-between space-y-1">
                  <span className="text-lg sm:text-xl font-bold text-white font-mono">1 Link</span>
                  <span className="text-[11px] text-gray-300 font-normal">Everything tracked automatically</span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/12 flex flex-col justify-between space-y-1">
                  <span className="text-lg sm:text-xl font-bold text-white font-mono">0 Extra Dashboards</span>
                  <span className="text-[11px] text-gray-300 font-normal">Clicks, signups & earnings in Whop</span>
                </div>
              </div>

              {/* Call to Action Footer Row */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-white/90 font-nohemi">
                  Turn Your Influence Into Income
                </span>

                <a
                  href="https://whop.com/qreato/ai-leverage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5 group"
                >
                  <span>Become a Murgii Partner →</span>
                </a>
              </div>
            </div>
          </motion.div>
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
              <div className="flex items-center gap-3.5 group cursor-pointer" onClick={onStart}>
                {/* Black Logo with Clean White Background */}
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform shrink-0">
                  <QreatoLogo size={22} className="text-black" />
                </div>
                <div 
                  className="text-white text-2xl font-bold tracking-tight font-nohemi flex items-center gap-1.5"
                  style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                >
                  <span className="font-extrabold text-white">murgii</span>
                  <span className="font-extrabold text-white">AI</span>
                </div>
              </div>

              {/* High-Converting Value Statement */}
              <p className="text-gray-300 text-xs sm:text-[13px] leading-relaxed font-normal max-w-[380px] sm:max-w-[420px]">
                Murgii AI is Qreato Labs proprietary copywriting engine, trained to write emails, ads, contents & sales pages that convert. Built for creators and founders who need results, not busywork. Every generation remembers your brand, your voice & your goals.
              </p>
            </div>

            {/* CATEGORIZED FOOTER SECTIONS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-6 lg:gap-8 flex-1 w-full">
              {/* 1. COMPANY */}
              <div className="space-y-4">
                <h4 
                  className="text-xs font-bold text-white uppercase tracking-[0.2em] font-nohemi"
                  style={{ fontFamily: "'Nohemi', sans-serif" }}
                >
                  Company
                </h4>
                <ul className="space-y-2.5">
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
                        className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                        style={{ fontFamily: "'Nohemi', sans-serif" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. LEGAL */}
              <div className="space-y-4">
                <h4 
                  className="text-xs font-bold text-white uppercase tracking-[0.2em] font-nohemi"
                  style={{ fontFamily: "'Nohemi', sans-serif" }}
                >
                  Legal
                </h4>
                <ul className="space-y-2.5">
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
                        className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                        style={{ fontFamily: "'Nohemi', sans-serif" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. PRODUCT */}
              <div className="space-y-4">
                <h4 
                  className="text-xs font-bold text-white uppercase tracking-[0.2em] font-nohemi"
                  style={{ fontFamily: "'Nohemi', sans-serif" }}
                >
                  Product
                </h4>
                <ul className="space-y-2.5">
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
                      className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                      style={{ fontFamily: "'Nohemi', sans-serif" }}
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
                      className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                      style={{ fontFamily: "'Nohemi', sans-serif" }}
                    >
                      Affiliates
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={onStart}
                      className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                      style={{ fontFamily: "'Nohemi', sans-serif" }}
                    >
                      Internal Tools
                    </button>
                  </li>
                </ul>
              </div>

              {/* 4. RESOURCES */}
              <div className="space-y-4">
                <h4 
                  className="text-xs font-bold text-white uppercase tracking-[0.2em] font-nohemi"
                  style={{ fontFamily: "'Nohemi', sans-serif" }}
                >
                  Resources
                </h4>
                <ul className="space-y-2.5">
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
                        className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                        style={{ fontFamily: "'Nohemi', sans-serif" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. COMMUNITY */}
              <div className="space-y-4">
                <h4 
                  className="text-xs font-bold text-white uppercase tracking-[0.2em] font-nohemi"
                  style={{ fontFamily: "'Nohemi', sans-serif" }}
                >
                  Community
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <a
                      href="https://www.instagram.com/qreato.io?igsh=MTlmNHN6ampqYWF3bQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi flex items-center gap-2"
                      style={{ fontFamily: "'Nohemi', sans-serif" }}
                    >
                      <span>Instagram</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/s4lma9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi flex items-center gap-2"
                      style={{ fontFamily: "'Nohemi', sans-serif" }}
                    >
                      <span>X</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://whop.com/qreato/ai-leverage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi flex items-center gap-2"
                      style={{ fontFamily: "'Nohemi', sans-serif" }}
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
              className="text-[11px] sm:text-xs font-nohemi text-white/70 uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Nohemi', sans-serif" }}
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
           <motion.span 
             animate={{ opacity: [0.6, 1, 0.6] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="text-5xl md:text-8xl font-black text-white/90 tracking-tighter select-none will-change-opacity font-nohemi [text-shadow:0_4px_25px_rgba(0,0,0,0.8)]"
             style={{ fontFamily: "'Nohemi', sans-serif" }}
           >
             0{index}
           </motion.span>
           <div className="w-16 h-[1px] bg-gradient-to-r from-white/40 via-white/20 to-transparent" />
        </div>
        <h3 
          className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white font-nohemi"
          style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          {title}
        </h3>
        <div className="space-y-4">
          {typeof description === "string" ? (
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">{description}</p>
          ) : (
            description
          )}
          {trustLine && (
            <div className="relative inline-flex items-center overflow-hidden rounded-xl bg-white/[0.04] border border-white/15 px-4 py-2.5 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
              <span className="text-xs sm:text-sm font-mono tracking-wider font-extrabold text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                {trustLine}
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
              />
            </div>
          )}
        </div>
        <div className="space-y-3.5 pt-2">
           {points.map((p, i) => (
             <div key={i} className="flex items-start gap-3.5 group">
               <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 group-hover:scale-150 group-hover:shadow-[0_0_10px_#ffffff] transition-all shrink-0" />
               <span className="text-sm md:text-base font-medium text-gray-300 group-hover:text-white transition-colors leading-relaxed">{p}</span>
             </div>
           ))}
        </div>
      </motion.div>

      {visual && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="flex-1 w-full relative group cursor-crosshair"
        >
          <div 
            className="w-full rounded-[30px] sm:rounded-[36px] bg-[#0c0d12] border border-white/20 overflow-hidden group-hover:border-white/35 transition-all duration-500 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] p-3 sm:p-4 relative"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
             <div className="relative w-full flex items-center justify-center">
               {visual}
             </div>
          </div>
          
          {/* Floating Ambient Accents */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.03] rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/[0.03] rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
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
    <section id="faq" className="py-24 sm:py-32 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-nohemi leading-tight"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            Before You Go — The Questions Everyone Asks
          </h2>
          <div className="w-24 h-[1px] bg-zinc-800 mx-auto mt-6" />
        </div>

        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-[#0D0B14] border border-zinc-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <span className="text-base sm:text-lg font-bold text-white group-hover:text-zinc-200 transition-colors font-nohemi">
                    {item.q}
                  </span>
                  <div 
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal border-t border-zinc-800/60 pt-4">
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
        <div className="mt-12 text-center">
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer group"
          >
            <span>See Your Copy Score</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
