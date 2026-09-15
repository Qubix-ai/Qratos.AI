import React, { useState, useEffect, useRef } from "react";
import { 
  SquarePen, 
  Search, 
  X, 
  Pin, 
  PinOff, 
  Edit3, 
  Trash2, 
  MoreHorizontal, 
  Check, 
  AlertTriangle,
  PanelLeft,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChatSession, 
  loadUserSessions, 
  createChatSession,
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
  onNewSession?: () => Promise<void> | void;
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
  onNewSession,
  onLogout,
  isOpen,
  onClose,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState("");
  const [deleteConfirmSession, setDeleteConfirmSession] = useState<ChatSession | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuRef = useRef<HTMLDivElement>(null);
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
      console.error("[Supabase Chat Error] Could not load sessions in Sidebar:", e);
    }
  };

  useEffect(() => {
    loadSessions();

    const handleSessionsUpdate = () => {
      loadSessions();
    };

    window.addEventListener(SESSIONS_UPDATED_EVENT, handleSessionsUpdate);
    const interval = setInterval(loadSessions, 5000);
    
    return () => {
      window.removeEventListener(SESSIONS_UPDATED_EVENT, handleSessionsUpdate);
      clearInterval(interval);
    };
  }, [userId]);

  const handleNewChatClick = async () => {
    if (onNewSession) {
      await onNewSession();
    } else if (userId) {
      const newSession = await createChatSession(userId, "New Conversation");
      if (newSession) {
        onSessionSelect(newSession.id);
      }
    }
    onTabChange("chat");
    onClose?.();
  };

  // Close context menu on click outside the active dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        openMenuId &&
        activeMenuRef.current &&
        !activeMenuRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openMenuId]);

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

  // Filter sessions by search query
  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    return (s.title || "New Conversation").toLowerCase().includes(searchQuery.toLowerCase().trim());
  });

  const pinnedSessions = filteredSessions.filter((s) => s.isPinned);
  const recentSessions = filteredSessions.filter((s) => !s.isPinned);

  const displayName = userData?.displayName || (user?.email ? user.email.split("@")[0] : "User");
  const planLabel = userData?.plan && userData?.plan !== "none" 
    ? (userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1)) 
    : "Free";

  const renderChatItem = (session: ChatSession, prefix = "session") => {
    const isCurrentActive = activeSessionId === session.id;
    const isMenuOpen = openMenuId === session.id;
    const isEditing = editingId === session.id;
    const itemKey = `${prefix}-${session.id}`;

    if (isEditing) {
      return (
        <form 
          key={itemKey}
          onSubmit={handleSaveRename}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-[#F59E0B]/40 shadow-sm my-1"
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
            className="flex-1 bg-transparent text-xs text-white px-1 py-0.5 outline-none font-medium border-none"
            placeholder="Title..."
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
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X size={13} />
          </button>
        </form>
      );
    }

    return (
      <div
        key={itemKey}
        onClick={() => {
          onSessionSelect(session.id);
          onTabChange("chat");
          if (isMobile) {
            onClose?.();
          }
        }}
        className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all cursor-pointer relative select-none ${
          isCurrentActive
            ? "bg-white/[0.08] text-white font-medium shadow-sm border border-white/[0.08]"
            : "text-neutral-300 hover:text-white hover:bg-white/[0.04] border border-transparent"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-1.5">
          {session.isPinned && (
            <Pin size={12} className="text-[#F59E0B] shrink-0 fill-[#F59E0B]/30" />
          )}
          <span className="truncate text-xs sm:text-[13px] font-normal leading-snug">
            {session.title || "New Conversation"}
          </span>
        </div>

        {/* 3-Dot Options Trigger - Only visible when chat is clicked/active */}
        {(isCurrentActive || isMenuOpen) && (
          <div className="relative shrink-0" ref={isMenuOpen ? activeMenuRef : undefined}>
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenMenuId((prev) => (prev === session.id ? null : session.id));
              }}
              className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                isMenuOpen
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
              title="Options"
              aria-label="Options"
            >
              <MoreHorizontal size={14} />
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
                  className="absolute right-0 top-full mt-1 w-36 rounded-xl bg-[#141418] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.9)] p-1 z-50"
                >
                  {/* 1. Rename */}
                  <button
                    type="button"
                    onClick={(e) => handleStartRename(e, session)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                  >
                    <Edit3 size={12} className="text-neutral-300" />
                    <span>Rename</span>
                  </button>

                  {/* 2. Pin / Unpin */}
                  <button
                    type="button"
                    onClick={(e) => handleTogglePin(e, session.id)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                  >
                    {session.isPinned ? (
                      <>
                        <PinOff size={12} className="text-[#F59E0B]" />
                        <span>Unpin</span>
                      </>
                    ) : (
                      <>
                        <Pin size={12} className="text-[#F59E0B]" />
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
        )}
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.aside
            ref={sidebarRef}
            initial={isMobile ? { x: "-100%", opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: "-100%", opacity: 0 } : undefined}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 32,
            }}
            className={`
              fixed inset-y-0 left-0 z-50 w-[85%] max-w-[270px] h-screen
              bg-[#09090B] border-r border-white/[0.06] shadow-[4px_0_40px_rgba(0,0,0,0.8)]
              flex flex-col lg:relative lg:translate-x-0 font-sans
            `}
          >
            {/* Top Bar of Sidebar: Panel Toggle & Quick Return */}
            <div className="p-3 px-4 flex items-center justify-between shrink-0 border-b border-white/[0.06]">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Murgii AI
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close sidebar"
                aria-label="Close sidebar"
              >
                <PanelLeft size={16} />
              </button>
            </div>

            {/* "New chat" Action */}
            <div className="px-3 pt-3 pb-2 shrink-0">
              <button
                type="button"
                onClick={handleNewChatClick}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-neutral-200 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer group text-xs sm:text-[13px] font-medium shadow-sm active:scale-[0.98]"
              >
                <SquarePen size={15} className="text-neutral-300 group-hover:text-white" />
                <span>New chat</span>
              </button>
            </div>

            {/* Search Field */}
            <div className="px-3 pb-3 shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full bg-white/[0.03] hover:bg-white/[0.06] focus:bg-white/[0.08] border border-white/[0.06] focus:border-white/20 rounded-xl pl-8.5 pr-8 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer"
                    title="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* List of Past Chat Sessions/Tasks (with generous spacing, not cramped) */}
            <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {filteredSessions.length === 0 ? (
                <div className="py-8 px-3 text-center">
                  <p className="text-xs text-neutral-500 font-normal">
                    {searchQuery ? "No matching chats" : "No past chats yet"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Pinned Chats */}
                  {pinnedSessions.length > 0 && (
                    <div className="space-y-1 mb-2">
                      <div className="px-2 pt-1 pb-0.5 text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                        Pinned
                      </div>
                      {pinnedSessions.map((session) => renderChatItem(session, "pinned"))}
                    </div>
                  )}

                  {/* Recent Chats */}
                  {recentSessions.length > 0 && (
                    <div className="space-y-1">
                      {pinnedSessions.length > 0 && (
                        <div className="px-2 pt-2 pb-0.5 text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                          Recent
                        </div>
                      )}
                      {recentSessions.map((session) => renderChatItem(session, "recent"))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Section: Profile + Landing Control Navigation Flow */}
            <div className="p-3 border-t border-white/[0.06] shrink-0 bg-[#09090B] space-y-2">
              {/* Back to Landing Page Navigation Option */}
              <button
                type="button"
                onClick={() => {
                  onTabChange("landing");
                  onClose?.();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer text-xs font-medium group"
                title="Back to Landing Page"
              >
                <ArrowLeft size={14} className="text-neutral-400 group-hover:text-white transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              {/* User Profile Bar */}
              <div className="flex items-center justify-between px-2 py-1 rounded-xl">
                <div 
                  onClick={() => {
                    onTabChange("account");
                    onClose?.();
                  }}
                  className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-white text-xs font-semibold shrink-0 overflow-hidden shadow-inner">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold uppercase">
                        {displayName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate group-hover:text-[#F59E0B] transition-colors">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-normal">
                      {planLabel}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer ml-1"
                  title="Sign out"
                  aria-label="Sign out"
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
              className="fixed inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-2xl bg-[#141418] border border-red-500/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Chat?</h3>
                  <p className="text-[11px] text-neutral-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mb-4 text-xs text-neutral-300 truncate">
                "{deleteConfirmSession.title || "Conversation"}"
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSession(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
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
