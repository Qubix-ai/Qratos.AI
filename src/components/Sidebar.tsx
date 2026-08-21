import { useState, useEffect } from "react";
import { MessageSquare, Plus, ArrowLeft, Search, LogOut, User as UserIcon, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  user: any;
  userData: any;
  activeTab: string;
  activeSessionId?: string;
  onTabChange: (tab: string) => void;
  onSessionSelect: (sessionId: string) => void;
  onLogout: () => void;
  onShowAdmin?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  user,
  userData,
  activeTab,
  activeSessionId,
  onTabChange,
  onSessionSelect,
  onLogout,
  isOpen,
  onClose,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Session History from local cache
  const loadSessions = () => {
    if (!user) return;
    try {
      const stored = localStorage.getItem(`murgii_sessions_${user.id || user.uid || "user"}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load sessions from localStorage:", e);
    }
  };

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const title = item.title || item.messages?.[0]?.content || "Chat Session";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getSessionTitle = (session: any) => {
    if (session.title) return session.title;
    const firstMsg = session.messages?.[0]?.content || "";
    if (!firstMsg) return "New Session";
    return firstMsg.length > 35 ? firstMsg.substring(0, 35) + "..." : firstMsg;
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      const updated = history.filter((s) => s.id !== sessionId);
      setHistory(updated);
      localStorage.setItem(`murgii_sessions_${user.id || user.uid || "user"}`, JSON.stringify(updated));
      if (activeSessionId === sessionId) {
        onSessionSelect("");
      }
    } catch (err) {
      console.error("Could not delete session:", err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.aside
            initial={isMobile ? { x: "-100%", opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: "-100%", opacity: 0 } : undefined}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            className={`
              fixed inset-y-0 left-0 z-50 w-[85%] max-w-[290px] h-screen
              border-r border-white/[0.08] shadow-[4px_0_40px_rgba(0,0,0,0.7)] backdrop-blur-[35px]
              flex flex-col lg:relative lg:translate-x-0
            `}
            style={{
              background: "linear-gradient(180deg, rgba(10, 8, 18, 0.98) 0%, rgba(6, 5, 10, 0.99) 100%)",
            }}
          >
            {/* Top Navigation Header: Back Arrow to Landing Page */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onTabChange("landing");
                  onClose?.();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#8B5CF6]/40 text-gray-300 hover:text-white transition-all cursor-pointer group"
                title="Navigate to Landing Page"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform text-[#E879F9]" />
                <span className="text-xs font-semibold">Back to Home</span>
              </button>

              {/* Mobile Close Button */}
              {isMobile && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Close sidebar"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* New Chat Button */}
            <div className="p-4 pb-2">
              <button
                type="button"
                onClick={() => {
                  onSessionSelect("");
                  onTabChange("chat");
                  onClose?.();
                }}
                className="w-full bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] rounded-xl p-3 flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(139,92,246,0.35)] group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(217,70,239,0.45)] cursor-pointer"
              >
                <Plus size={16} className="text-white group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">New Chat</span>
              </button>
            </div>

            {/* Real Search Bar for Chat Sessions */}
            <div className="px-4 py-2">
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 transition-all focus-within:border-[#8B5CF6]/50 focus-within:bg-white/10">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none p-0 focus:ring-0 text-xs text-white placeholder-gray-500 outline-none flex-1 min-w-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Saved Chat Sessions List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
              <div className="px-2 py-1 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                  Recent Chats {filteredHistory.length > 0 && `(${filteredHistory.length})`}
                </span>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <MessageSquare size={20} className="text-gray-600 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-gray-500 font-medium">
                    {searchQuery ? "No matching chats found" : "No saved chats yet"}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {searchQuery ? "Try another keyword" : "Start a new conversation"}
                  </p>
                </div>
              ) : (
                filteredHistory.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSessionSelect(session.id);
                      onTabChange("chat");
                      onClose?.();
                    }}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer relative ${
                      activeSessionId === session.id
                        ? "bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-white font-semibold shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <MessageSquare
                        size={14}
                        className={`shrink-0 ${
                          activeSessionId === session.id ? "text-[#E879F9]" : "text-gray-500 group-hover:text-gray-300"
                        }`}
                      />
                      <span className="truncate">{getSessionTitle(session)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-gray-500 transition-all rounded"
                      title="Delete chat"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Credits & User Profile */}
            <div className="p-3 border-t border-white/[0.08] space-y-2">
              <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/05 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Credits</span>
                <span className="text-xs font-bold text-[#E879F9] font-mono">
                  {userData?.remainingCredits ?? 20} / {userData?.totalCredits ?? 20}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/05">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#D946EF] flex items-center justify-center text-white text-[10px] font-black shrink-0">
                    {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={12} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate max-w-[130px]">
                      {user?.email ? user.email.split("@")[0] : "Operator"}
                    </p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                      {userData?.plan || "Basic"} Plan
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
