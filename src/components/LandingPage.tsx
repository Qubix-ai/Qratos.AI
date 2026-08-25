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
  Database,
  Menu,
  CreditCard,
  User as UserIcon,
} from "lucide-react";
import { QreatoLogo } from "./QreatoLogo";
import { AuthModal } from "./AuthModal";
import { OutcomeNetworkDiagram } from "./OutcomeNetworkDiagram";
import { Murgii3DChicken } from "./Murgii3DChicken";
import { TrueFocus } from "./TrueFocus";
import { ShinyText } from "./ShinyText";
import {
  ModesCycleVisual,
  PromptCompilerVisual,
  TierExpansionVisual,
  BoltEcosystemVisual,
  LinearPipelineVisual
} from "./FeatureVisuals";

interface LandingPageProps {
  user?: any;
  userData?: any;
  onStart: () => void;
  onLogin?: () => void;
  onOpenBolt?: () => void;
  onNavigate?: (view: string) => void;
  userTier?: "free" | "core" | "max";
}

export function LandingPage({ user, userData, onStart, onLogin, onOpenBolt, onNavigate, userTier }: LandingPageProps) {
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
    if (effectiveTier === "free" && !user) {
      handleSignupClick();
    } else if (effectiveTier === "free") {
      setInfoModal({
        title: "Prompt Builder (Core & Max Tier)",
        content: "Prompt Builder is unlocked on Bolt Core ($29/mo) and Max ($97/mo). It transforms guided questions into structured, role-framed master prompts engineered specifically for Murgii's direct-response engine."
      });
    } else {
      if (onNavigate) {
        onNavigate("prompt-builder");
      } else {
        onStart();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#07060B] text-white selection:bg-[#8B5CF6]/40 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Ambience / Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18)_0%,transparent_70%)] blur-[90px]" />
        <div className="absolute top-[28%] -left-48 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,70,239,0.08)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-[65%] -right-48 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)] blur-[120px]" />
      </div>

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
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#prompt-builder" className="hover:text-white transition-colors">Prompt Builder</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
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
            <Murgii3DChicken size="lg" interactive={true} showPedestal={true} showHologram={true} />
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
              <span className="block whitespace-nowrap">
                <ShinyText
                  text="Your only unfair"
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
              </span>
              <span className="block whitespace-nowrap">
                <ShinyText
                  text="COPYWRITING advantage"
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
              </span>
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
            The AI copywriting engine that turns any brief into hooks, emails, and sales pages that convert — built for founders and creators who need results, not busywork.
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
              <span className="font-bold text-white tracking-tight">Start Writing with Murgii Free</span>
              <ArrowRight size={20} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Built for Every Outcome That Matters - Hub and Spoke Architecture */}
      <section className="py-28 sm:py-36 relative overflow-hidden contain-paint">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#8B5CF6]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 sm:mb-20 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 text-[10px] sm:text-xs font-mono text-[#D946EF] uppercase tracking-[0.2em] mb-4"
            >
              <Sparkles size={11} className="text-[#E879F9]" />
              <span>Unified Intelligence Ecosystem</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 text-white font-nohemi"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              Built for every outcome <br className="hidden sm:block" />
              <span>that <span className="text-[#FFBE0B]">matters</span></span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
            >
              A single persuasion engine connecting your brand voice to high-converting creative across every critical touchpoint.
            </motion.p>
            
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] via-[#D946EF] to-transparent shadow-[0_0_15px_rgba(139,92,246,0.6)] mt-8" />
          </div>

          {/* Animated Hub and Spoke Network Diagram with White Glassmorphic Badges */}
          <div className="flex justify-center items-center">
            <OutcomeNetworkDiagram />
          </div>
        </div>
      </section>

      {/* How Murgii AI Engineers Conversion Section */}
      <section id="how-it-works" className="py-36 sm:py-44 px-4 relative overflow-hidden">
        {/* Cinematic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#8B5CF6]/8 rounded-full blur-[180px] pointer-events-none" />
        
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
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] via-[#D946EF] to-transparent mx-auto mb-10 shadow-[0_0_20px_#8B5CF6]" />
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-6">
              Murgii AI combines behavioral psychology, conversion intelligence, and strategic AI systems to generate persuasive assets engineered for measurable business growth.
            </p>
          </div>

          <div id="features" className="space-y-36 sm:space-y-44">
            {/* BLOCK 1: 4 Core Modes & Persistent Brand Memory */}
            <FeatureBlock 
              index={1}
              title="4 Dedicated Modes Powered by Persistent Memory"
              description="Stop re-explaining your product to generic AI every morning. Set your business niche, target audience, and brand voice once in Memory & Personalization — then generate high-converting Email sequences, punchy Ad hooks, full Sales Pages, and deep Behavioral Psychology assets that instantly sound like you."
              trustLine="Memory & Personalization applies automatically across all 4 modes on every generation."
              points={[
                "Emails Mode: Multi-email onboarding, launch, & abandoned cart sequences",
                "Ads Mode: Pattern-interrupt hooks, scroll-stoppers, & direct angles",
                "Pages Mode: High-converting landing pages, VSLs, & sales copy",
                "Psych Mode: Cialdini triggers, loss-aversion frames, & objection crushers",
                "Zero Context Switching: Your name, tone, and offer stay locked forever"
              ]}
              visual={<ModesCycleVisual />}
            />

            {/* BLOCK 2: Guided Prompt Builder Advantage */}
            <FeatureBlock 
              index={2}
              reversed
              title="Guided Prompt Architecture That Beats Generic AI"
              description="One-line prompts produce shallow, robotic fluff you have to rewrite from scratch. Murgii's Prompt Builder (unlocked on Core & Max) compiles guided inputs — niche, conversion vector, tone, and offer mechanics — into role-framed master prompts so your generation hits peak persuasion on draft one."
              trustLine="Replaces hours of prompt tweaking with a 60-second guided architecture."
              points={[
                "Role-Framed Master Prompts: Pre-loaded with direct response methodology",
                "Targeted Conversion Vectors: Aligned to specific buying temperatures",
                "Reusable Master Blueprints: Store high-performing prompt frameworks",
                "1-Click Workspace Sync: Send engineered prompts straight into generation",
                "Available on Core & Max: Stop settling for generic chatbot answers"
              ]}
              visual={<PromptCompilerVisual />}
            />

            {/* BLOCK 3: Tiered Daily Credits Engineered for Scaling */}
            <FeatureBlock 
              index={3}
              title="Daily Credit Engine Built for Sustainable Volume"
              description="Start with 20 daily credits on Basic to test all 4 modes with zero risk. When client deadlines and launch schedules hit, scale to Core ($29/mo) for 40 daily credits + full Prompt Builder access, or command Max ($97/mo) with 100 daily credits, AI Blueprint Assist, and priority generation bandwidth."
              trustLine="Credits refresh every 24 hours so you never face unexpected overage bills."
              points={[
                "Basic (Free): 20 credits/day across all 4 modes to write daily assets",
                "Core ($29/mo): 40 credits/day + unlocked Prompt Builder & Core roadmap",
                "Max ($97/mo): 100 credits/day + Business Blueprint Studio & Qreato Engine",
                "No Token Traps: Predictable daily quotas built for agency & founder volume",
                "Instant Tier Switching: Upgrade in seconds as your publishing demands scale"
              ]}
              visual={<TierExpansionVisual />}
            />

            {/* BLOCK 4: Full Bolt Max Ecosystem & Business Blueprint Studio */}
            <FeatureBlock 
              index={4}
              reversed
              title="Complete Revenue Infrastructure with Bolt & Blueprint Studio"
              description="Copy is only one half of the growth equation. Max tier pairs Murgii's 100 daily credits with Bolt Max's 6-category execution roadmap, Business Blueprint Studio, and AI Blueprint Assist — connecting your sales copy directly to product offers, audience growth, and full-funnel monetization."
              trustLine="The complete unified operating system for high-performing modern operators."
              points={[
                "Bolt Core & Max Integration: 6-category structured execution roadmap",
                "Business Blueprint Studio: Map entire offer architectures before writing",
                "AI Blueprint Assist: Automatic structure recommendations for campaigns",
                "Qreato AI Engine: Dedicated enterprise-grade model routing",
                "All-In-One Leverage: From raw concept to deployed revenue system"
              ]}
              visual={<BoltEcosystemVisual />}
            />
          </div>
        </div>
      </section>

      {/* PROMPT BUILDER ARCHITECTURE SECTION */}
      <section id="prompt-builder" className="py-32 px-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D946EF]/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header (Redundant badge removed for clean, frictionless entry) */}
          <div className="text-center mb-16 px-4">
            <h2 
              className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent leading-[1.05] font-nohemi"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              Build Custom Prompts, <br className="hidden md:block" /> Engineered for You
            </h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] via-[#D946EF] to-transparent mx-auto mb-8 shadow-[0_0_20px_#8B5CF6]" />
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Generic one-line prompting forces you into tedious re-prompting loops. Murgii&apos;s Prompt Builder assembles tailored, role-framed master prompts from guided questions — giving you structured persuasion on draft one.
            </p>
          </div>

          {/* Interactive Supporting Visual: Clean High-Contrast Glassmorphic Card */}
          <div 
            className="max-w-5xl mx-auto rounded-[36px] border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-6 sm:p-10 relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)"
            }}
          >
            {/* 3-Step Simple Flow Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-6 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">1</span>
                <span className="text-xs text-gray-300 font-medium">Select Archetype & Niche</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">2</span>
                <span className="text-xs text-gray-300 font-medium">Murgii Compiles Role Frame</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center text-xs font-mono font-bold shrink-0">3</span>
                <span className="text-xs text-white font-bold">Ready-to-Use Master Prompt</span>
              </div>
            </div>

            {/* Mode Selection Pills (Simple Universal Labels: Emails / Ads / Pages / Psych) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] shrink-0">
                  <Wand2 size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight font-nohemi" style={{ fontFamily: "'Nohemi', sans-serif" }}>
                    Select Archetype
                  </h4>
                  <p className="text-[11px] text-gray-400">See how guided parameters compile instantly</p>
                </div>
              </div>

              {/* Plain 4 Mode Selection Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 overflow-x-auto max-w-full">
                {[
                  { id: "email", label: "Emails", icon: Mail },
                  { id: "ads", label: "Ads", icon: Target },
                  { id: "landing", label: "Pages", icon: Globe },
                  { id: "psych", label: "Psych", icon: Zap }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeDemoMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveDemoMode(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={14} strokeWidth={2.2} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2-Column Guided Inputs vs Role-Framed Output Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-stretch">
              {/* Left Column: 2 Simplified Guided Questions */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold">
                      01. Quick Inputs
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check size={12} /> Configured
                    </span>
                  </div>

                  {/* Field 1: Target Niche */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">Target Niche & Audience</label>
                    <div className="text-xs font-semibold text-white">
                      <span>{activeDemoMode === "email" ? "B2B SaaS & High-Ticket Consultants" : activeDemoMode === "ads" ? "Direct-to-Consumer Fitness & Wellness" : activeDemoMode === "landing" ? "Enterprise AI Developer Platform" : "High-Ticket Course Buyers & Founders"}</span>
                    </div>
                  </div>

                  {/* Field 2: Primary Goal */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">Primary Conversion Goal</label>
                    <div className="text-xs font-semibold text-white">
                      <span>{activeDemoMode === "email" ? "Drive urgency for demo bookings before launch" : activeDemoMode === "ads" ? "Break through ad fatigue with pattern-interrupt hooks" : activeDemoMode === "landing" ? "Convert cold traffic with proof & risk reversal" : "Overcome deep buying friction with cognitive reframing"}</span>
                    </div>
                  </div>
                </div>

                {/* Honest confident compiler statement */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                  <Sparkles size={16} className="text-white shrink-0" />
                  <p className="text-xs text-gray-300 font-medium leading-relaxed">
                    Compiled automatically into a structured, role-framed master prompt built for Murgii&apos;s generation engine.
                  </p>
                </div>
              </div>

              {/* Right Column: Compiled Master Prompt Output Preview */}
              <div className="lg:col-span-7 flex flex-col rounded-2xl bg-black/70 border border-white/15 p-5 sm:p-6 relative font-mono text-xs overflow-hidden shadow-inner">
                {/* Code Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white/60" />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 ml-2">master_prompt_output.md</span>
                  </div>
                  <span className="text-[9px] font-mono text-white bg-white/15 px-2 py-0.5 rounded border border-white/25 uppercase tracking-widest font-bold">
                    COMPILED MASTER PROMPT
                  </span>
                </div>

                {/* Formatted Master Prompt Output */}
                <div className="flex-1 space-y-3 text-gray-300 leading-relaxed overflow-hidden">
                  <div>
                    <span className="text-white font-bold">[ROLE & FRAME]</span>
                    <p className="text-gray-200 mt-1 font-sans text-xs">
                      Act as an elite Direct Response Copywriter specializing in {activeDemoMode === "email" ? "high-converting email sequencing" : activeDemoMode === "ads" ? "viral paid performance advertising" : activeDemoMode === "landing" ? "high-ticket landing page funnels" : "behavioral persuasion engineering"}.
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-300 font-bold">[TARGET MARKET & PAIN VECTOR]</span>
                    <p className="text-gray-200 mt-1 font-sans text-xs">
                      Audience: {activeDemoMode === "email" ? "B2B SaaS executives and agency operators facing pipeline drop-offs" : activeDemoMode === "ads" ? "High-intent consumers scrolling through congested feeds" : activeDemoMode === "landing" ? "Enterprise decision-makers needing immediate ROI validation" : "Skeptical high-ticket prospects requiring proof mechanisms"}.
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-300 font-bold">[DELIVERABLE BLUEPRINT]</span>
                    <p className="text-gray-200 mt-1 font-sans text-xs">
                      Generate 3 pattern-interrupt hook variants, core persuasion loops, objection-reversal stack, and high-impact CTA.
                    </p>
                  </div>
                </div>

                {/* Output Footnote */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Structured Architecture</span>
                  <span className="text-white font-semibold">Ready for 1-Click Generation</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA Area: Value Contrast & Desirability */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-left space-y-1">
                <h5 className="text-sm font-bold text-white font-nohemi" style={{ fontFamily: "'Nohemi', sans-serif" }}>
                  Stop Wasting Hours Rewriting AI Prompts
                </h5>
                <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
                  Unlocked on Bolt Core and Max tiers. Get structured, role-framed master prompts synced directly to your generation workspace.
                </p>
              </div>

              {/* Primary CTA Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCraftPromptClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-sm tracking-tight shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-gray-100 transition-all flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
              >
                <Wand2 size={16} />
                <span>Craft Your First Prompt</span>
                <ArrowRight size={15} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* UPGRADED REPLACEMENT SECTION: Clean, Honest "How Murgii Operates" 3-Step Flow & 4-Mode Capability Grid */}
      <section id="workflow" className="py-32 px-4 relative overflow-hidden">
        {/* Cinematic Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-white uppercase tracking-[0.25em] mb-6 backdrop-blur-md"
            >
              <Compass size={12} className="text-white" />
              THE EXECUTION WORKFLOW
            </motion.div>
            <h2 
              className="text-4xl md:text-7xl font-bold tracking-tight mb-6 text-white font-nohemi"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              From Brief to Market-Ready Copy <br className="hidden md:block" /> in 3 Honest Steps
            </h2>
            <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-8" />
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              No complex prompt engineering tricks. Murgii connects your brand voice and offer context directly to high-converting assets in seconds.
            </p>
          </div>

          {/* Live White/Glass Linear 3-Stage Pipeline Demonstration */}
          <LinearPipelineVisual />

          {/* 3-Step Visual Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {[
              {
                step: "01",
                title: "Define Brief & Lock Memory",
                desc: "Choose from Emails, Ads, Pages, or Psych. Your saved Memory (niche, brand tone, and offer details) loads automatically so you never start from zero context.",
                icon: Sliders,
                badge: "Memory-Linked"
              },
              {
                step: "02",
                title: "Engineered Generation",
                desc: "Murgii synthesizes role-framing, proven direct-response formulas, and objection-reversal loops to produce high-impact copy variants tailored to your goal.",
                icon: Sparkles,
                badge: "Psych-Optimized"
              },
              {
                step: "03",
                title: "Polish & Ship to Market",
                desc: "Review multiple hook angles, fine-tune copy with 1-click refinement tools, and copy directly to your email platform, ad manager, or landing page builder.",
                icon: Send,
                badge: "Conversion-Ready"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="relative rounded-3xl p-8 border border-white/15 flex flex-col justify-between group transition-all duration-300 hover:border-white/40"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)"
                }}
              >
                <div className="space-y-6">
                  {/* Top Step Pill & Icon */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(12px)"
                      }}
                    >
                      <card.icon size={22} className="text-white" />
                    </div>
                    <span 
                      className="text-3xl font-extrabold text-white/30 group-hover:text-white/60 transition-colors font-nohemi"
                      style={{ fontFamily: "'Nohemi', sans-serif" }}
                    >
                      {card.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2.5">
                    <h3 
                      className="text-xl font-bold text-white font-nohemi"
                      style={{ fontFamily: "'Nohemi', sans-serif" }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{card.badge}</span>
                  <ArrowRight size={14} className="text-white/60 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 4 Core Persuasion Engines Capability Strip */}
          <div 
            className="rounded-3xl border border-white/15 p-8 sm:p-10 shadow-2xl relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)"
            }}
          >
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 
                className="text-2xl sm:text-3xl font-bold text-white font-nohemi mb-3"
                style={{ fontFamily: "'Nohemi', sans-serif" }}
              >
                4 Specialized Modes. One Unified Workspace.
              </h3>
              <p className="text-gray-400 text-sm">
                Each mode is calibrated with dedicated cognitive prompts, deliverables, and structural outputs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Emails Mode", role: "Multi-Email Sequences", desc: "Nurture sequences, flash sale blasts, cold outbound, and re-engagement drips.", icon: Mail },
                { name: "Ads Mode", role: "Hooks & Performance Copy", desc: "Pattern interrupts, problem-agitate angles, direct-response video scripts.", icon: Target },
                { name: "Pages Mode", role: "Sales & Landing Copy", desc: "High-converting hero sections, proof stacks, pricing tables, and CTA blocks.", icon: Globe },
                { name: "Psych Mode", role: "Behavioral Biases", desc: "Loss-aversion frames, Cialdini triggers, cognitive friction removal.", icon: Zap }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="p-5 rounded-2xl border border-white/10 hover:border-white/25 transition-all space-y-3"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)"
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <item.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-nohemi" style={{ fontFamily: "'Nohemi', sans-serif" }}>
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#E879F9] uppercase tracking-wider block mt-0.5">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              <p className="text-white text-xs sm:text-[13.5px] leading-relaxed font-normal max-w-[360px] sm:max-w-[390px] [text-wrap:pretty]">
                Write <span className="text-[#FFBE0B] font-bold">sharper</span> emails, ads, sales pages & psychologically persuasive copy all powered by AI that remembers your <span className="text-[#FFBE0B] font-bold">business, brand voice & goals</span>.
              </p>
            </div>

            {/* CATEGORIZED FOOTER SECTIONS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 xl:gap-12 w-full xl:w-auto">
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
                    { label: "Media", desc: "Press inquiries, brand assets, and media releases for Murgii AI & Qreato Labs." },
                    { label: "Enterprise", desc: "Custom AI deployment, bespoke compliance, and tailored SLAs for enterprise teams." },
                    { label: "Security", desc: "End-to-end data encryption, private token routing, and rigorous isolation controls." },
                    { label: "Trust Centre", desc: "Live uptime status, data privacy commitments, and subprocessor transparency." }
                  ].map((item, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setInfoModal({ title: item.label, content: item.desc })}
                        className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                        style={{ fontFamily: "'Nohemi', sans-serif" }}
                      >
                        {item.label}
                      </button>
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
                    { label: "Terms of Service", desc: "Terms governing use of Murgii AI services, software, and APIs by Qreato Labs." },
                    { label: "Privacy Policy", desc: "How we securely handle, protect, and process user workspace information." },
                    { label: "Refund Policy", desc: "Subscription billing, refund qualifications, and cancellation procedures." },
                    { label: "Platform Rules", desc: "Guidelines ensuring safe, responsible, and compliant copy generation across channels." },
                    { label: "General Rules", desc: "Standards for acceptable platform behavior, account sharing, and workspace quotas." }
                  ].map((item, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setInfoModal({ title: item.label, content: item.desc })}
                        className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                        style={{ fontFamily: "'Nohemi', sans-serif" }}
                      >
                        {item.label}
                      </button>
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
                        const pricingEl = document.getElementById("pricing") || document.querySelector("section:has(.MVPPriceCard)");
                        if (pricingEl) {
                          pricingEl.scrollIntoView({ behavior: "smooth" });
                        } else if (onNavigate) {
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
                      href="https://whop.com/qreato/ai-leverage"
                      target="_blank"
                      rel="noopener noreferrer"
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
                    { label: "Learn", desc: "Tutorials on persuasion psychology, conversion copy models, and prompt engineering." },
                    { label: "Guides", desc: "Step-by-step master blueprints for scaling cold emails, video ad scripts, and sales pages." },
                    { label: "Support", desc: "24/7 dedicated assistance via our priority community desk and direct engineer support." },
                    { label: "Reviews", desc: "Verified testimonials from founders and agencies generating scalable copy revenue." }
                  ].map((item, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setInfoModal({ title: item.label, content: item.desc })}
                        className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer text-left font-nohemi block"
                        style={{ fontFamily: "'Nohemi', sans-serif" }}
                      >
                        {item.label}
                      </button>
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
  title: string;
  description: string;
  trustLine?: string;
  points: string[];
  visual: React.ReactNode;
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
    <div className={`flex flex-col lg:flex-row items-center gap-16 md:gap-32 ${reversed ? 'lg:flex-row-reverse' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 space-y-8"
      >
        <div className="inline-flex items-center gap-4">
           <motion.span 
             animate={{ opacity: [0.6, 1, 0.6] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="text-5xl md:text-8xl font-black bg-gradient-to-br from-white via-white/80 to-white/20 bg-clip-text text-transparent tracking-tighter select-none will-change-opacity font-nohemi"
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
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">{description}</p>
          {trustLine && (
            <p className="text-white/70 text-xs font-mono tracking-wider uppercase font-bold">{trustLine}</p>
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

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex-1 w-full aspect-square md:aspect-auto md:h-[540px] relative group cursor-crosshair"
      >
        <div 
          className="absolute inset-0 rounded-[48px] bg-white/[0.03] border border-white/15 backdrop-blur-xl overflow-hidden group-hover:border-white/30 transition-all duration-700 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]"
          style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        >
           <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
           <div className="relative w-full h-full flex items-center justify-center p-4" style={{ transform: "translateZ(80px)" }}>
             {visual}
           </div>
        </div>
        
        {/* Floating Ambient Accents */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.03] rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/[0.03] rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </motion.div>
    </div>
  );
}
