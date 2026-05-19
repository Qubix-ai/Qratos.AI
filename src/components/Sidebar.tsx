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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-[#050505] border-r border-white/5 flex flex-col p-6
        transform transition-transform duration-700 ease-[0.16,1,0.3,1] lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shadow-2xl will-change-transform
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-8 right-6 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-4 mb-8 mt-2 group cursor-pointer" onClick={() => onTabChange("chat")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFB52E] to-[#E2A72E]/50 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(255,181,46,0.5)] group-hover:scale-110 transition-transform">
            <BrainCircuit size={22} className="text-black" />
          </div>
          <div className="flex flex-col">
            <div className="tracking-tighter text-white text-xl">
              <span className="font-extrabold">QRATOS</span>
              <span className="font-light">.AI</span>
            </div>
            <span className="text-[10px] font-sans text-[#FFB52E] tracking-[0.3em] font-bold">PERSUASION OS</span>
          </div>
        </div>

        {/* Search Bar - Modern Metallic */}
        <div className="relative mb-8 group">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#FFB52E] transition-colors" />
          <input 
            type="text"
            placeholder="Universal Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFB52E]/30 transition-all shadow-inner"
          />
        </div>

        {/* Nav Sections Scrollable Area */}
        <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2 mb-8">
          {/* Create New Session Button */}
          <div className="px-2">
            <button
              onClick={() => {
                onSessionSelect("");
                onTabChange("chat");
                onClose?.();
              }}
              className="group flex items-center gap-3 w-full p-4 rounded-2xl bg-gradient-to-tr from-[#FFB52E] to-[#E2A72E] text-black shadow-[0_10px_20px_-5px_rgba(255,181,46,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center">
                <Plus size={18} strokeWidth={3} />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[11px] font-black uppercase tracking-wider">New Neural Logic</span>
                <span className="text-[9px] font-bold opacity-70 mt-1">Initialize fresh session</span>
              </div>
            </button>
          </div>

          {/* Persuasion Archive (Past Texts) */}
          <div>
            <div className="flex items-center justify-between px-3 mb-4">
              <h3 className="text-[9px] font-sans text-gray-500 uppercase tracking-[0.3em] font-black">Neural Archive</h3>
              <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px] text-gray-500 font-bold border border-white/5">LAST 20</span>
            </div>
            <div className="space-y-1">
              {loadingHistory && (
                <div className="px-4 py-2 text-[10px] text-gray-600 italic flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFB52E] animate-pulse" />
                  Syncing high-stakes history...
                </div>
              )}
              {!loadingHistory && filteredHistory.length === 0 && (
                <div className="px-4 py-2 text-[10px] text-gray-600 italic">No archive data found.</div>
              )}
              {filteredHistory.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    onSessionSelect(session.id);
                    onTabChange("chat");
                    onClose?.();
                  }}
                  className={`group flex items-center gap-3 w-full p-2.5 px-4 rounded-xl text-[11px] transition-all duration-300 relative overflow-hidden hover:scale-[1.02] active:scale-98 ${
                    activeSessionId === session.id 
                    ? "bg-[#FFB52E]/10 text-[#FFB52E] border border-[#FFB52E]/10 shadow-[0_0_20px_rgba(255,181,46,0.1)]" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <MessageSquare size={14} className={activeSessionId === session.id ? "text-[#FFB52E]" : "text-gray-600 group-hover:text-gray-400"} />
                  <span className="truncate flex-1 text-left font-medium">
                    {getSessionTitle(session)}
                  </span>
                  {activeSessionId === session.id && (
                    <motion.div layoutId="activeInd" className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#FFB52E]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Controls */}
          <div>
            <h3 className="text-[9px] font-sans text-gray-500 uppercase tracking-[0.3em] font-black px-3 mb-4">Core Systems</h3>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose?.();
                  }}
                  className={`flex items-center gap-3 w-full p-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-98 ${
                    activeTab === item.id 
                    ? "bg-[#FFB52E]/10 text-[#FFB52E] shadow-[0_0_15px_-5px_rgba(255,181,46,0.2)] border border-[#FFB52E]/20" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={16} className={activeTab === item.id ? "text-[#FFB52E]" : "text-gray-600"} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        {/* Model Categories */}
        <div>
          <h3 className="text-[9px] font-sans text-gray-500 uppercase tracking-[0.3em] font-black px-3 mb-4">Specialized Agents</h3>
          <div className="space-y-1">
            {filteredCategories.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose?.();
                }}
                className={`flex items-center gap-3 w-full p-3 px-4 rounded-xl text-[11px] font-bold transition-all ${
                  activeTab === item.id 
                  ? "bg-[#FFB52E]/10 text-[#FFB52E] border border-[#FFB52E]/20" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={16} className={activeTab === item.id ? "text-[#FFB52E]" : "text-gray-600"} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

          {/* Navigation to Landing - REMOVED */}
        </div>

        {/* Enhanced Footer Profile Section */}
        <div className="pt-6 border-t border-white/5">
          {/* Usage Meter */}
          <div className="mb-6 px-2">
            <div className="flex items-center justify-between text-[10px] font-sans mb-2">
              <span className="text-gray-500 uppercase tracking-widest font-black">Intelligence Reset (48h)</span>
              <span className="text-[#FFB52E] font-bold">{userData?.remainingCredits ?? 400} / 400</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((userData?.remainingCredits ?? 0) / 400) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#FFB52E] to-[#E2A72E] rounded-full shadow-[0_0_10px_rgba(255,181,46,0.3)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center overflow-hidden">
               {userData?.photoURL ? (
                 <img src={userData.photoURL} className="w-full h-full object-cover" alt="User" />
               ) : (
                 <UserIcon size={20} className="text-gray-500" />
               )}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-extrabold text-white truncate">{userData?.displayName || "Agent User"}</p>
               <p className="text-[10px] font-sans text-[#FFB52E] uppercase font-bold tracking-tight">Level: Elite Operator</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>

          {userData?.isAdmin && (
            <button 
              onClick={onShowAdmin}
              className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 rounded-xl bg-[#FFB52E]/5 border border-[#FFB52E]/20 text-[10px] font-sans font-black text-[#FFB52E] uppercase tracking-widest hover:bg-[#FFB52E]/10 transition-colors"
            >
              <History size={14} />
              Command Center
            </button>
          )}
        </div>
      </div>
    </>
  );
}
