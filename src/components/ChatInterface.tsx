import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Wand2, Copy, Check, RotateCcw, ArrowRight, BrainCircuit, Coins } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { auth } from "../lib/firebase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  user: any;
  userData: any;
  activeTab: string;
}

export function ChatInterface({ user, userData, activeTab }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [remainingCredits, setRemainingCredits] = useState(userData?.remainingCredits ?? 20);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || remainingCredits <= 0) return;

    const userMessage: Message = { role: "user", content: input };
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

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Generation failed");
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
                assistantContent += parsed.text;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                });
              } catch (e) {}
            }
          }
        }
      }

      setRemainingCredits(prev => prev - 1);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: `**Error:** ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0B] relative">
      {/* Top Bar Info */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-8 z-10 bg-gradient-to-b from-[#0A0A0B] to-transparent pointer-events-none sticky top-0 md:absolute">
        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
           <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-[11px] font-mono text-gray-400">
             <Coins size={12} className="text-yellow-500" />
             <span className="hidden sm:inline">{remainingCredits} CREDITS LEFT</span>
             <span className="sm:hidden">{remainingCredits}CR</span>
           </div>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-2 md:px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] md:text-[11px] font-mono text-purple-400">
            <span className="hidden sm:inline">CLAUDE-3-FLASH ENGINE</span>
            <span className="sm:hidden">ENGINE v3</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 md:pt-20 pb-40 px-4">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center pt-20 md:pt-32 text-center"
            >
              <div className="relative group mb-10">
                <div className="absolute inset-0 bg-[#FFB52E]/20 rounded-[40px] blur-3xl animate-pulse" />
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] bg-black border border-[#FFB52E]/30 flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-110">
                  <BrainCircuit size={48} className="text-[#FFB52E]" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent px-4">
                What shall we engineer today?
              </h2>
              <p className="text-gray-500 max-w-xl text-lg md:text-xl px-6 leading-relaxed mb-16 font-medium">
                Optimized for elite persuasion, high-stakes funnels, and psychology-driven revenue growth.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                 {[
                   { label: "Predictive Email Sequence", icon: Mail },
                   { label: "High-Ticket Funnel Architect", icon: Target },
                   { label: "Direct Response Sales Page", icon: FileText },
                   { label: "Behavioral Hook Generator", icon: Zap },
                 ].map((opt, i) => (
                   <motion.button
                     key={opt.label}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 + i * 0.1 }}
                     onClick={() => {
                        setInput(opt.label);
                        handleSend();
                     }}
                     className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-[#FFB52E]/5 hover:border-[#FFB52E]/30 transition-all group text-left"
                   >
                     <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#FFB52E] transition-all">
                        <opt.icon size={18} className="text-[#FFB52E] group-hover:text-black transition-colors" />
                     </div>
                     <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{opt.label}</span>
                   </motion.button>
                 ))}
              </div>
            </motion.div>
          )}

          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} group relative`}
            >
              <div className={`max-w-[95%] md:max-w-[85%] rounded-[32px] px-6 md:px-8 py-5 md:py-7 ${
                m.role === "user" 
                ? "bg-[#111111] border border-white/10 text-white shadow-xl" 
                : "bg-white/[0.03] border border-[#FFB52E]/10 text-gray-100 shadow-2xl glass-card relative overflow-hidden"
              }`}>
                {m.role === "assistant" && (
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#FFB52E] font-black tracking-widest uppercase">
                        <BrainCircuit size={14} />
                        QRATOS PERSUASION ENGINE
                      </div>
                      <div className="text-[9px] font-mono text-gray-600">v1.4.2 PREMIUM</div>
                   </div>
                )}
                
                <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none text-sm md:text-base font-medium">
                   <div className="markdown-body">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                   </div>
                </div>

                {m.role === "assistant" && m.content && (
                   <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => copyToClipboard(m.content, i)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                      >
                         {copiedIndex === i ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                         {copiedIndex === i ? "Copied" : "Copy Output"}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white">
                         <Zap size={12} className="text-[#FFB52E]" />
                         Refine Persuasion
                      </button>
                   </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && messages[messages.length-1]?.role === "user" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gradient-to-br from-[#FFB52E]/5 to-transparent border border-[#FFB52E]/20 rounded-[32px] p-6 px-10 flex items-center gap-6 shadow-2xl relative overflow-hidden glass-card">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFB52E]/5 to-transparent animate-[pulse_3s_infinite]" />
                <div className="relative">
                   <div className="absolute inset-0 bg-[#FFB52E] rounded-full blur-xl opacity-20 animate-pulse" />
                   <div className="w-12 h-12 rounded-2xl bg-black border border-[#FFB52E]/30 flex items-center justify-center relative z-10">
                      <BrainCircuit size={24} className="text-[#FFB52E] animate-pulse" />
                   </div>
                </div>
                <div className="flex flex-col gap-2 relative z-10">
                   <span className="text-[11px] font-mono text-[#FFB52E] tracking-[0.4em] font-black uppercase">Synthesizing Persuasion Architecture...</span>
                   <div className="flex gap-2">
                      {[0, 0.2, 0.4].map((delay) => (
                        <motion.div 
                          key={delay}
                          animate={{ height: [4, 12, 4], opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay }}
                          className="w-1 bg-[#FFB52E]/50 rounded-full" 
                        />
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Area - Metallic & Premium */}
      <div className="absolute bottom-6 md:bottom-12 left-0 right-0 px-4 md:px-8 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-12">
        <div className="max-w-3xl mx-auto group">
          <motion.div 
            whileFocus={{ scale: 1.01 }}
            className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-1 shadow-[0_0_50px_-20px_rgba(0,0,0,0.8)] focus-within:border-[#FFB52E]/30 focus-within:shadow-[0_0_60px_-15px_rgba(255,181,46,0.1)] transition-all duration-500 overflow-hidden"
          >
            <div className="flex items-end gap-3 p-3">
               <button className="p-3 text-gray-600 hover:text-[#FFB52E] transition-all hover:scale-110">
                  <Wand2 size={22} />
               </button>
               <textarea
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message Qratos AI..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white resize-none max-h-60 custom-scrollbar py-2"
                disabled={isTyping}
               />
               <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping || remainingCredits <= 0}
                className={`p-4 rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 ${
                  input.trim() && !isTyping && remainingCredits > 0
                  ? "bg-white text-black hover:bg-[#FFB52E]"
                  : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
               >
                 <ArrowRight size={22} strokeWidth={2.5} />
               </button>
            </div>
            
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-white/5 bg-[#080808]/50 backdrop-blur-md rounded-b-[22px]">
               <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                     <Sparkles size={12} className="text-[#FFB52E]" />
                     Elite Mode Alpha
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                     <Target size={12} className="text-[#FFB52E]" />
                     Psychology Tuned
                  </div>
               </div>
               <div className="hidden sm:block text-[9px] text-gray-700 font-mono font-bold tracking-widest uppercase">
                  Press CMD+ENTER to Synthesize
               </div>
            </div>
          </motion.div>
          
          <p className="text-center text-[10px] text-gray-600 mt-6 tracking-widest uppercase font-black">
            Hyper-Specialized Copywriting OS • Engine v1.4.2
          </p>
        </div>
      </div>
    </div>
  );
}
