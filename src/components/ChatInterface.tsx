import { useState, useRef, useEffect } from "react";
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
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot, setDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

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
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(userData?.remainingCredits ?? 400);

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
  }, [messages, isTyping]);

  const handleSend = async (customInput?: string) => {
    const textToSend = (customInput || input).trim();
    if (!textToSend || isTyping || remainingCredits <= 0) return;

    // Use a persistent guest ID if not authenticated
    const effectiveUid = user?.uid || `guest_${localStorage.getItem('qratos_guest_id') || (() => {
      const gId = Math.random().toString(36).substring(2, 11);
      localStorage.setItem('qratos_guest_id', gId);
      return gId;
    })()}`;

    try {
      setIsTyping(true);
      
      const userMessage: Message = { 
        role: "user", 
        content: textToSend,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      
      let currentSessionId = activeSessionId;
      if (!currentSessionId) {
        try {
          // Only attempt Firestore doc creation if we have a real user, 
          // otherwise just generate a local random ID for the session
          if (user) {
            const sessionRef = doc(collection(db, "chats", user.uid, "sessions"));
            currentSessionId = sessionRef.id;
          } else {
            currentSessionId = `local_${Date.now()}`;
          }
          onSessionChange?.(currentSessionId);
        } catch (e) {
          console.error("Session creation error:", e);
          currentSessionId = `temp_${Date.now()}`;
        }
      }

      const token = await auth.currentUser?.getIdToken().catch(() => null);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId: currentSessionId,
          stream: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Connection failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        setMessages(prev => [...prev, { role: "assistant", content: "" }]);
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  assistantContent += parsed.text;
                  setMessages(prev => {
                    if (prev.length === 0) return prev;
                    const last = prev[prev.length - 1];
                    return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                  });
                }
              } catch (e) {}
            }
          }
        }
      }

      // Sync to Firestore only after successful stream to avoid partial/broken sessions
      try {
        if (user) {
          const finalMessages = [...messages, userMessage, { 
            role: "assistant", 
            content: assistantContent,
            timestamp: new Date().toISOString()
          }];
          
          const sessionRef = doc(db, "chats", user.uid, "sessions", currentSessionId);
          const updateData: any = {
            messages: finalMessages,
            lastUpdated: new Date().toISOString()
          };

          if (messages.length === 0) {
            updateData.title = textToSend.length > 40 ? textToSend.substring(0, 40) + "..." : textToSend;
          }

          await setDoc(sessionRef, updateData, { merge: true });
        }
        setRemainingCredits(prev => Math.max(0, prev - 1));
      } catch (fbError) {
        console.error("Firestore persistence error:", fbError);
        // We still have the messages in local state, so the user can continue
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Neural link lost. Your credits were preserved. Please check your data connection and re-brief me." 
      }]);
    } finally {
      setIsTyping(false);
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
              
              {/* SECTION THREE — TOOL CARD GRID */}
              <div className="grid grid-cols-2 gap-[12px] w-full mt-20 px-4">
                {[
                  { icon: Mail, title: "Emails", desc: "Sequence Architect", delay: '0.0s' },
                  { icon: Target, title: "Ads", desc: "Facebook/IG Hooks", delay: '0.08s' },
                  { icon: FileText, title: "Pages", desc: "Sales Landing Pages", delay: '0.16s' },
                  { icon: Zap, title: "Psych", desc: "Behavioral Triggers", delay: '0.24s' }
                ].map((item, i) => (
                  <button 
                    type="button"
                    key={i}
                    onClick={(e) => {
                      const btn = e.currentTarget;
                      btn.style.animation = 'none';
                      void btn.offsetWidth; // trigger reflow
                      btn.style.animation = 'cardPress 0.2s ease forwards';
                      if (remainingCredits > 0) {
                        setInput(`Brief me on ${item.title.toLowerCase()} for `);
                        inputRef.current?.focus();
                      }
                    }}
                    style={{ 
                      animation: `fadeInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${item.delay} both`,
                      background: `linear-gradient(145deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(201, 168, 76, 0.05) 100%)`
                    }}
                    className="relative flex flex-col items-start p-[18px_16px] min-h-[120px] rounded-[20px] backdrop-blur-[20px] saturate-[160%] border border-white/5 border-t-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_1px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] group overflow-hidden"
                  >
                    {/* Top light line */}
                    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 via-white/50 via-[#C9A84C]/50 to-transparent z-[1]" />
                    {/* Ambient Glow */}
                    <div className="absolute -top-[40px] -right-[40px] w-[100px] h-[100px] bg-radial-gradient from-[#C9A84C]/12 to-transparent pointer-events-none z-0" />
                    
                    <div className="relative z-10 w-[44px] h-[44px] rounded-[12px] bg-gradient-to-br from-[#C9A84C]/18 to-[#C9A84C]/06 border border-[#C9A84C]/25 flex items-center justify-center mb-[14px] shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <item.icon size={20} className="text-[#C9A84C]" style={{ filter: 'drop-shadow(0 0 6px rgba(201, 168, 76, 0.7))' }} />
                    </div>
                    
                    <span className="relative z-10 text-[15px] font-[700] text-white/92 tracking-tight mb-1">{item.title}</span>
                    <span className="relative z-10 text-[12px] font-[400] text-white/40 tracking-tight">{item.desc}</span>
                    
                    {/* Hover styles controlled via Tailwind and complex selectors or just simple transition-all */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/04 to-[#C9A84C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                ))}
              </div>

              {/* SECTION FOUR — WELCOME TEXT REDESIGN */}
              <div 
                style={{ animation: 'fadeInScale 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.1s both' }}
                className="mt-6 flex flex-col items-center"
              >
                <h2 
                  className="text-[28px] font-[900] tracking-[-0.02em] leading-[1.1] text-center px-5 mb-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 40%, rgba(201, 168, 76, 0.9) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(201, 168, 76, 0.15))'
                  }}
                >
                  WELCOME TO THE FRONTIER
                </h2>
                <p className="text-white/40 text-[14px] font-[400] leading-[1.6] text-center px-8 tracking-tight max-w-sm">
                  Optimized for elite persuasion, high-stakes funnels, and psychology-driven growth.
                </p>
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
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-6 last:mb-0`}
              >
                <div className={`max-w-[92%] rounded-2xl px-5 py-4 ${
                  m.role === "user" 
                  ? "bg-gradient-to-br from-white/10 to-transparent border border-[rgba(201,168,76,0.2)] text-white shadow-[0_4px_24px_rgba(0,0,0,0.3)]" 
                  : "bg-[#111111]/80 backdrop-blur-xl border border-white/5 text-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.02)]"
                }`}>
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
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
                <div className="flex gap-[6px] items-center">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.6)]" style={{ animation: 'dotPulse 1.4s ease-in-out 0s infinite' }} />
                  <div className="w-[8px] h-[8px] rounded-full bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.6)]" style={{ animation: 'dotPulse 1.4s ease-in-out 0.2s infinite' }} />
                  <div className="w-[8px] h-[8px] rounded-full bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.6)]" style={{ animation: 'dotPulse 1.4s ease-in-out 0.4s infinite' }} />
                </div>
                <span className="text-[10px] text-[#C9A84C] font-black tracking-widest uppercase">SYNERGIZING...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
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
                    setInput(tool.prompt);
                    inputRef.current?.focus();
                  }
                }}
                className={`flex items-center gap-[6px] px-[14px] py-[6px] rounded-full border text-[11px] font-[600] tracking-[0.10em] whitespace-nowrap transition-all duration-300 ${
                  input.startsWith(tool.prompt)
                  ? "bg-gradient-to-br from-[#C9A84C]/18 to-[#C9A84C]/06 border-[#C9A84C]/35 text-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.12)]"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/8 hover:text-white/75 hover:border-white/15"
                }`}
              >
                <tool.icon size={13} className={input.startsWith(tool.prompt) ? "text-[#C9A84C] drop-shadow-[0_0_4px_rgba(201,168,76,0.8)]" : "text-white/40"} />
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
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              disabled={isTyping || remainingCredits <= 0}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Input persuasion brief..."
              className="flex-1 bg-white/5 border border-white/10 rounded-[16px] p-[14px_18px] text-[15px] text-white/90 outline-none backdrop-blur-[8px] transition-all focus:border-[#C9A84C]/35 focus:bg-white/7 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08),inset_0_1px_0_rgba(255,255,255,0.06)] placeholder:text-white/30 resize-none max-h-32"
              style={{ minHeight: '48px' }}
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping || remainingCredits <= 0}
              className="w-[48px] h-[48px] rounded-[14px] bg-gradient-to-br from-[#C9A84C] to-[#A8882E] flex items-center justify-center transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(201,168,76,0.45),0_4px_10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] active:translate-y-0 active:scale-95 shadow-[0_4px_16px_rgba(201,168,76,0.35),0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.20)] shrink-0"
            >
              <ArrowUp size={20} className="text-black/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" strokeWidth={3} />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
