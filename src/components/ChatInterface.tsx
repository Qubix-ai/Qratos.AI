import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Coins, 
  Mail, 
  Target, 
  FileText, 
  Zap, 
  X, 
  ArrowUp, 
  LayoutDashboard, 
  Menu, 
  Copy, 
  Check, 
  User as UserIcon, 
  LogOut, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import ReactMarkdown from "react-markdown";
import { Murgii3DChicken } from "./Murgii3DChicken";
import { AIProcessingTelemetry } from "./AIProcessingTelemetry";
import { QreatoLogo } from "./QreatoLogo";
import { FloatingIridescentBlobs } from "./FloatingIridescentBlobs";
import FloatingLines from "./FloatingLines";
import { 
  callMurgiiGenerateEdgeFunction, 
  DailyLimitError, 
  MurgiiMode, 
  supabase 
} from "../lib/supabase";
import { 
  saveSession, 
  getSessionById, 
  generateTitleFromMessage, 
  ChatSession 
} from "../lib/chatHistory";

// SECTION THREE — 3D CARD SYSTEM WITH MOUSE TRACKING & FROSTED GLASS
const Card3D = ({ children, delay = 0, isSelected = false, onClick }: { children: React.ReactNode, delay?: number, isSelected?: boolean, onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((touch.clientX - centerX) * 0.5);
    y.set((touch.clientY - centerY) * 0.5);
  };

  const handleTouchEnd = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: isSelected ? 1.02 : 1,
        borderColor: isSelected ? "rgba(217, 70, 239, 0.6)" : "rgba(255, 255, 255, 0.10)",
      }}
      transition={{ 
        duration: 0.6, 
        delay: delay, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`card-3d cursor-pointer ${isSelected ? 'ring-1 ring-[#D946EF]/50 shadow-[0_0_30px_rgba(139,92,246,0.35)]' : ''}`}
    >
      {children}
      
      {/* Floating inner layer for 3D depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
        transform: 'translateZ(20px)',
        pointerEvents: 'none',
      }} />
    </motion.div>
  );
};

// SECTION EIGHT — LOADING ANIMATION WITH IRIDESCENT SHIMMER
const LoadingBubble = () => (
  <motion.div
    className="ai-bubble ml-0 mr-auto self-start mt-2 relative overflow-hidden"
    initial={{ opacity: 0, y: 16, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
  >
    {/* Iridescent shimmer sweep across loading card */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8B5CF6]/15 via-[#D946EF]/20 to-transparent animate-[shimmerSweep_2s_infinite] pointer-events-none" />

    <div className="loading-dots relative z-10">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="loading-dot"
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
    <span className="loading-label relative z-10">SYNTHESIZING PERSUASION NEURONS...</span>
  </motion.div>
);

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isNew?: boolean;
  isDailyLimit?: boolean;
}

// TYPEWRITER ANIMATION FOR PREMIUM CHAT REVEAL WITH PURPLE-MAGENTA CURSOR
const TypewriterMarkdown = ({ content, isNew }: { content: string; isNew?: boolean }) => {
  const [displayedContent, setDisplayedContent] = useState(isNew ? "" : content);
  const [isTyping, setIsTyping] = useState(isNew);

  useEffect(() => {
    if (!isNew) {
      setDisplayedContent(content);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    let index = 0;
    const speed = Math.max(4, Math.min(16, Math.round(2000 / (content.length || 1))));
    
    const intervalId = setInterval(() => {
      setDisplayedContent(() => {
        const nextPart = content.slice(0, index + 1);
        index++;
        if (index >= content.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
        return nextPart;
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [content, isNew]);

  return (
    <div className="relative inline-block w-full">
      <ReactMarkdown>{displayedContent}</ReactMarkdown>
      {isTyping && (
        <span 
          className="inline-block w-1.5 h-3.5 bg-gradient-to-b from-[#8B5CF6] to-[#D946EF] ml-1 animate-pulse rounded-sm shadow-[0_0_8px_#D946EF]" 
          style={{ verticalAlign: 'middle', marginTop: '-2px' }} 
        />
      )}
    </div>
  );
};

interface ChatInterfaceProps {
  user: any;
  userData?: any;
  activeTab?: string;
  activeSessionId?: string;
  pendingPrompt?: { text: string; mode: MurgiiMode; autoSubmit?: boolean } | null;
  remainingCredits?: number | null;
  onRemainingCreditsChange?: (credits: number) => void;
  onClearPendingPrompt?: () => void;
  onSessionChange?: (id: string) => void;
  onMenuToggle?: () => void;
  onGoHome?: () => void;
  onGoToPricing?: () => void;
  onGoToAccount?: () => void;
  onLogout?: () => void;
}

export function ChatInterface({ 
  user, 
  userData, 
  activeTab, 
  activeSessionId, 
  pendingPrompt,
  remainingCredits: propCredits,
  onRemainingCreditsChange,
  onClearPendingPrompt,
  onSessionChange, 
  onMenuToggle, 
  onGoHome,
  onGoToPricing,
  onGoToAccount,
  onLogout 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMode, setSelectedMode] = useState<MurgiiMode>("email");
  const [activeSelectedTile, setActiveSelectedTile] = useState<MurgiiMode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(propCredits ?? null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [dailyLimitMessage, setDailyLimitMessage] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [animatedWordIndex, setAnimatedWordIndex] = useState(0);

  const ANIMATED_WORDS = ["ignore", "forget", "resist"];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedWordIndex((prev) => (prev + 1) % ANIMATED_WORDS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (propCredits !== undefined && propCredits !== null) {
      setRemainingCredits(propCredits);
    }
  }, [propCredits]);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const currentSessionIdRef = useRef<string | undefined>(activeSessionId);
  const userId = user?.id || user?.uid || "";

  // Synchronize active session ID and load saved chat messages
  useEffect(() => {
    currentSessionIdRef.current = activeSessionId;
    if (activeSessionId && userId) {
      getSessionById(userId, activeSessionId).then((session) => {
        if (session && Array.isArray(session.messages)) {
          setMessages(session.messages);
        } else {
          setMessages([]);
        }
      });
    } else if (!activeSessionId) {
      setMessages([]);
    }
  }, [activeSessionId, userId]);

  // Close account menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async (text: string, id: string | number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const detectMode = (text: string, currentSelectedMode: MurgiiMode): MurgiiMode => {
    const lower = text.toLowerCase();
    if (lower.startsWith('create 5 scroll-stopping') || lower.startsWith('generate 10 viral') || lower.startsWith('brief me on ads') || lower.includes('facebook ad') || lower.includes('ig ad')) {
      return 'ads';
    }
    if (lower.startsWith('architect a long-form') || lower.startsWith('brief me on sales') || lower.startsWith('brief me on pages') || lower.includes('landing page')) {
      return 'landing';
    }
    if (lower.startsWith('brief me on behavioral') || lower.startsWith('brief me on psych') || lower.includes('psychological') || lower.includes('behavioral trigger')) {
      return 'psych';
    }
    if (lower.startsWith('create a high-converting email') || lower.startsWith('brief me on email') || lower.includes('email sequence')) {
      return 'email';
    }
    return currentSelectedMode;
  };

  const executePrompt = async (rawText: string, modeToUse?: MurgiiMode) => {
    const text = rawText.trim();
    if (!text || isLoading || dailyLimitReached) return;

    const targetMode = modeToUse || detectMode(text, selectedMode);
    setSelectedMode(targetMode);

    // Determine target session ID or generate new session
    let targetSessionId = currentSessionIdRef.current;
    if (!targetSessionId) {
      targetSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      currentSessionIdRef.current = targetSessionId;
      onSessionChange?.(targetSessionId);
    }

    // User message
    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const updatedWithUser = [...messages, userMessage];
    setMessages(updatedWithUser);
    setInputValue('');
    setIsLoading(true);

    // Save intermediate session with user message
    if (userId) {
      const existing = await getSessionById(userId, targetSessionId);
      const title = existing?.title || generateTitleFromMessage(text);
      await saveSession(userId, {
        id: targetSessionId,
        userId,
        title,
        isPinned: existing?.isPinned || false,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: updatedWithUser,
      });
    }

    try {
      // Call the secure Supabase Edge Function
      const result = await callMurgiiGenerateEdgeFunction(targetMode, text);

      // Update remaining count if provided
      if (typeof result.remaining === 'number') {
        setRemainingCredits(result.remaining);
        onRemainingCreditsChange?.(result.remaining);
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
        isNew: true
      };

      const finalMessages = [...updatedWithUser, aiMessage];
      setMessages(finalMessages);

      if (userId && targetSessionId) {
        const existing = await getSessionById(userId, targetSessionId);
        const title = existing?.title || generateTitleFromMessage(text);
        await saveSession(userId, {
          id: targetSessionId,
          userId,
          title,
          isPinned: existing?.isPinned || false,
          createdAt: existing?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: finalMessages,
        });
      }
    } catch (err: any) {
      console.error("Murgii Generation Error:", err);
      
      let finalMessages = updatedWithUser;
      if (err instanceof DailyLimitError || err?.name === "DailyLimitError") {
        setDailyLimitReached(true);
        setDailyLimitMessage(err.message);
        if (typeof err.remaining === 'number') {
          setRemainingCredits(err.remaining);
          onRemainingCreditsChange?.(err.remaining);
        }

        const limitNotice: Message = {
          role: 'assistant',
          content: `### 🛑 Daily Limit Reached\n\n${err.message}\n\nTo continue generating high-converting copy without interruption, upgrade your workspace plan:\n\n[**Upgrade Your Plan on Whop →**](https://whop.com/qreato/ai-leverage)`,
          timestamp: new Date().toISOString(),
          isDailyLimit: true
        };
        finalMessages = [...updatedWithUser, limitNotice];
        setMessages(finalMessages);
      } else {
        const safeErrorMessage: Message = {
          role: 'assistant',
          content: "Something went wrong generating this — please try again in a moment.",
          timestamp: new Date().toISOString()
        };
        finalMessages = [...updatedWithUser, safeErrorMessage];
        setMessages(finalMessages);
      }

      if (userId && targetSessionId) {
        const existing = await getSessionById(userId, targetSessionId);
        const title = existing?.title || generateTitleFromMessage(text);
        await saveSession(userId, {
          id: targetSessionId,
          userId,
          title,
          isPinned: existing?.isPinned || false,
          createdAt: existing?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: finalMessages,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle incoming pendingPrompt from PromptBuilder
  useEffect(() => {
    if (pendingPrompt && pendingPrompt.text) {
      if (pendingPrompt.mode) {
        setSelectedMode(pendingPrompt.mode);
        setActiveSelectedTile(pendingPrompt.mode);
      }
      if (pendingPrompt.autoSubmit) {
        executePrompt(pendingPrompt.text, pendingPrompt.mode);
      } else {
        setInputValue(pendingPrompt.text);
      }
      onClearPendingPrompt?.();
    }
  }, [pendingPrompt]);

  const handleSend = async () => {
    await executePrompt(inputValue, selectedMode);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden font-sans h-full min-h-0 bg-transparent">
      {/* Background Floating Lines Experience (Transferred from Landing Page with soft opacity) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingLines 
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={4}
          lineDistance={38}
          bendRadius={12}
          bendStrength={4.5}
          interactive={true}
          parallax={true}
          animationSpeed={0.5}
          gradientStart="#10ffb0"
          gradientMid="#8B5CF6"
          gradientEnd="#D946EF"
          linesGradient={["#10ffb0", "#8B5CF6", "#D946EF"]}
          mixBlendMode="screen"
          className="w-full h-full opacity-20 sm:opacity-25"
        />
        {/* Soft dark radial vignette ensuring text, messages, cards, and input are 100% readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,6,11,0.4)_0%,rgba(7,6,11,0.92)_100%)] pointer-events-none" />
      </div>

      {/* Floating Iridescent Ambient Blobs */}
      <FloatingIridescentBlobs variant="workspace" />

      {/* SECTION ONE — Ambient Particle Field */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 100%),
                            radial-gradient(1px 1px at 60% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 100%),
                            radial-gradient(1px 1px at 80% 20%, rgba(217, 70, 239, 0.35) 0%, transparent 100%),
                            radial-gradient(1px 1px at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 100%),
                            radial-gradient(1px 1px at 10% 60%, rgba(139, 92, 246, 0.25) 0%, transparent 100%),
                            radial-gradient(1px 1px at 90% 40%, rgba(217, 70, 239, 0.2) 0%, transparent 100%)`
        }}
      />

      {/* DAILY LIMIT BANNER (IF REACHED) */}
      {dailyLimitReached && (
        <div className="z-30 bg-gradient-to-r from-[#FF2A55]/20 via-[#8B5CF6]/20 to-[#FF2A55]/20 border-b border-[#8B5CF6]/35 backdrop-blur-lg px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 max-w-2xl mx-auto w-full">
            <AlertCircle size={15} className="text-[#D946EF] shrink-0" />
            <span className="text-xs text-white/90 font-medium truncate">
              {dailyLimitMessage || "Daily generation limit reached for today."}
            </span>
            <button
              type="button"
              onClick={onGoToPricing}
              className="ml-auto shrink-0 text-xs font-black text-[#D946EF] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
            >
              <span>Upgrade Plan</span>
              <ExternalLink size={11} />
            </button>
          </div>
        </div>
      )}

      {/* SECTION NINE — MAIN SCROLL AREA */}
      <div className="flex-1 overflow-y-auto pt-3 sm:pt-5 pb-[130px] px-3 sm:px-4 custom-scrollbar scroll-smooth relative z-10">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Neural Context Summary - Collapsible Label Section */}
          {messages.length > 0 && (
            <div className="mb-3">
              <button 
                type="button"
                onClick={() => setIsContextExpanded(!isContextExpanded)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all border-dashed group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <QreatoLogo size={14} className={`transition-colors shrink-0 ${isContextExpanded ? "text-[#D946EF]" : "text-neutral-400"}`} />
                </div>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="text-[11px] text-white/35 font-medium truncate max-w-[150px] sm:max-w-xs">
                    {messages.filter(m => m.role === 'user').slice(-1)[0]?.content}
                  </div>
                  <X size={12} className={`text-white/25 transition-transform ${isContextExpanded ? "rotate-0" : "rotate-45"}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {isContextExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-4 rounded-2xl bg-[#0A0812]/50 backdrop-blur-xl border border-[rgba(139,92,246,0.25)] shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                       <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D946EF] animate-pulse" />
                          <span className="text-[9px] font-bold text-[#C084FC]/80 uppercase tracking-widest">Latest User Brief</span>
                       </div>
                       <div className="prose prose-invert prose-xs max-w-none text-white/70 leading-relaxed prose-p:my-1">
                          <ReactMarkdown>
                            {messages.filter(m => m.role === 'user').slice(-1)[0]?.content || ""}
                          </ReactMarkdown>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* EMPTY STATE / COMPACT MOBILE-OPTIMIZED STARTER SCREEN */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center pt-1 sm:pt-2">
              
              {/* CLEAN PRODUCT UTILITY HEADER */}
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center gap-3 mb-1.5"
                >
                  {/* Qreato Brand Geometric Mark Badge */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/30 via-[#A855F7]/20 to-[#D946EF]/30 border border-[#8B5CF6]/40 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.25)] shrink-0">
                    <QreatoLogo size={18} className="text-white" />
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold font-['Nohemi',sans-serif] tracking-tight text-white">
                    Let's make something that moves people
                  </h1>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-normal px-2 font-normal flex items-center justify-center gap-1.5 min-h-[26px]"
                >
                  <span>What are we making impossible to</span>
                  <span className="inline-block relative">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ANIMATED_WORDS[animatedWordIndex]}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="text-[#FFBE0B] italic font-bold tracking-wide inline-block"
                      >
                        {ANIMATED_WORDS[animatedWordIndex]}?
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </motion.div>
              </div>

              {/* COMPACT 4 MODE TILES (EMAILS, ADS, PAGES, PSYCH) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-3.5 px-1">
                {[
                  { mode: "email" as MurgiiMode, icon: Mail, title: "Emails", desc: "Sequences", prompt: "Brief me on email sequence for " },
                  { mode: "ads" as MurgiiMode, icon: Target, title: "Ads", desc: "Hooks & Angles", prompt: "Brief me on Facebook/IG ad hooks for " },
                  { mode: "landing" as MurgiiMode, icon: FileText, title: "Pages", desc: "Sales Leads", prompt: "Brief me on sales landing page for " },
                  { mode: "psych" as MurgiiMode, icon: Zap, title: "Psych", desc: "Biases & Triggers", prompt: "Brief me on behavioral triggers and psychological hooks for " }
                ].map((item, i) => {
                  const isSelected = activeSelectedTile === item.mode;
                  return (
                    <motion.button
                      key={item.mode}
                      type="button"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 * i }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (!dailyLimitReached) {
                          setActiveSelectedTile(item.mode);
                          setSelectedMode(item.mode);
                          setInputValue(item.prompt);
                          inputRef.current?.focus();
                        }
                      }}
                      className={`relative flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer overflow-hidden group ${
                        isSelected
                          ? "bg-[#8B5CF6]/20 border-[#D946EF]/60 shadow-[0_0_20px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]"
                          : "bg-[#0B0914]/80 hover:bg-[#130E22] border-white/10 hover:border-[#8B5CF6]/40 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                      }`}
                      style={{ minHeight: "48px" }}
                    >
                      {/* Top light highlight line */}
                      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/40 via-white/40 to-transparent pointer-events-none" />
                      
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? "bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] border-white/30 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                          : "bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-white group-hover:bg-[#8B5CF6]/25"
                      }`}>
                        <item.icon size={15} className="text-white" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white/95 leading-tight truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-white/45 font-medium leading-tight truncate">
                          {item.desc}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* COLLAPSED SUGGESTED STARTER PROMPTS DROPDOWN */}
              <div className="w-full mt-3 px-1">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 }}
                  onClick={() => setSuggestionsOpen(!suggestionsOpen)}
                  className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#0B0914]/80 hover:bg-[#130E22] border border-[#8B5CF6]/25 hover:border-[#8B5CF6]/45 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all group cursor-pointer"
                  style={{ minHeight: "44px" }}
                  aria-expanded={suggestionsOpen}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-white">
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-white/90 group-hover:text-white transition-colors">
                      Use ready made prompts
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[9px] font-black uppercase text-[#E879F9] tracking-wider">
                      5 Formulas
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-white/40 group-hover:text-[#D946EF] transition-colors">
                    <span className="text-[10px] font-medium hidden sm:inline">
                      {suggestionsOpen ? "Hide" : "Explore"}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${suggestionsOpen ? "rotate-180 text-[#D946EF]" : ""}`}
                    />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {suggestionsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-2 rounded-xl bg-[#08060E]/90 border border-[#8B5CF6]/25 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] max-h-56 sm:max-h-64 overflow-y-auto custom-scrollbar space-y-1.5">
                        {[
                          {
                            mode: "email" as MurgiiMode,
                            tag: "Email Flow",
                            icon: Mail,
                            title: "SaaS Onboarding Welcome Sequence",
                            brief: "Create a 4-part onboarding email sequence for a B2B productivity app that drives Day-7 activation and converts trial users into annual paid subscribers using loss aversion.",
                          },
                          {
                            mode: "ads" as MurgiiMode,
                            tag: "Direct Response",
                            icon: Target,
                            title: "Scroll-Stopping Facebook Ad Hooks",
                            brief: "Generate 5 pattern-interrupt Facebook & Instagram ad hooks for a high-ticket coaching program targeting busy professionals who struggle with burnout.",
                          },
                          {
                            mode: "landing" as MurgiiMode,
                            tag: "Landing Hero",
                            icon: FileText,
                            title: "High-Converting Sales Page Lead",
                            brief: "Architect a high-converting long-form sales page hero headline, subheadline, and 3 quantifiable value props for an AI workflow platform.",
                          },
                          {
                            mode: "psych" as MurgiiMode,
                            tag: "Behavioral Psych",
                            icon: Zap,
                            title: "Buyer Psychology & Cognitive Bias Stack",
                            brief: "Brief me on behavioral triggers and psychological cognitive biases (scarcity, social proof, status framing) to double checkout conversion for a premium brand.",
                          },
                          {
                            mode: "email" as MurgiiMode,
                            tag: "VIP Teaser",
                            icon: Sparkles,
                            title: "Exclusive Product Drop Waitlist",
                            brief: "Write a 3-part teaser email campaign for a private product drop that builds extreme FOMO and drives a 35%+ day-one reservation rate.",
                          }
                        ].map((promptItem, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!dailyLimitReached) {
                                setActiveSelectedTile(promptItem.mode);
                                setSelectedMode(promptItem.mode);
                                setInputValue(promptItem.brief);
                                inputRef.current?.focus();
                              }
                            }}
                            className="w-full text-left p-2.5 rounded-lg bg-white/[0.03] hover:bg-[#8B5CF6]/15 border border-white/5 hover:border-[#8B5CF6]/30 transition-all group/item flex items-start justify-between gap-2.5 cursor-pointer"
                          >
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <div className="px-1.5 py-0.5 rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center gap-1">
                                  <promptItem.icon size={10} className="text-white" />
                                  <span className="text-[8px] font-black uppercase tracking-wider text-[#E879F9]">
                                    {promptItem.tag}
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold text-white/90 group-hover/item:text-white truncate">
                                  {promptItem.title}
                                </span>
                              </div>
                              <p className="text-[10px] text-white/50 group-hover/item:text-white/75 line-clamp-2 leading-relaxed">
                                {promptItem.brief}
                              </p>
                            </div>

                            <div className="shrink-0 self-center px-2 py-1 rounded bg-white/5 border border-white/10 group-hover/item:bg-[#8B5CF6]/25 group-hover/item:border-[#8B5CF6]/40 text-[9px] font-bold text-white/50 group-hover/item:text-[#D946EF] transition-all flex items-center gap-0.5">
                              <span>Use</span>
                              <span>→</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* MESSAGES LIST */}
          <AnimatePresence mode="popLayout">
            {messages.map((m, i) => (
              <motion.div 
                key={m.timestamp || i}
                initial={{ 
                  opacity: 0, 
                  y: 20, 
                  scale: 0.95,
                  filter: 'blur(4px)'
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1, 
                  filter: 'blur(0px)'
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.23, 1, 0.32, 1] 
                }}
                className={`flex ${m.role === "user" ? "justify-end relative z-10" : "justify-start relative z-10"} mb-6 last:mb-0`}
              >
                <div className={m.role === "user" ? "user-bubble" : `ai-bubble relative group pr-11 ${m.isDailyLimit ? 'border-[#8B5CF6]/40 bg-[#120D1A]' : ''}`}>
                  {m.role === "assistant" && !m.isDailyLimit && (
                    <button
                      type="button"
                      onClick={() => handleCopy(m.content, m.timestamp || i)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[#D946EF] hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 z-20 flex items-center justify-center cursor-pointer"
                      title="Copy persuasion brief"
                    >
                      {copiedId === (m.timestamp || i) ? (
                        <div className="flex items-center gap-1">
                          <Check size={13} className="text-[#D946EF]" />
                          <span className="text-[9px] font-bold text-[#D946EF] uppercase tracking-wider">Copied!</span>
                        </div>
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  )}
                  
                  <div className="prose prose-invert max-w-none text-white/90 leading-relaxed text-[14px]">
                    <TypewriterMarkdown content={m.content} isNew={m.isNew} />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CLEAN SIMPLIFIED LOADING INDICATOR */}
            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full mb-6 relative z-10 flex justify-start"
              >
                <AIProcessingTelemetry isGenerating={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* SECTION FIVE — BOTTOM INPUT BAR */}
      <footer className="input-bar-container fixed bottom-0 left-0 right-0 z-[100] bg-gradient-to-b from-[#08070E]/85 via-[#08070E]/97 to-[#06050A] backdrop-blur-[24px] saturate-[200%] border-t border-[rgba(139,92,246,0.18)] p-[12px_16px_20px] pb-[max(20px,env(safe-area-inset-bottom))]">
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/40 via-[#E9D5FF]/60 via-[#D946EF]/40 to-transparent" />
        
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-[10px]"
          >
            <motion.input
              animate={inputFocused ? 'focused' : 'initial'}
              variants={{
                initial: { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)' },
                focused: { 
                  boxShadow: [
                    '0 0 0 0 rgba(139, 92, 246, 0)',
                    '0 0 0 3px rgba(139, 92, 246, 0.25)',
                    '0 0 20px rgba(217, 70, 239, 0.15)'
                  ]
                }
              }}
              transition={{ duration: 0.25 }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={dailyLimitReached ? "Daily limit reached — upgrade to continue" : "Describe what you want to write…"}
              disabled={isLoading || dailyLimitReached}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck="false"
              className="flex-1 bg-white/5 border border-white/10 rounded-[16px] p-[14px_18px] text-white/90 outline-none backdrop-blur-[8px] transition-all focus:border-[#8B5CF6]/50 focus:bg-white/7 placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                fontSize: '16px',
                height: '48px'
              }}
            />

            <motion.button
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.94, y: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              type="submit"
              disabled={isLoading || !inputValue.trim() || dailyLimitReached}
              className="group relative w-[48px] h-[48px] rounded-[16px] bg-white/10 hover:bg-white/20 active:bg-white/15 border border-white/25 hover:border-white/50 backdrop-blur-2xl flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.25),0_0_20px_rgba(255,255,255,0.08)] overflow-hidden"
              style={{
                pointerEvents: (isLoading || dailyLimitReached) ? 'none' : 'all',
                position: 'relative',
                zIndex: 10,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
              aria-label="Send brief"
            >
              {/* 3D Glass Surface Curvature / Specular Reflection Sheen */}
              <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-white/35 via-white/10 to-transparent rounded-t-[15px] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20 pointer-events-none" />
              
              {/* Subtle ambient interior glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm" />

              {isLoading ? (
                <div className="relative z-10 w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp size={20} className="relative z-10 text-white group-hover:scale-110 transition-transform duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" strokeWidth={2.8} />
              )}
            </motion.button>
          </form>
        </div>
      </footer>
    </div>
  );
}
