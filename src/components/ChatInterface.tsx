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
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100dvh");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard Handling for Section 5
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(`${window.visualViewport.height}px`);
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);
    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
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
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping || remainingCredits <= 0) return;

    const userMessage: Message = { 
      role: "user", 
      content: textToSend,
      timestamp: new Date().toISOString()
    };
    
    // Determine active session ID or create new
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = doc(collection(db, "chats", user.uid, "sessions")).id;
      onSessionChange?.(currentSessionId);
    }

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          stream: true
        })
      });

      if (!response.ok) throw new Error("Connection failed");

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
                    const last = prev[prev.length - 1];
                    return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                  });
                }
              } catch (e) {}
            }
          }
        }
      }

      // Sync to Firestore
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

      // Set title if it's the first message
      if (messages.length === 0) {
        updateData.title = textToSend.length > 40 ? textToSend.substring(0, 40) + "..." : textToSend;
      }

      await setDoc(sessionRef, updateData, { merge: true });

      setRemainingCredits(prev => Math.max(0, prev - 1));
    } catch (error: any) {
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
      className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden font-sans"
      style={{ height: viewportHeight }}
    >
      {/* MOBILE HEADER - Section 5 & 6 */}
      <header className="flex-shrink-0 min-h-[80px] pt-10 flex items-end justify-between px-6 pb-4 z-50 bg-[#050505]/80 border-b border-white/5 backdrop-blur-3xl sticky top-0">
         <div className="flex items-center gap-3">
            <button 
              onClick={onMenuToggle}
              className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-[#FFB52E] transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFB52E] to-[#E2A72E] flex items-center justify-center shadow-[0_0_20px_-5px_rgba(255,181,46,0.6)]">
               <BrainCircuit size={22} className="text-black" />
            </div>
            <div className="flex flex-col">
              <div className="tracking-tighter text-base leading-none text-white italic">
                <span className="font-black">QRATOS</span>
                <span className="font-extralight opacity-60">.AI</span>
              </div>
              <span className="text-[9px] font-sans text-[#FFB52E]/80 tracking-[0.3em] uppercase font-bold">CONVERSION ENGINE</span>
            </div>
         </div>

         <div className="flex items-center gap-4">
           <button 
             onClick={onGoHome}
             className="flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FFB52E]/30 transition-all group"
           >
             <LayoutDashboard size={14} className="text-gray-500 group-hover:text-[#FFB52E] transition-colors" />
             <span>Landing Control</span>
           </button>
           
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFB52E]/5 border border-[#FFB52E]/30 shadow-[0_0_20px_rgba(255,181,46,0.05)] hover:shadow-[0_0_25px_rgba(255,181,46,0.15)] transition-all">
             <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FFB52E] to-[#E2A72E] flex items-center justify-center shadow-[0_0_8px_rgba(255,181,46,0.6)] border border-[#FFB52E]/50">
               <Coins size={11} className="text-black" />
             </div>
             <span className="text-[11px] font-black text-[#FFB52E] uppercase tracking-wider">{remainingCredits} CREDITS</span>
           </div>
         </div>
      </header>

      {/* CHAT DISPLAY - Section 5 */}
      <div className="flex-1 overflow-y-auto pt-6 pb-48 px-4 custom-scrollbar scroll-smooth">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.length === 0 && !loadingHistory && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center pt-12 pb-8 text-center"
            >
              {/* BENTO GRID WELCOME - Section 5 */}
              <div className="grid grid-cols-2 gap-3 w-full mb-12">
                {[
                  { icon: Mail, title: "Emails", desc: "Sequence Architect", prompt: "Build an email sequence for..." },
                  { icon: Target, title: "Ads", desc: "Facebook/IG Hooks", prompt: "Write ad hooks for..." },
                  { icon: FileText, title: "Pages", desc: "Sales Landing Pages", prompt: "Draft a sales page for..." },
                  { icon: Zap, title: "Psych", desc: "Behavioral Triggers", prompt: "Analyze triggers for..." }
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      if (remainingCredits > 0) {
                        setInput(item.prompt);
                        inputRef.current?.focus();
                      }
                    }}
                    className="flex flex-col items-start p-4 bg-[#0A0A0A] border border-white/10 rounded-2xl text-left hover:border-[#FFB52E]/40 transition-all active:scale-95 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFB52E]/10 flex items-center justify-center mb-3 group-hover:bg-[#FFB52E] transition-colors">
                      <item.icon size={16} className="text-[#FFB52E] group-hover:text-black" />
                    </div>
                    <span className="text-xs font-bold text-white mb-1">{item.title}</span>
                    <span className="text-[10px] text-gray-500">{item.desc}</span>
                  </button>
                ))}
              </div>

              <h2 className="text-3xl font-black italic tracking-tighter text-white mb-3">
                WELCOME TO THE FRONTIER
              </h2>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed font-medium">
                Optimized for elite persuasion, high-stakes funnels, and psychology-driven growth.
              </p>
            </motion.div>
          )}

          {loadingHistory && (
            <div className="flex flex-col items-center justify-center pt-20">
              <div className="w-10 h-10 border-2 border-[#FFB52E]/20 border-t-[#FFB52E] rounded-full animate-spin" />
              <span className="text-[10px] text-[#FFB52E] font-black tracking-widest uppercase mt-4">Restoring Link...</span>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[88%] rounded-2xl px-5 py-4 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,181,46,0.1)] ${
                  m.role === "user" 
                  ? "bg-transparent border border-[#FFB52E]/30 text-white shadow-[0_4px_20px_rgba(255,181,46,0.05)] hover:border-[#FFB52E]/60" 
                  : "bg-[#111111]/80 backdrop-blur-xl border border-white/5 text-gray-200 shadow-[0_0_30px_rgba(255,181,46,0.05)] hover:border-white/10"
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-[#FFB52E] prose-p:text-gray-300">
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
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
                <div className="flex gap-1.5">
                  <motion.div animate={{ opacity:[0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 h-1.5 rounded-full bg-[#FFB52E]" />
                  <motion.div animate={{ opacity:[0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#FFB52E]" />
                  <motion.div animate={{ opacity:[0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#FFB52E]" />
                </div>
                <span className="text-[10px] text-[#FFB52E] font-black tracking-widest uppercase">SYNERGIZING...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* INPUT BAR - Section 5 & 6 */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div className="max-w-2xl mx-auto px-4 pb-12">
          <div className="relative bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,1)] overflow-hidden group transition-all duration-500 focus-within:border-[#FFB52E]/60 focus-within:shadow-[0_0_80px_rgba(255,181,46,0.15)]">
            {/* Animated Golden Rim Glow */}
            <div className="absolute inset-x-0 -top-px h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E]/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            
            <div className="flex flex-col">
              {/* Tool Buttons Bar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-black/40 backdrop-blur-md">
                {toolButtons.map(tool => (
                  <button
                    key={tool.id}
                    disabled={remainingCredits <= 0}
                    onClick={() => {
                      setInput(tool.prompt);
                      inputRef.current?.focus();
                    }}
                    className={`flex flex-1 items-center justify-center gap-1.5 py-2 transition-all duration-300 rounded-xl hover:scale-105 active:scale-95 group/tool ${
                      remainingCredits <= 0 ? "opacity-30 cursor-not-allowed" : "text-[#FFB52E]/60 hover:text-[#FFB52E] hover:bg-white/5"
                    }`}
                  >
                    <tool.icon size={14} className="group-hover/tool:rotate-12 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{tool.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 p-2 px-4">
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
                  placeholder={remainingCredits <= 0 ? "Upgrade to continue..." : "Input persuasion brief..."}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-gray-600 py-3 outline-none resize-none max-h-32"
                  style={{ minHeight: '44px' }}
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping || remainingCredits <= 0}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() && !isTyping && remainingCredits > 0
                    ? "bg-[#FFB52E] text-black shadow-[0_0_20px_rgba(255,181,46,0.5)] scale-100 active:scale-95"
                    : "bg-white/5 text-gray-700"
                  }`}
                >
                  <ArrowUp size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Visibility Viewport Fix */}
      <style>{`
        @media (max-height: 500px) {
          .pb-48 { padding-bottom: 24px !important; }
        }
      `}</style>
    </div>
  );
}
