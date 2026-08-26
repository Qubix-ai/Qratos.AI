import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Plus, 
  ArrowLeft, 
  Search, 
  LogOut, 
  User as UserIcon, 
  Trash2, 
  X, 
  Pin, 
  PinOff, 
  Edit3, 
  MoreVertical, 
  Check, 
  AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChatSession, 
  loadUserSessions, 
  renameSession, 
  togglePinSession, 
  deleteSession, 
  SESSIONS_UPDATED_EVENT 
} from "../lib/chatHistory";

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
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState("");
  const [deleteConfirmSession, setDeleteConfirmSession] = useState<ChatSession | null>(null);

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const userId = user?.id || user?.uid || "";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Session History from persistent storage
  const loadSessions = async () => {
    if (!userId) return;
    try {
      const data = await loadUserSessions(userId);
      setSessions(data);
    } catch (e) {
      console.warn("Could not load sessions:", e);
    }
  };

  useEffect(() => {
    loadSessions();

    const handleSessionsUpdate = () => {
      loadSessions();
    };

    window.addEventListener(SESSIONS_UPDATED_EVENT, handleSessionsUpdate);
    const interval = setInterval(loadSessions, 4000);
    
    return () => {
      window.removeEventListener(SESSIONS_UPDATED_EVENT, handleSessionsUpdate);
      clearInterval(interval);
    };
  }, [userId]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus edit input
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleStartRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditingId(session.id);
    setEditTitleValue(session.title || "Conversation");
  };

  const handleSaveRename = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingId || !editTitleValue.trim()) {
      setEditingId(null);
      return;
    }
    const cleanTitle = editTitleValue.trim();
    setEditingId(null);
    await renameSession(userId, editingId, cleanTitle);
    await loadSessions();
  };

  const handleCancelRename = () => {
    setEditingId(null);
  };

  const handleTogglePin = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setOpenMenuId(null);
    await togglePinSession(userId, sessionId);
    await loadSessions();
  };

  const handleOpenDeleteConfirm = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteConfirmSession(session);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmSession) return;
    const targetId = deleteConfirmSession.id;
    setDeleteConfirmSession(null);
    await deleteSession(userId, targetId);
    if (activeSessionId === targetId) {
      onSessionSelect("");
    }
    await loadSessions();
  };

  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const title = s.title || "Conversation";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pinnedSessions = filteredSessions.filter((s) => s.isPinned);
  const recentSessions = filteredSessions.filter((s) => !s.isPinned);

  const renderChatItem = (session: ChatSession) => {
    const isCurrentActive = activeSessionId === session.id;
    const isMenuOpen = openMenuId === session.id;
    const isEditing = editingId === session.id;

    if (isEditing) {
      return (
        <form 
          key={session.id}
          onSubmit={handleSaveRename}
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/10 border border-[#8B5CF6]/60 shadow-[0_0_12px_rgba(139,92,246,0.3)] my-1"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={editInputRef}
            type="text"
            value={editTitleValue}
            onChange={(e) => setEditTitleValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancelRename();
            }}
            className="flex-1 bg-transparent text-xs text-white px-1.5 py-0.5 outline-none font-medium border-none"
            placeholder="Chat title..."
          />
          <button
            type="submit"
            className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            title="Save title"
          >
            <Check size={13} />
          </button>
          <button
            type="button"
            onClick={handleCancelRename}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X size={13} />
          </button>
        </form>
      );
    }

    return (
      <div
        key={session.id}
        onClick={() => {
          onSessionSelect(session.id);
          onTabChange("chat");
          onClose?.();
        }}
        className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer relative my-0.5 ${
          isCurrentActive
            ? "bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.25)]"
            : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-1">
          {session.isPinned ? (
            <Pin size={13} className="text-[#D946EF] shrink-0 fill-[#D946EF]/30" />
          ) : (
            <MessageSquare
              size={13}
              className={`shrink-0 ${
                isCurrentActive ? "text-[#E879F9]" : "text-gray-500 group-hover:text-gray-300"
              }`}
            />
          )}
          <span className="truncate text-xs select-none">{session.title || "Conversation"}</span>
        </div>

        {/* 3-Dot Options Trigger */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(isMenuOpen ? null : session.id);
            }}
            className={`p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer ${
              isMenuOpen ? "opacity-100 bg-white/10 text-white" : "opacity-0 group-hover:opacity-100"
            }`}
            title="Chat options"
            aria-label="Chat options"
          >
            <MoreVertical size={13} />
          </button>

          {/* Context Menu Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-38 rounded-xl bg-[#120D22] border border-[#8B5CF6]/35 shadow-[0_10px_30px_rgba(0,0,0,0.85)] p-1 z-50 backdrop-blur-xl"
              >
                {/* 1. Rename */}
                <button
                  type="button"
                  onClick={(e) => handleStartRename(e, session)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  <Edit3 size={12} className="text-[#8B5CF6]" />
                  <span>Rename</span>
                </button>

                {/* 2. Pin / Unpin */}
                <button
                  type="button"
                  onClick={(e) => handleTogglePin(e, session.id)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  {session.isPinned ? (
                    <>
                      <PinOff size={12} className="text-[#D946EF]" />
                      <span>Unpin</span>
                    </>
                  ) : (
                    <>
                      <Pin size={12} className="text-[#D946EF]" />
                      <span>Pin to Top</span>
                    </>
                  )}
                </button>

                {/* 3. Delete */}
                <button
                  type="button"
                  onClick={(e) => handleOpenDeleteConfirm(e, session)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer text-left"
                >
                  <Trash2 size={12} className="text-red-400" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
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
            ref={menuContainerRef}
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
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between shrink-0">
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
            <div className="p-4 pb-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onSessionSelect("");
                  onTabChange("chat");
                  onClose?.();
                }}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-xl rounded-xl p-3 flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(255,255,255,0.06),0_0_15px_rgba(255,255,255,0.04)] group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(255,255,255,0.12)] cursor-pointer"
              >
                <Plus size={16} className="text-white group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">New Chat</span>
              </button>
            </div>

            {/* Search Bar for Chat Sessions */}
            <div className="px-4 py-2 shrink-0">
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
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 custom-scrollbar">
              {/* Empty State */}
              {filteredSessions.length === 0 ? (
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
                <>
                  {/* PINNED SECTION */}
                  {pinnedSessions.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-2 py-1 flex items-center gap-1.5 text-gray-500">
                        <Pin size={10} className="text-[#D946EF]" />
                        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">
                          Pinned ({pinnedSessions.length})
                        </span>
                      </div>
                      {pinnedSessions.map((session) => renderChatItem(session))}
                    </div>
                  )}

                  {/* RECENT SECTION */}
                  {recentSessions.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-2 py-1 flex items-center justify-between text-gray-500">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">
                          Recent ({recentSessions.length})
                        </span>
                      </div>
                      {recentSessions.map((session) => renderChatItem(session))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Credits & User Profile */}
            <div className="p-3 border-t border-white/[0.08] space-y-2 shrink-0">
              <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/05 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Credits</span>
                <span className="text-xs font-bold text-[#E879F9] font-mono">
                  {userData?.remainingCredits ?? 3} / {userData?.totalCredits ?? 3}
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmSession && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmSession(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-2xl bg-[#0F0B1E] border border-red-500/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(239,68,68,0.2)] z-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Chat?</h3>
                  <p className="text-[11px] text-gray-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mb-4 text-xs text-gray-300 truncate">
                "{deleteConfirmSession.title || "Conversation"}"
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSession(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
