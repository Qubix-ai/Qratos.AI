import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  BrainCircuit, 
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
import { 
  callMurgiiGenerateEdgeFunction, 
  DailyLimitError, 
  MurgiiMode, 
  supabase 
} from "../lib/supabase";

// SECTION THREE — 3D CARD SYSTEM WITH MOUSE TRACKING
const Card3D = ({ children, delay = 0, onClick }: { children: React.ReactNode, delay?: number, onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
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

  // Touch tilt for mobile
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
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="card-3d cursor-pointer"
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

// SECTION EIGHT — LOADING ANIMATION
const LoadingBubble = () => (
  <motion.div
    className="ai-bubble ml-0 mr-auto self-start mt-2"
    initial={{ opacity: 0, y: 16, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
  >
    <div className="loading-dots">
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
    <span className="loading-label">SYNERGIZING...</span>
  </motion.div>
);

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  isNew?: boolean;
  isDailyLimit?: boolean;
}

// TYPEWRITER ANIMATION FOR PREMIUM CHAT REVEAL
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
          className="inline-block w-1.5 h-3.5 bg-[#C9A84C] ml-1 animate-pulse" 
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
  onSessionChange?: (id: string) => void;
  onMenuToggle?: () => void;
  onGoHome?: () => void;
  onLogout?: () => void;
}

export function ChatInterface({ 
  user, 
  userData, 
  activeTab, 
  activeSessionId, 
  onSessionChange, 
  onMenuToggle, 
  onGoHome,
  onLogout 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMode, setSelectedMode] = useState<MurgiiMode>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [dailyLimitMessage, setDailyLimitMessage] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

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

  // Tool / Mode definitions mapping to Supabase Edge Function modes
  const toolButtons: { id: MurgiiMode | 'hook'; mode: MurgiiMode; icon: any; label: string; prompt: string }[] = [
    { id: 'email', mode: 'email', icon: Mail, label: 'Email', prompt: 'Create a high-converting email sequence for ' },
    { id: 'ads', mode: 'ads', icon: Target, label: 'Ads', prompt: 'Create 5 scroll-stopping Facebook ad hooks for ' },
    { id: 'landing', mode: 'landing', icon: FileText, label: 'Landing', prompt: 'Architect a long-form sales page headline and lead for ' },
    { id: 'hook', mode: 'ads', icon: Zap, label: 'Hook', prompt: 'Generate 10 viral-style ad hooks for ' },
  ];

  // Helper to determine the target mode for the edge function
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

  const handleSend = async () => {
    const rawText = inputValue.trim();
    if (!rawText || isLoading || dailyLimitReached) return;

    const targetMode = detectMode(rawText, selectedMode);
    
    // User message
    const userMessage: Message = {
      role: 'user',
      content: rawText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the secure Supabase Edge Function
      const result = await callMurgiiGenerateEdgeFunction(targetMode, rawText);

      // Update remaining count if provided
      if (typeof result.remaining === 'number') {
        setRemainingCredits(result.remaining);
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
        isNew: true
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error("Murgii Generation Error:", err);
      
      if (err instanceof DailyLimitError || err?.name === "DailyLimitError") {
        setDailyLimitReached(true);
        setDailyLimitMessage(err.message);
        if (typeof err.remaining === 'number') {
          setRemainingCredits(err.remaining);
        }

        const limitNotice: Message = {
          role: 'assistant',
          content: `### 🛑 Daily Limit Reached\n\n${err.message}\n\nTo continue generating high-converting copy without interruption, upgrade your workspace plan:\n\n[**Upgrade Your Plan on Whop →**](https://whop.com/qreato/ai-leverage)`,
          timestamp: new Date().toISOString(),
          isDailyLimit: true
        };
        setMessages(prev => [...prev, limitNotice]);
      } else {
        // Safe, non-technical error message as strictly instructed
        const safeErrorMessage: Message = {
          role: 'assistant',
          content: "Something went wrong generating this — please try again in a moment.",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, safeErrorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col relative overflow-hidden font-sans h-full min-h-0"
      style={{ 
        background: `radial-gradient(ellipse 70% 50% at 15% 10%, rgba(201, 168, 76, 0.06) 0%, transparent 55%),
                     radial-gradient(ellipse 50% 40% at 85% 90%, rgba(201, 168, 76, 0.04) 0%, transparent 50%),
                     radial-gradient(ellipse 80% 60% at 50% 50%, rgba(12, 10, 18, 1) 0%, rgba(6, 5, 10, 1) 100%)`
      }}
    >
      {/* SECTION ONE — Ambient Particle Field */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20% 30%, rgba(201, 168, 76, 0.4) 0%, transparent 100%),
                            radial-gradient(1px 1px at 60% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 100%),
                            radial-gradient(1px 1px at 80% 20%, rgba(201, 168, 76, 0.3) 0%, transparent 100%),
                            radial-gradient(1px 1px at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 100%),
                            radial-gradient(1px 1px at 10% 60%, rgba(201, 168, 76, 0.2) 0%, transparent 100%),
                            radial-gradient(1px 1px at 90% 40%, rgba(255, 255, 255, 0.12) 0%, transparent 100%)`
        }}
      />

      {/* SECTION TWO — HEADER BAR WITH SUPABASE AUTH & CREDITS */}
      <header className="flex-shrink-0 fixed top-0 left-0 right-0 h-[64px] flex items-center justify-between px-4 z-[100] bg-gradient-to-b from-[#08070E]/95 to-[#08070E]/80 backdrop-blur-[20px] saturate-[180%] border-b border-[rgba(255,181,46,0.15)] shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.4)]">
         <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onMenuToggle}
              className="p-2 -ml-2 text-white/60 hover:text-[#FFB52E] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col">
              <div 
                className="text-base font-[900] tracking-[0.08em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFB52E 60%, #FFA000 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                MURGII.AI
              </div>
              <span className="text-[9px] font-[700] tracking-[0.2em] text-[#FFB52E]/80 uppercase">PERSUASION ENGINE</span>
            </div>
         </div>

         <div className="flex items-center gap-2.5 sm:gap-4">
           <button 
             type="button"
             onClick={onGoHome}
             className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-[10px] text-[10px] font-bold text-white/70 uppercase tracking-[0.12em] bg-white/5 border border-white/10 backdrop-blur-[8px] hover:bg-[#FFB52E]/10 hover:border-[#FFB52E]/30 hover:text-[#FFB52E] transition-all cursor-pointer"
           >
             <LayoutDashboard size={14} />
             <span>Landing Control</span>
           </button>
           
           {/* DYNAMIC CREDITS BADGE */}
           <div 
             className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB52E]/30 shadow-[0_0_12px_rgba(255,181,46,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] bg-gradient-to-br from-[#FFB52E]/15 to-[#FFB52E]/06"
             style={{ animation: 'pulseGold 3s ease-in-out infinite' }}
           >
             <Coins size={13} className="text-[#FFB52E]" />
             <span className="text-xs font-bold text-[#FFB52E] tracking-[0.05em] uppercase">
               {remainingCredits !== null ? `${remainingCredits} RESPONSES` : "TODAY'S RESPONSES"}
             </span>
           </div>

           {/* ACCOUNT MENU (SUPABASE AUTH) */}
           <div className="relative" ref={accountMenuRef}>
             <button
               type="button"
               onClick={() => setAccountMenuOpen(!accountMenuOpen)}
               className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FFB52E]/30 transition-all cursor-pointer"
             >
               <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FFB52E] to-[#FFA000] flex items-center justify-center text-black font-black text-[10px]">
                 {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={12} />}
               </div>
               <span className="hidden md:inline-block text-[11px] font-medium text-white/80 max-w-[130px] truncate">
                 {user?.email || "Account"}
               </span>
               <ChevronDown size={13} className={`text-white/40 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
             </button>

             <AnimatePresence>
               {accountMenuOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: 8, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 8, scale: 0.95 }}
                   transition={{ duration: 0.15 }}
                   className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0C0A14] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(255,181,46,0.1)] p-2 z-[110]"
                 >
                   <div className="px-3 py-2 border-b border-white/06">
                     <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Logged In As</p>
                     <p className="text-xs font-bold text-white truncate mt-0.5">{user?.email || "Authenticated User"}</p>
                     <p className="text-[9px] text-[#FFB52E] font-mono mt-1">Shared Supabase Architecture</p>
                   </div>

                   <a
                     href="https://whop.com/qreato/ai-leverage"
                     target="_blank"
                     rel="noreferrer"
                     className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-[#FFB52E] hover:bg-[#FFB52E]/10 transition-colors mt-1"
                   >
                     <span className="font-bold">Upgrade Daily Limit</span>
                     <ExternalLink size={13} />
                   </a>

                   <button
                     type="button"
                     onClick={() => {
                       setAccountMenuOpen(false);
                       if (onLogout) {
                         onLogout();
                       } else {
                         supabase.auth.signOut();
                       }
                     }}
                     className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer mt-1"
                   >
                     <LogOut size={14} />
                     <span>Sign Out</span>
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
         </div>

         {/* Gold Shimmer Line */}
         <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E]/60 via-[#FFDC78]/80 via-[#FFB52E]/60 to-transparent" />
      </header>

      {/* DAILY LIMIT BANNER (IF REACHED) */}
      {dailyLimitReached && (
        <div className="fixed top-[64px] left-0 right-0 z-40 bg-gradient-to-r from-[#FF2A55]/20 via-[#FFB52E]/20 to-[#FF2A55]/20 border-b border-[#FFB52E]/30 backdrop-blur-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-2xl mx-auto w-full">
            <AlertCircle size={15} className="text-[#FFB52E] shrink-0" />
            <span className="text-xs text-white/90 font-medium truncate">
              {dailyLimitMessage || "Daily generation limit reached for today."}
            </span>
            <a 
              href="https://whop.com/qreato/ai-leverage" 
              target="_blank" 
              rel="noreferrer"
              className="ml-auto shrink-0 text-xs font-black text-[#FFB52E] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Upgrade</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}

      {/* SECTION NINE — MAIN SCROLL AREA */}
      <div className={`flex-1 overflow-y-auto ${dailyLimitReached ? 'pt-[104px]' : 'pt-[64px]'} pb-[140px] px-4 custom-scrollbar scroll-smooth relative z-10`}>
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Neural Context Summary - Collapsible Label Section */}
          {messages.length > 0 && (
            <div className="mb-4">
              <button 
                type="button"
                onClick={() => setIsContextExpanded(!isContextExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all border-dashed group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit size={14} className={`transition-colors ${isContextExpanded ? "text-[#C9A84C]" : "text-[#C9A84C]/60"}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]/60 group-hover:text-[#C9A84C] transition-colors">Persuasion Context Active</span>
                </div>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="text-[11px] text-white/30 font-medium truncate max-w-[150px] sm:max-w-xs">
                    {messages.filter(m => m.role === 'user').slice(-1)[0]?.content}
                  </div>
                  <X size={12} className={`text-white/20 transition-transform ${isContextExpanded ? "rotate-0" : "rotate-45"}`} />
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
                    <div className="mt-2 p-5 rounded-2xl bg-[#0A0812]/40 backdrop-blur-xl border border-[rgba(201,168,76,0.15)] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                       <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                          <span className="text-[9px] font-bold text-[#C9A84C]/70 uppercase tracking-widest">Latest User Brief</span>
                       </div>
                       <div className="prose prose-invert prose-xs max-w-none text-white/60 leading-relaxed prose-p:my-1">
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

          {/* EMPTY STATE / WELCOME SCREEN WITH 4 MODE TILES */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center pt-2">
              
              {/* 3D ANIMATED CHICKEN IN WELCOMING VIEW */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-2 flex flex-col items-center"
              >
                <Murgii3DChicken size="md" interactive={true} showPedestal={true} showHologram={true} />
              </motion.div>

              {/* WELCOME TEXT */}
              <div className="flex flex-col items-center text-center -mt-2">
                <div className="welcome-heading !my-1">
                  {['WELCOME', 'TO', 'MURGII.AI'].map((word, i) => (
                    <motion.span
                      key={word + i}
                      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.7,
                        delay: 0.2 + (i * 0.1),
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      style={{ display: 'inline-block', marginRight: '0.25em' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="welcome-subtitle !px-4 !text-[13px]"
                >
                  The $500M persuasive copywriting engine. Select a formula below to engineer conversion.
                </motion.p>
              </div>

              {/* FOUR MODE TILES (EMAILS, ADS, PAGES, PSYCH) */}
              <div className="grid grid-cols-2 gap-[12px] w-full mt-6 px-2">
                {[
                  { mode: "email" as MurgiiMode, icon: Mail, title: "Emails", desc: "Sequence Architect", prompt: "Brief me on email sequence for ", delay: 0 },
                  { mode: "ads" as MurgiiMode, icon: Target, title: "Ads", desc: "Facebook/IG Hooks", prompt: "Brief me on Facebook/IG ad hooks for ", delay: 0.08 },
                  { mode: "landing" as MurgiiMode, icon: FileText, title: "Pages", desc: "Sales Landing Pages", prompt: "Brief me on sales landing page for ", delay: 0.16 },
                  { mode: "psych" as MurgiiMode, icon: Zap, title: "Psych", desc: "Behavioral Triggers", prompt: "Brief me on behavioral triggers and psychological hooks for ", delay: 0.24 }
                ].map((item, i) => (
                  <Card3D 
                    key={i}
                    delay={item.delay}
                    onClick={() => {
                      if (!dailyLimitReached) {
                        setSelectedMode(item.mode);
                        setInputValue(item.prompt);
                        inputRef.current?.focus();
                      }
                    }}
                  >
                    {/* Top light line */}
                    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E]/50 via-white/50 via-[#FFB52E]/50 to-transparent z-[1]" />
                    {/* Ambient Glow */}
                    <div className="absolute -top-[40px] -right-[40px] w-[100px] h-[100px] bg-radial-gradient from-[#FFB52E]/15 to-transparent pointer-events-none z-0" />
                    
                    {/* FLOATING ICON */}
                    <div 
                      className="card-icon-container relative z-10 w-[44px] h-[44px] rounded-[12px] bg-gradient-to-br from-[#FFB52E]/20 to-[#FFB52E]/06 border border-[#FFB52E]/30 flex items-center justify-center mb-[14px] shadow-[0_0_16px_rgba(255,181,46,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    >
                      <item.icon size={20} className="text-[#FFB52E]" />
                    </div>
                    
                    <span style={{ transform: 'translateZ(15px)' }} className="relative z-10 text-[15px] font-[700] text-white/92 tracking-tight mb-1 block">{item.title}</span>
                    <span style={{ transform: 'translateZ(10px)' }} className="relative z-10 text-[12px] font-[400] text-white/40 tracking-tight block">{item.desc}</span>
                  </Card3D>
                ))}
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
                <div className={m.role === "user" ? "user-bubble" : `ai-bubble relative group pr-11 ${m.isDailyLimit ? 'border-[#FFB52E]/40 bg-[#140F0A]' : ''}`}>
                  {m.role === "assistant" && !m.isDailyLimit && (
                    <button
                      type="button"
                      onClick={() => handleCopy(m.content, m.timestamp || i)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 z-20 flex items-center justify-center cursor-pointer"
                      title="Copy persuasion brief"
                    >
                      {copiedId === (m.timestamp || i) ? (
                        <div className="flex items-center gap-1">
                          <Check size={13} className="text-[#C9A84C]" />
                          <span className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-wider">Copied!</span>
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

            {/* AI PROCESSING TELEMETRY & LOADING INDICATOR */}
            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full mb-6 relative z-10 flex flex-col items-center"
              >
                <AIProcessingTelemetry isGenerating={isLoading} />
                <div className="flex justify-start w-full">
                  <LoadingBubble />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* SECTION FIVE — BOTTOM INPUT BAR & FILTER PILLS */}
      <footer className="input-bar-container fixed bottom-0 left-0 right-0 z-[100] bg-gradient-to-b from-[#08070E]/85 via-[#08070E]/97 to-[#06050A] backdrop-blur-[24px] saturate-[200%] border-t border-[rgba(201,168,76,0.12)] p-[12px_16px_20px] pb-[max(20px,env(safe-area-inset-bottom))]">
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 via-[#FFDC78]/60 via-[#C9A84C]/40 to-transparent" />
        
        <div className="max-w-2xl mx-auto">
          {/* Tab / Filter Row */}
          <div className="flex gap-2 mb-[10px] overflow-x-auto no-scrollbar scrollbar-hide py-1">
            {toolButtons.map(tool => (
              <button
                type="button"
                key={tool.id}
                onClick={() => {
                  if (!dailyLimitReached) {
                    setSelectedMode(tool.mode);
                    setInputValue(tool.prompt);
                    inputRef.current?.focus();
                  }
                }}
                className={`flex items-center gap-[6px] px-[14px] py-[6px] rounded-full border text-[11px] font-[600] tracking-[0.10em] whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  selectedMode === tool.mode || inputValue.startsWith(tool.prompt)
                  ? "bg-gradient-to-br from-[#C9A84C]/18 to-[#C9A84C]/06 border-[#C9A84C]/35 text-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.12)]"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/8 hover:text-white/75 hover:border-white/15"
                }`}
              >
                <tool.icon size={13} className={selectedMode === tool.mode || inputValue.startsWith(tool.prompt) ? "text-[#C9A84C] drop-shadow-[0_0_4px_rgba(201,168,76,0.8)]" : "text-white/40"} />
                <span className="uppercase">{tool.label}</span>
              </button>
            ))}
          </div>

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
                initial: { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0)' },
                focused: { 
                  boxShadow: [
                    '0 0 0 0 rgba(201, 168, 76, 0)',
                    '0 0 0 3px rgba(201, 168, 76, 0.15)',
                    '0 0 20px rgba(201, 168, 76, 0.08)'
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
              placeholder={dailyLimitReached ? "Daily limit reached — upgrade to continue" : "Input persuasion brief..."}
              disabled={isLoading || dailyLimitReached}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck="false"
              className="flex-1 bg-white/5 border border-white/10 rounded-[16px] p-[14px_18px] text-white/90 outline-none backdrop-blur-[8px] transition-all focus:border-[#C9A84C]/35 focus:bg-white/7 placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                fontSize: '16px',
                height: '48px'
              }}
            />

            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 8px 28px rgba(201, 168, 76, 0.5)' }}
              whileTap={{ scale: 0.92, boxShadow: '0 2px 8px rgba(201, 168, 76, 0.3)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              type="submit"
              disabled={isLoading || !inputValue.trim() || dailyLimitReached}
              className="w-[48px] h-[48px] rounded-[14px] bg-gradient-to-br from-[#C9A84C] to-[#A8882E] flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                pointerEvents: (isLoading || dailyLimitReached) ? 'none' : 'all',
                position: 'relative',
                zIndex: 10,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
              aria-label="Send brief"
            >
              {isLoading ? (
                <div className="w-[18px] h-[18px] border-2 border-black/80 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp size={20} className="text-black/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" strokeWidth={3} />
              )}
            </motion.button>
          </form>
        </div>
      </footer>
    </div>
  );
}
