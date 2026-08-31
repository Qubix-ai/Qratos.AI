import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Coins, 
  Mail, 
  Target, 
  FileText, 
  Zap, 
  Megaphone,
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
  ChevronDown,
  Trophy
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import ReactMarkdown from "react-markdown";
import { Murgii3DChicken } from "./Murgii3DChicken";
import { AIProcessingTelemetry } from "./AIProcessingTelemetry";
import { QreatoLogo } from "./QreatoLogo";
import { FloatingIridescentBlobs } from "./FloatingIridescentBlobs";
import { ScoreCard } from "./ScoreCard";
import { copyToClipboard } from "../lib/clipboard";
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
  generateUuid,
  isUuid,
  ChatSession 
} from "../lib/chatHistory";
import { fetchUserPlanAndCredits, UserPlanData } from "../lib/userAccount";

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
  challengeResult?: {
    shareSlug: string;
    overallScore: number;
    [key: string]: any;
  } | null;
}

// TYPEWRITER ANIMATION FOR PREMIUM CHAT REVEAL WITH PURPLE-MAGENTA CURSOR
export const markdownComponents = {
  p: ({ children }: any) => (
    <p className="mb-4 last:mb-0 leading-relaxed text-[14.5px] sm:text-[15px] text-white/90 font-normal whitespace-pre-line break-words">
      {children}
    </p>
  ),
  h1: ({ children }: any) => (
    <h1 className="text-lg sm:text-xl font-bold text-white mt-5 mb-2.5 first:mt-0 font-nohemi tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-base sm:text-lg font-bold text-white mt-4 mb-2 first:mt-0 font-nohemi tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-[15px] font-semibold text-white mt-3.5 mb-1.5 first:mt-0 font-nohemi tracking-tight">
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-sm font-semibold text-white mt-3 mb-1 first:mt-0">
      {children}
    </h4>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 last:mb-0 text-white/90 text-[14.5px] sm:text-[15px]">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-outside pl-5 mb-4 space-y-1.5 last:mb-0 text-white/90 text-[14.5px] sm:text-[15px]">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="leading-relaxed pl-0.5">
      {children}
    </li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-[#8B5CF6] pl-4 py-1.5 italic my-4 text-white/80 bg-white/[0.02] rounded-r-lg">
      {children}
    </blockquote>
  ),
  strong: ({ children }: any) => (
    <strong className="font-bold text-white">
      {children}
    </strong>
  ),
  em: ({ children }: any) => (
    <em className="italic text-white/90">
      {children}
    </em>
  ),
  a: ({ href, children }: any) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-[#D946EF] hover:text-white underline underline-offset-2 transition-colors font-medium"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }: any) => {
    const isInline = !className && typeof children === "string" && !children.includes("\n");
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-white/10 text-purple-200 font-mono text-[13px] border border-white/10" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className="my-3.5 p-3.5 rounded-xl bg-black/60 border border-white/15 overflow-x-auto text-xs font-mono text-gray-200 custom-scrollbar leading-relaxed">
        <code className="font-mono text-gray-200" {...props}>
          {children}
        </code>
      </pre>
    );
  },
  hr: () => <hr className="my-5 border-white/15" />,
};

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
      <ReactMarkdown components={markdownComponents}>{displayedContent}</ReactMarkdown>
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
  onUserDataRefresh?: (plan: UserPlanData, credits: number) => void;
  onClearPendingPrompt?: () => void;
  onSessionChange?: (id: string) => void;
  onMenuToggle?: () => void;
  onGoHome?: () => void;
  onGoToPricing?: () => void;
  onGoToAccount?: () => void;
  onLogout?: () => void;
  onNavigateToPublicChallenge?: (slug: string) => void;
}

export function ChatInterface({ 
  user, 
  userData, 
  activeTab, 
  activeSessionId, 
  pendingPrompt,
  remainingCredits: propCredits,
  onRemainingCreditsChange,
  onUserDataRefresh,
  onClearPendingPrompt,
  onSessionChange, 
  onMenuToggle, 
  onGoHome,
  onGoToPricing,
  onGoToAccount,
  onLogout,
  onNavigateToPublicChallenge
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
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [animatedWordIndex, setAnimatedWordIndex] = useState(0);

  const CHAT_MODES = [
    { mode: "email" as MurgiiMode, icon: Mail, title: "Emails", desc: "Sequences" },
    { mode: "ads" as MurgiiMode, icon: Target, title: "Ads", desc: "Hooks & Angles" },
    { mode: "landing" as MurgiiMode, icon: FileText, title: "Pages", desc: "Sales Leads" },
    { mode: "psych" as MurgiiMode, icon: Zap, title: "Psych", desc: "Biases & Triggers" },
    { mode: "content" as MurgiiMode, icon: Megaphone, title: "Content", desc: "Social Posts & Scripts" },
    { mode: "challenge" as MurgiiMode, icon: Trophy, title: "Challenge", desc: "Score your copy" }
  ];

  const MODE_PLACEHOLDERS: Record<MurgiiMode, string> = {
    email: "Craft your powerful email…",
    ads: "Craft your high-converting ad…",
    landing: "Craft your high-converting landing page…",
    psych: "Craft your psychological trigger…",
    content: "Craft your engaging content…",
    challenge: "Paste the copy you want scored…",
  };

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const currentSessionIdRef = useRef<string | undefined>(activeSessionId);
  const loadedSessionIdRef = useRef<string | undefined>(activeSessionId);
  const userId = user?.id || user?.uid || "";

  // Auto-resize textarea to expand/shrink based on content up to 200px max height
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    // Constrain height between single-line 50px and maximum 200px (6-8 lines)
    const newHeight = Math.min(Math.max(scrollHeight, 50), 200);
    textarea.style.height = `${newHeight}px`;
    if (scrollHeight > 200) {
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  // Synchronize active session ID and load saved chat messages
  useEffect(() => {
    // If activeSessionId matches what is already loaded or being processed in memory, skip reloading/clearing
    if (activeSessionId && activeSessionId === loadedSessionIdRef.current) {
      currentSessionIdRef.current = activeSessionId;
      return;
    }

    currentSessionIdRef.current = activeSessionId;
    loadedSessionIdRef.current = activeSessionId;

    if (activeSessionId && userId) {
      getSessionById(userId, activeSessionId).then((session) => {
        if (currentSessionIdRef.current === activeSessionId) {
          if (session && Array.isArray(session.messages)) {
            setMessages(session.messages);
          } else {
            setMessages([]);
          }
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
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const detectMode = (text: string, currentSelectedMode: MurgiiMode): MurgiiMode => {
    if (currentSelectedMode === 'challenge') return 'challenge';
    const lower = text.toLowerCase();
    if (lower.startsWith('score this') || lower.startsWith('evaluate this copy') || lower.startsWith('score my copy') || lower.includes('copy score challenge') || lower.startsWith('challenge:')) {
      return 'challenge';
    }
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
    if (lower.startsWith('brief me on content') || lower.includes('social post') || lower.includes('video script') || lower.includes('content script')) {
      return 'content';
    }
    return currentSelectedMode;
  };

  const executePrompt = async (rawText: string, modeToUse?: MurgiiMode) => {
    const text = rawText.trim();
    if (!text || isLoading || dailyLimitReached) return;

    const targetMode = modeToUse || detectMode(text, selectedMode);
    setSelectedMode(targetMode);

    // Determine target session ID or generate new valid UUID session
    let targetSessionId = currentSessionIdRef.current;
    if (!targetSessionId || !isUuid(targetSessionId)) {
      targetSessionId = generateUuid();
      currentSessionIdRef.current = targetSessionId;
      loadedSessionIdRef.current = targetSessionId;
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

      // Immediately after every successful call to the murgii-generate Edge Function:
      // Re-fetch the user's current plan from user_plan table and the current day's usage count / exact remaining count.
      // Do not calculate or guess remaining credits on the frontend:
      // Always display the exact remaining value returned by the murgii-generate function response.
      if (typeof result.remaining === 'number') {
        setRemainingCredits(result.remaining);
        onRemainingCreditsChange?.(result.remaining);
      }

      if (userId) {
        fetchUserPlanAndCredits(userId, result.remaining, user?.user_metadata, user?.email)
          .then(({ planData, remainingCredits: freshCredits }) => {
            setRemainingCredits(freshCredits);
            onRemainingCreditsChange?.(freshCredits);
            onUserDataRefresh?.(planData, freshCredits);
          })
          .catch((err) => console.warn("Error re-fetching user plan from Supabase:", err));
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
        isNew: true,
        challengeResult: result.challengeResult 
          ? {
              ...result.challengeResult,
              userCopy: result.challengeResult.userCopy || result.challengeResult.copy || text,
            }
          : null,
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
        const limitRemaining = typeof err.remaining === 'number' ? err.remaining : 0;
        setRemainingCredits(limitRemaining);
        onRemainingCreditsChange?.(limitRemaining);

        if (userId) {
          fetchUserPlanAndCredits(userId, limitRemaining, user?.user_metadata, user?.email)
            .then(({ planData, remainingCredits: freshCredits }) => {
              onUserDataRefresh?.(planData, freshCredits);
            })
            .catch(() => {});
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

  // Handle incoming pendingPrompt from Landing, PromptBuilder, etc.
  useEffect(() => {
    if (pendingPrompt) {
      if (pendingPrompt.mode) {
        setSelectedMode(pendingPrompt.mode);
        setActiveSelectedTile(pendingPrompt.mode);
      }
      if (pendingPrompt.text && pendingPrompt.text.trim()) {
        if (pendingPrompt.autoSubmit) {
          executePrompt(pendingPrompt.text, pendingPrompt.mode);
        } else {
          setInputValue(pendingPrompt.text);
        }
      }
      onClearPendingPrompt?.();
    }
  }, [pendingPrompt]);

  const handleSend = async () => {
    await executePrompt(inputValue, selectedMode);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden font-sans h-full min-h-0 bg-black">
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

      {/* MAIN SCROLL AREA */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pt-4 sm:pt-6 pb-[130px] px-3 sm:px-4 custom-scrollbar scroll-smooth relative z-10">
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
                       <div className="prose prose-invert prose-xs max-w-none text-white/70 leading-relaxed">
                          <ReactMarkdown components={markdownComponents}>
                            {messages.filter(m => m.role === 'user').slice(-1)[0]?.content || ""}
                          </ReactMarkdown>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* EMPTY STATE - CLEAN MINIMALIST HEADER */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-8 sm:pt-16 pb-6 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center gap-3 mb-2"
              >
                {/* Qreato Brand Geometric Mark Badge */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black border border-white/20 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)] shrink-0">
                  <QreatoLogo size={20} className="text-white" dotClassName="text-white fill-white" />
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-['Nohemi',sans-serif] tracking-tight text-white">
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

                  {/* If challengeResult is present on the assistant message, render the distinct Score Card UI */}
                  {m.challengeResult && typeof m.challengeResult.overallScore === 'number' && (
                    <ScoreCard 
                      overallScore={m.challengeResult.overallScore}
                      shareSlug={m.challengeResult.shareSlug}
                      userCopy={
                        m.challengeResult.userCopy || 
                        m.challengeResult.copy || 
                        (i > 0 && messages[i - 1]?.role === "user" ? messages[i - 1].content : undefined)
                      }
                      onNavigateToPublicChallenge={onNavigateToPublicChallenge}
                      biggestLeverage={m.challengeResult.biggest_leverage || m.challengeResult.biggestLeverage}
                      diagnosis={m.challengeResult.diagnosis || m.challengeResult.weakestReason}
                      dimensions={m.challengeResult.dimensions || {
                        attention: m.challengeResult.attention_score,
                        clarity: m.challengeResult.clarity_score,
                        desire: m.challengeResult.desire_score,
                        persuasion: m.challengeResult.persuasion_score,
                        action: m.challengeResult.action_score,
                      }}
                    />
                  )}
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

      {/* BOTTOM INPUT BAR - SIMPLE MINIMALIST AI LAYOUT */}
      <footer className="fixed bottom-0 left-0 right-0 z-[100] bg-gradient-to-t from-black via-black/90 to-transparent pt-4 pb-4 px-3 sm:px-6 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            {/* Minimalist Typing Container Card */}
            <div
              className="relative flex flex-col rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-[#121215] shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-200 focus-within:border-white/30 focus-within:bg-[#16161a]"
            >
              {/* Textarea Area */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={(e) => {
                  // Allow Shift+Enter or Enter without sending accidentally on arrow keys
                  if (e.key === "Enter" && !e.shiftKey) {
                    // Standard newline unless explicitly tapping send, or if user wants Enter to send, can be optional. User requested only send button or proper newline handling.
                  }
                }}
                rows={1}
                placeholder={
                  dailyLimitReached 
                    ? "Daily limit reached — upgrade to continue" 
                    : MODE_PLACEHOLDERS[selectedMode] || "Ask anything or paste copy to analyze…"
                }
                disabled={isLoading || dailyLimitReached}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck="false"
                className="w-full bg-transparent px-4 sm:px-5 pt-3.5 pb-2 text-white/90 text-sm sm:text-base outline-none placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed resize-none custom-scrollbar leading-relaxed"
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  minHeight: '48px',
                  maxHeight: '180px',
                  boxSizing: 'border-box'
                }}
              />

              {/* Bottom Actions Row inside the input container */}
              <div className="flex items-center justify-between px-3 sm:px-4 pb-3 pt-1">
                {/* Left: Mode / Model Selector Pill Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModeSelectorOpen(!isModeSelectorOpen)}
                    disabled={isLoading || dailyLimitReached}
                    className="h-8 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
                    title="Select AI Persuasion Mode"
                  >
                    {(() => {
                      const currentMode = CHAT_MODES.find((m) => m.mode === selectedMode) || CHAT_MODES[0];
                      const CurrentIcon = currentMode.icon;
                      return (
                        <>
                          <CurrentIcon size={13} className="text-gray-300" />
                          <span className="font-medium">{currentMode.title}</span>
                          <ChevronDown size={12} className={`text-gray-400 transition-transform ${isModeSelectorOpen ? "rotate-180" : ""}`} />
                        </>
                      );
                    })()}
                  </button>

                  {/* Mode Selector Dropdown Popup */}
                  {isModeSelectorOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-56 p-1.5 rounded-2xl border border-white/15 bg-[#141418] shadow-[0_12px_40px_rgba(0,0,0,0.95)] z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 border-b border-white/10 mb-1">
                        Persuasion Mode
                      </div>
                      <div className="space-y-0.5">
                        {CHAT_MODES.map((modeItem) => {
                          const ModeIcon = modeItem.icon;
                          const isSelected = selectedMode === modeItem.mode;
                          return (
                            <button
                              key={modeItem.mode}
                              type="button"
                              onClick={() => {
                                setSelectedMode(modeItem.mode);
                                setActiveSelectedTile(modeItem.mode);
                                setIsModeSelectorOpen(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-white/15 text-white font-medium border border-white/15"
                                  : "text-gray-300 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg ${isSelected ? "bg-white text-black" : "bg-white/10 text-white"}`}>
                                <ModeIcon size={13} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold truncate">{modeItem.title}</div>
                                <div className="text-[10px] text-gray-400 truncate">{modeItem.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Circular Up-Arrow Send Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim() || dailyLimitReached}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                    inputValue.trim() && !isLoading && !dailyLimitReached
                      ? "bg-white text-black shadow-md hover:bg-gray-200"
                      : "bg-white/10 text-white/30 cursor-not-allowed border border-white/5"
                  }`}
                  aria-label="Send brief"
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp size={16} className="stroke-[2.5]" />
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
