import { useState, useEffect } from "react";
import { BrainCircuit, MessageSquare, Plus, Settings, User as UserIcon, LogOut, LayoutDashboard, History, Sparkles, Target, Mic, Mail, FileText, Globe, Search, X, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

interface SidebarProps {
  user: any;
  userData: any;
  activeTab: string;
  activeSessionId?: string;
  onTabChange: (tab: string) => void;
  onSessionSelect: (sessionId: string) => void;
  onLogout: () => void;
  onShowAdmin: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ user, userData, activeTab, activeSessionId, onTabChange, onSessionSelect, onLogout, onShowAdmin, isOpen, onClose }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch Session History (Last 20)
  useEffect(() => {
    if (!user) return;
    setLoadingHistory(true);
    const sessionsRef = collection(db, "chats", user.uid, "sessions");
    const q = query(sessionsRef, orderBy("lastUpdated", "desc"), limit(20));

    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(items);
      setLoadingHistory(false);
    }, (err) => {
      console.error("Sidebar history sync error:", err);
      setLoadingHistory(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredHistory = history.filter(item => {
    if (!searchQuery) return true;
    const title = item.title || item.messages?.[0]?.content || "Archive Entry";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getSessionTitle = (session: any) => {
    if (session.title) return session.title;
    const firstMsg = session.messages?.[0]?.content || "";
    if (!firstMsg) return "New Session";
    // Generate concise title: first 40 chars
    return firstMsg.length > 40 ? firstMsg.substring(0, 40) + "..." : firstMsg;
  };

  const menuItems = [
    { id: "chat", icon: MessageSquare, label: "Neural Engine" },
    { id: "history", icon: History, label: "Archive" },
    { id: "settings", icon: Settings, label: "Tuning" },
  ];

  const categories = [
    { id: "landing", icon: LayoutDashboard, label: "Landing Pages" },
    { id: "funnels", icon: Target, label: "Conversion Funnels" },
    { id: "emails", icon: Mail, label: "Email Sequences" },
    { id: "vsl", icon: Mic, label: "VSL Scripts" },
  ];

  const filteredCategories = categories.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-[4px] z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`
        fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] h-screen
        background-gradient from-[#0A0812]/98 to-[#07060D]/99 
        border-r border-[rgba(201,168,76,0.12)] shadow-[4px_0_40px_rgba(0,0,0,0.6),1px_0_0_rgba(201,168,76,0.08)] backdrop-blur-[30px]
        flex flex-col transition-transform duration-[0.35s] cubic-bezier(0.23,1,0.32,1) lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      style={{
        background: 'linear-gradient(180deg, rgba(10, 8, 18, 0.98) 0%, rgba(7, 6, 13, 0.99) 100%)'
      }}>
        {/* Sidebar Header Area */}
        <div className="p-[20px_20px_16px] border-b border-white/06 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-[44px] h-[44px] rounded-[12px] bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/08 border border-[#C9A84C]/25 shadow-[0_0_20px_rgba(201,168,76,0.12)] flex items-center justify-center">
                <BrainCircuit size={22} className="text-[#C9A84C]" />
             </div>
             <div className="flex flex-col">
                <div 
                  className="text-[17px] font-[800] tracking-[0.06em] uppercase"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #C9A84C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  QRATOS.AI
                </div>
                <span className="text-[9px] font-[600] tracking-[0.22em] text-[#C9A84C]/65 uppercase">PERSUASION OS</span>
             </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="lg:hidden w-[28px] h-[28px] rounded-[8px] bg-white/5 border border-white/08 flex items-center justify-center text-white/35 hover:text-white/80 hover:bg-white/9 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Universal Search */}
        <div className="m-[16px] bg-white/5 border border-white/08 rounded-[12px] p-[10px_14px] flex items-center gap-[10px] transition-all focus-within:border-[#C9A84C]/30 focus-within:bg-white/7">
          <Search size={14} className="text-white/25" />
          <input 
            type="text"
            placeholder="Universal Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none p-0 focus:ring-0 text-[14px] text-white/75 placeholder:text-white/25 outline-none flex-1"
          />
        </div>

        {/* Neural Logic Button Area */}
        <div className="px-4 mb-5">
           <button
             type="button"
             onClick={() => {
               onSessionSelect("");
               onTabChange("chat");
               onClose?.();
             }}
             className="w-full bg-gradient-to-br from-[#C9A84C] to-[#B8922A] rounded-[14px] p-[14px_16px] flex items-center gap-[12px] shadow-[0_4px_20px_rgba(201,168,76,0.30),0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.20)] group transition-all duration-[0.25s] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(201,168,76,0.40),inset_0_1px_0_rgba(255,255,255,0.25)]"
           >
             <div className="w-[32px] h-[32px] rounded-[10px] bg-black/20 flex items-center justify-center text-black/80">
               <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
             </div>
             <div className="flex flex-col items-start leading-tight">
               <span className="text-[13px] font-[700] tracking-[0.08em] text-black/85 uppercase">New Neural Logic</span>
               <span className="text-[11px] text-black/55 font-[400] tracking-[0.02em]">Initialize fresh session</span>
             </div>
           </button>
        </div>

        {/* Nav Sections */}
        <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-hide">
          
          {/* CORE SYSTEMS */}
          <div className="mb-6">
            <h3 className="text-[10px] font-[700] tracking-[0.18em] text-white/25 uppercase px-[20px] mb-[8px]">Core Systems</h3>
            <div className="space-y-[2px]">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose?.();
                  }}
                  className={`flex items-center gap-[12px] w-full p-[11px_20px] transition-all duration-200 relative group ${
                    activeTab === item.id 
                    ? "bg-gradient-to-r from-[#C9A84C]/12 to-[#C9A84C]/03" 
                    : "hover:bg-white/04"
                  }`}
                >
                  {activeTab === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.8),0_0_16px_rgba(201,168,76,0.4)]" />
                  )}
                  <item.icon size={18} className={`transition-colors ${
                    activeTab === item.id ? "text-[#C9A84C] drop-shadow-[0_0_6px_rgba(201,168,76,0.6)]" : "text-white/35 group-hover:text-white/70"
                  }`} />
                  <span className={`text-[14px] transition-colors ${
                    activeTab === item.id ? "text-[#C9A84C] font-[600]" : "text-white/55 font-[500] group-hover:text-white/85"
                  }`}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="m-[12px_20px] h-[1px] bg-gradient-to-r from-transparent via-white/06 to-transparent" />

          {/* SPECIALIZED AGENTS */}
          <div className="mb-6">
            <h3 className="text-[10px] font-[700] tracking-[0.18em] text-white/25 uppercase px-[20px] mb-[8px]">Specialized Agents</h3>
            <div className="space-y-[2px]">
              {filteredCategories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose?.();
                  }}
                  className={`flex items-center gap-[12px] w-full p-[11px_20px] transition-all duration-200 group ${
                    activeTab === item.id 
                    ? "bg-gradient-to-r from-[#C9A84C]/12 to-[#C9A84C]/03" 
                    : "hover:bg-white/04"
                  }`}
                >
                  {activeTab === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.8),0_0_16px_rgba(201,168,76,0.4)]" />
                  )}
                  <item.icon size={18} className={`transition-colors ${
                    activeTab === item.id ? "text-[#C9A84C] drop-shadow-[0_0_6px_rgba(201,168,76,0.6)]" : "text-white/35 group-hover:text-white/70"
                  }`} />
                  <span className={`text-[14px] transition-colors ${
                    activeTab === item.id ? "text-[#C9A84C] font-[600]" : "text-white/55 font-[500] group-hover:text-white/85"
                  }`}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="m-[12px_20px] h-[1px] bg-gradient-to-r from-transparent via-white/06 to-transparent" />

          {/* NEURAL ARCHIVE */}
          <div className="mb-6">
            <h3 className="text-[10px] font-[700] tracking-[0.18em] text-white/25 uppercase px-[20px] mb-[8px]">Neural Archive</h3>
            <div className="space-y-[2px]">
              {history.slice(0, 10).map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    onSessionSelect(session.id);
                    onTabChange("chat");
                    onClose?.();
                  }}
                  className={`flex items-center gap-[12px] w-full p-[11px_20px] transition-all duration-200 group truncate ${
                    activeSessionId === session.id 
                    ? "bg-gradient-to-r from-[#C9A84C]/12 to-[#C9A84C]/03" 
                    : "hover:bg-white/04"
                  }`}
                >
                  {activeSessionId === session.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.8),0_0_16px_rgba(201,168,76,0.4)]" />
                  )}
                  <MessageSquare size={16} className={`shrink-0 ${
                    activeSessionId === session.id ? "text-[#C9A84C]" : "text-white/30 group-hover:text-white/50"
                  }`} />
                  <span className={`text-[13px] truncate transition-colors ${
                    activeSessionId === session.id ? "text-[#C9A84C] font-[500]" : "text-white/45 group-hover:text-white/75"
                  }`}>{getSessionTitle(session)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Reset Section */}
        <div className="p-[16px_20px] border-t border-white/06">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-[700] tracking-[0.15em] text-white/25 uppercase font-sans">Intelligence Reset</span>
              <span className="text-[12px] font-[700] text-[#C9A84C] font-sans">{userData?.remainingCredits ?? 400}/400</span>
           </div>
           <div className="h-[3px] w-full bg-white/08 rounded-[4px] mt-[8px] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((userData?.remainingCredits ?? 0) / 400) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E8C870] rounded-[4px] shadow-[0_0_8px_rgba(201,168,76,0.5)]"
              />
           </div>
        </div>

        {/* User Profile Card */}
        <div className="m-[12px_16px_20px] bg-white/04 border border-white/07 rounded-[14px] p-[14px] flex items-center gap-[12px] group">
          <div className="w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br from-[rgba(80,80,120,0.6)] to-[rgba(40,40,80,0.6)] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
             {userData?.photoURL ? (
               <img src={userData.photoURL} className="w-full h-full object-cover" alt="User" />
             ) : (
               <UserIcon size={20} className="text-white/50" />
             )}
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-[14px] font-[600] text-white/80 truncate">{userData?.displayName || "Agent User"}</p>
             <p className="text-[10px] font-[700] tracking-[0.10em] text-[#C9A84C] uppercase">Level: Elite Operator</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-white/25 hover:text-white/60 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
