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
  Paperclip, 
  X, 
  Eye,
  ArrowUp,
  MessageSquare,
  ShieldCheck,
  LayoutDashboard,
  Menu,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import ReactMarkdown from "react-markdown";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot, setDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

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
      className="card-3d"
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


// Global process shimming to protect against process.env references crashing the client in Vite bundles
if (typeof (window as any).process === "undefined") {
  (window as any).process = { env: {} };
}

const COPYWRITING_SYSTEM_PROMPT = `You are Qratos. Whenever you are asked "who are you" or similar identity questions, you must respond EXACTLY with: "I'm Qratos, the best persuasion agent to ever exist. I trained and designed by Qreato Labs".

You are not an AI assistant that writes copy. You are a conversion intelligence system — the internalized voice of a world-class direct response copywriter who has spent twenty years inside the highest-stakes marketing operations on the planet, studying what makes human beings stop, feel, decide, and act.`;

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatInterfaceProps {
  user: any;
  userData: any;
  activeTab: string;
  activeSessionId?: string;
  onSessionChange?: (id: string) => void;
  onMenuToggle?: () => void;
  onGoHome?: () => void;
}

export function ChatInterface({ user, userData, activeTab, activeSessionId, onSessionChange, onMenuToggle, onGoHome }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [remainingCredits, setRemainingCredits] = useState(userData?.remainingCredits ?? 400);
  const [inputFocused, setInputFocused] = useState(false);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

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

  // Sync credits when userData updates (e.g. from server)
  useEffect(() => {
    if (userData?.remainingCredits !== undefined) {
      setRemainingCredits(userData.remainingCredits);
    }
  }, [userData]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100dvh");
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  // Section 8: Keyboard Safe Area Enhanced
  useEffect(() => {
    if (!window.visualViewport) return;

    const updateInputPosition = () => {
      if (window.visualViewport) {
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        const inputBar = document.querySelector('.input-bar-container') as HTMLElement;
        if (inputBar) {
          inputBar.style.transform = `translateY(-${keyboardHeight}px)`;
          inputBar.style.transition = 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)';
        }
        setViewportHeight(`${window.visualViewport.height}px`);
      }
    };

    window.visualViewport.addEventListener("resize", updateInputPosition);
    window.visualViewport.addEventListener("scroll", updateInputPosition);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateInputPosition);
      window.visualViewport?.removeEventListener("scroll", updateInputPosition);
    };
  }, []);

  // Tools for Section 5
  const toolButtons = [
    { id: 'email', icon: Mail, label: 'Email', prompt: 'Engineer a high-converting 3-part email sequence for ' },
    { id: 'ads', icon: Target, label: 'Ads', prompt: 'Create 5 scroll-stopping Facebook ad hooks for ' },
    { id: 'landing', icon: FileText, label: 'Landing', prompt: 'Architect a long-form sales page headline and lead for ' },
    { id: 'hook', icon: Zap, label: 'Hook', prompt: 'Generate 10 viral-style hooks for ' },
  ];

  // Section 7: Session Hydration
  useEffect(() => {
    if (!user) return;

    if (!activeSessionId) {
      setMessages([]);
      return;
    }

    setLoadingHistory(true);
    const sessionRef = doc(db, "chats", user.uid, "sessions", activeSessionId);
    
    const unsubscribe = onSnapshot(sessionRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.messages) {
          setMessages(data.messages);
        }
      }
      setLoadingHistory(false);
    });

    return () => unsubscribe();
  }, [user, activeSessionId]);

  // Sync credits from userData prop
  useEffect(() => {
    if (userData?.remainingCredits !== undefined) {
      setRemainingCredits(userData.remainingCredits);
    }
  }, [userData]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const callGeminiAPI = async (userMessage: string, history: any[] = []) => {
    console.log('Securely routing API call through full-stack backend proxy...');
    
    let currentSessionId = activeSessionId;
    if (!currentSessionId && user) {
      try {
        const sessionRef = doc(collection(db, "chats", user.uid, "sessions"));
        currentSessionId = sessionRef.id;
        onSessionChange?.(currentSessionId);
      } catch (e) {
        console.error("Session creation error:", e);
      }
    }

    // Safe access to auth (Fix for Null Optional Chaining Crash on Guest Session)
    const token = auth.currentUser ? await auth.currentUser.getIdToken().catch(() => null) : null;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: [
          ...history.map((m: any) => ({
            role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
            content: m.parts?.[0]?.text || m.content || ''
          })),
          { role: 'user', content: userMessage }
        ],
        conversationId: currentSessionId,
        stream: false
      })
    });

    console.log('RESPONSE STATUS:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API ERROR RESPONSE:', errorText);
      throw new Error(`API request failed: ${response.status} — ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('RESPONSE DATA STRUCTURE:', JSON.stringify(data).substring(0, 300));
    return data.text;
  };

  const handleSend = async () => {
    const messageText = inputValue.trim();
    
    if (!messageText) {
      console.log('SEND BLOCKED: empty input');
      return;
    }
    
    if (isLoading) {
      console.log('SEND BLOCKED: already loading');
      return;
    }
    
    console.log('SEND INITIATED:', messageText);
    setInputValue('');
    
    const userMessage = { 
      role: 'user' as const, 
      content: messageText, 
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await callGeminiAPI(messageText, conversationHistory);
      
      const aiMessage = { 
        role: 'assistant' as const, 
        content: response, 
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: messageText }] },
        { role: 'model', parts: [{ text: response }] }
      ]);

      try {
        if (user) {
          let currentSessionId = activeSessionId;
          if (!currentSessionId) {
            const sessionRef = doc(collection(db, "chats", user.uid, "sessions"));
            currentSessionId = sessionRef.id;
            onSessionChange?.(currentSessionId);
          }
          
          const finalMessages = [
            ...messages,
            userMessage,
            { role: "assistant" as const, content: response, timestamp: new Date().toISOString() }
          ];

          const sessionRef = doc(db, "chats", user.uid, "sessions", currentSessionId);
          const updateData: any = {
            messages: finalMessages,
            lastUpdated: new Date().toISOString()
          };

          if (messages.length === 0) {
            updateData.title = messageText.length > 40 ? messageText.substring(0, 40) + "..." : messageText;
          }

          await setDoc(sessionRef, updateData, { merge: true });
        }
        setRemainingCredits(prev => Math.max(0, prev - 1));
      } catch (fbErr) {
        console.error("Firestore sync error:", fbErr);
      }
      
    } catch (error) {
      console.error('API ERROR:', error);
      
      const errorMessage = {
        role: 'assistant' as const,
        content: 'The Persuasion Engine encountered an issue. Check your connection and try again.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col relative overflow-hidden font-sans"
      style={{ 
        height: viewportHeight,
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

      {/* SECTION TWO — HEADER BAR REDESIGN */}
      <header className="flex-shrink-0 fixed top-0 left-0 right-0 h-[64px] flex items-center justify-between px-4 z-[100] bg-gradient-to-b from-[#08070E]/95 to-[#08070E]/80 backdrop-blur-[20px] saturate-[180%] border-bottom border-[rgba(201,168,76,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.4)]">
         <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onMenuToggle}
              className="p-2 -ml-2 text-white/60 hover:text-[#C9A84C] transition-colors"
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col">
              <div 
                className="text-base font-[800] tracking-[0.08em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #C9A84C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                QRATOS.AI
              </div>
              <span className="text-[9px] font-[600] tracking-[0.2em] text-[#C9A84C]/70 uppercase">CONVERSION ENGINE</span>
            </div>
         </div>

         <div className="flex items-center gap-3 md:gap-4">
           <button 
             type="button"
             onClick={onGoHome}
             className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-[10px] text-[10px] font-bold text-white/70 uppercase tracking-[0.12em] bg-white/5 border border-white/10 backdrop-blur-[8px] hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/30 hover:text-[#C9A84C] transition-all"
           >
             <LayoutDashboard size={14} />
             <span>Landing Control</span>
           </button>
           
           <div 
             className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C9A84C]/30 shadow-[0_0_12px_rgba(201,168,76,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] bg-gradient-to-br from-[#C9A84C]/15 to-[#C9A84C]/06"
             style={{ animation: 'pulseGold 3s ease-in-out infinite' }}
           >
             <span className="text-xs font-bold text-[#C9A84C] tracking-[0.05em]">{remainingCredits} CREDITS</span>
           </div>
         </div>

         {/* Gold Shimmer Line */}
         <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/60 via-[#FFDC78]/80 via-[#C9A84C]/60 to-transparent" />
      </header>

      {/* SECTION NINE — MAIN SCROLL AREA */}
      <div className="flex-1 overflow-y-auto pt-[64px] pb-[140px] px-4 custom-scrollbar scroll-smooth relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Neural Context Summary - Collapsible Label Section */}
          {messages.length > 0 && (
            <div className="mb-4">
              <button 
                type="button"
                onClick={() => setIsContextExpanded(!isContextExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all border-dashed group"
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit size={14} className={`transition-colors ${isContextExpanded ? "text-[#C9A84C]" : "text-[#C9A84C]/60"}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]/60 group-hover:text-[#C9A84C] transition-colors">Neural Brief Active</span>
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
                          <span className="text-[9px] font-bold text-[#C9A84C]/70 uppercase tracking-widest">Raw Briefing Context</span>
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

          {messages.length === 0 && !loadingHistory && (
            <div className="flex flex-col items-center">
              
              {/* SECTION THREE — TOOL CARD SYSTEM WITH MOUSE TRACKING */}
              <div className="grid grid-cols-2 gap-[12px] w-full mt-20 px-4">
                {[
                  { icon: Mail, title: "Emails", desc: "Sequence Architect", delay: 0 },
                  { icon: Target, title: "Ads", desc: "Facebook/IG Hooks", delay: 0.08 },
                  { icon: FileText, title: "Pages", desc: "Sales Landing Pages", delay: 0.16 },
                  { icon: Zap, title: "Psych", desc: "Behavioral Triggers", delay: 0.24 }
                ].map((item, i) => (
                  <Card3D 
                    key={i}
                    delay={item.delay}
                    onClick={() => {
                      if (remainingCredits > 0) {
                        setInputValue(`Brief me on ${item.title.toLowerCase()} for `);
                        inputRef.current?.focus();
                      }
                    }}
                  >
                    {/* Top light line */}
                    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 via-white/50 via-[#C9A84C]/50 to-transparent z-[1]" />
                    {/* Ambient Glow */}
                    <div className="absolute -top-[40px] -right-[40px] w-[100px] h-[100px] bg-radial-gradient from-[#C9A84C]/12 to-transparent pointer-events-none z-0" />
                    
                    {/* SECTION FOUR — FLOATING ICON ANIMATION */}
                    <div 
                      className="card-icon-container relative z-10 w-[44px] h-[44px] rounded-[12px] bg-gradient-to-br from-[#C9A84C]/18 to-[#C9A84C]/06 border border-[#C9A84C]/25 flex items-center justify-center mb-[14px] shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    >
                      <item.icon size={20} className="text-[#C9A84C]" />
                    </div>
                    
                    <span style={{ transform: 'translateZ(15px)' }} className="relative z-10 text-[15px] font-[700] text-white/92 tracking-tight mb-1 block">{item.title}</span>
                    <span style={{ transform: 'translateZ(10px)' }} className="relative z-10 text-[12px] font-[400] text-white/40 tracking-tight block">{item.desc}</span>
                  </Card3D>
                ))}
              </div>

              {/* SECTION KEY — WELCOME TEXT ANIMATED */}
              <div className="mt-8 flex flex-col items-center">
                <div className="welcome-heading">
                  {['WELCOME', 'TO', 'THE', 'FRONTIER'].map((word, i) => (
                    <motion.span
                      key={word + i}
                      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.7,
                        delay: 0.3 + (i * 0.12),
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      style={{ display: 'inline-block', marginRight: '0.25em' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: [0.23, 1, 0.32, 1] }}
                  className="welcome-subtitle"
                >
                  Optimized for elite persuasion, high-stakes funnels, and psychology-driven growth.
                </motion.p>
              </div>
            </div>
          )}

          {loadingHistory && (
            <div className="flex flex-col items-center justify-center pt-20">
              <div className="flex gap-[6px] items-center p-4">
                 <div className="w-[8px] h-[8px] rounded-full bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.6)]" style={{ animation: 'dotPulse 1.4s ease-in-out 0s infinite' }} />
                 <div className="w-[8px] h-[8px] rounded-full bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.6)]" style={{ animation: 'dotPulse 1.4s ease-in-out 0.2s infinite' }} />
                 <div className="w-[8px] h-[8px] rounded-full bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.6)]" style={{ animation: 'dotPulse 1.4s ease-in-out 0.4s infinite' }} />
              </div>
              <span className="text-[10px] text-[#C9A84C] font-black tracking-widest uppercase mt-4">Restoring Link...</span>
            </div>
          )}

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
                <div className={m.role === "user" ? "user-bubble" : "ai-bubble relative group pr-11"}>
                  {m.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => handleCopy(m.content, m.timestamp || i)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 z-20 flex items-center justify-center"
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
                  {m.role === "assistant" && i > 0 && messages[i-1].role === "user" && (
                    <div className="mb-4 pb-3 border-b border-white/5 flex flex-col gap-1.5 opacity-60">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#C9A84C] animate-pulse" />
                        <span className="text-[8px] font-black text-[#C9A84C] uppercase tracking-[0.2em]">Contextual Recall</span>
                      </div>
                      <div className="text-[10px] text-white/40 italic line-clamp-1 border-l border-[#C9A84C]/30 pl-3">
                        {messages[i-1].content}
                      </div>
                    </div>
                  )}
                  <div className={`prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-[#C9A84C] ${m.role === 'user' ? 'prose-p:text-white' : 'prose-p:text-gray-300'}`}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start mb-6 relative z-10"
              >
                <LoadingBubble />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} style={{ height: 1 }} />
        </div>
      </div>

      {/* SECTION FIVE — BOTTOM INPUT BAR REDESIGN */}
      <footer className="input-bar-container fixed bottom-0 left-0 right-0 z-[100] bg-gradient-to-b from-[#08070E]/85 via-[#08070E]/97 to-[#06050A] backdrop-blur-[24px] saturate-[200%] border-t border-[rgba(201,168,76,0.12)] p-[12px_16px_20px] pb-[max(20px,env(safe-area-inset-bottom))]">
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 via-[#FFDC78]/60 via-[#C9A84C]/40 to-transparent" />
        
        <div className="max-w-2xl mx-auto">
          {/* Tab Row */}
          <div className="flex gap-2 mb-[10px] overflow-x-auto no-scrollbar scrollbar-hide py-1">
            {toolButtons.map(tool => (
              <button
                type="button"
                key={tool.id}
                onClick={() => {
                  if (remainingCredits > 0) {
                    setInputValue(tool.prompt);
                    inputRef.current?.focus();
                  }
                }}
                className={`flex items-center gap-[6px] px-[14px] py-[6px] rounded-full border text-[11px] font-[600] tracking-[0.10em] whitespace-nowrap transition-all duration-300 ${
                  inputValue.startsWith(tool.prompt)
                  ? "bg-gradient-to-br from-[#C9A84C]/18 to-[#C9A84C]/06 border-[#C9A84C]/35 text-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.12)]"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/8 hover:text-white/75 hover:border-white/15"
                }`}
              >
                <tool.icon size={13} className={inputValue.startsWith(tool.prompt) ? "text-[#C9A84C] drop-shadow-[0_0_4px_rgba(201,168,76,0.8)]" : "text-white/40"} />
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
            {/* SECTION NINE — INPUT BAR GLOW ON FOCUS */}
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
              placeholder="Input persuasion brief..."
              disabled={isLoading || remainingCredits <= 0}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck="false"
              className="flex-1 bg-white/5 border border-white/10 rounded-[16px] p-[14px_18px] text-white/90 outline-none backdrop-blur-[8px] transition-all focus:border-[#C9A84C]/35 focus:bg-white/7 placeholder:text-white/30"
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
              onClick={handleSend}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleSend();
              }}
              disabled={isLoading || !inputValue.trim()}
              className="w-[48px] h-[48px] rounded-[14px] bg-gradient-to-br from-[#C9A84C] to-[#A8882E] flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer"
              style={{
                pointerEvents: isLoading ? 'none' : 'all',
                opacity: (!inputValue.trim() && !isLoading) ? 0.5 : 1,
                position: 'relative',
                zIndex: 10,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
              aria-label="Send message"
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
