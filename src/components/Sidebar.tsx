import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Plus, 
  ArrowLeft, 
  LogOut, 
  User as UserIcon, 
  Trash2, 
  X, 
  Pin, 
  PinOff, 
  Edit3, 
  MoreHorizontal, 
  Check, 
  AlertTriangle,
  PanelLeft,
  SquarePen,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QreatoLogo } from "./QreatoLogo";
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

  const pinnedSessions = sessions.filter((s) => s.isPinned);
  const recentSessions = sessions.filter((s) => !s.isPinned);

  const displayName = userData?.displayName || (user?.email ? user.email.split("@")[0] : "Jahangir Hossain");
  const planLabel = userData?.plan && userData?.plan !== "none" 
    ? (userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1)) 
    : "Free";

  const renderChatItem = (session: ChatSession) => {
    const isCurrentActive = activeSessionId === session.id;
    const isMenuOpen = openMenuId === session.id;
    const isEditing = editingId === session.id;

    if (isEditing) {
      return (
        <form 
          key={session.id}
          onSubmit={handleSaveRename}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/30 shadow-sm my-1"
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
        className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] transition-all cursor-pointer relative my-0.5 select-none ${
          isCurrentActive
            ? "bg-white/[0.08] text-white font-medium shadow-sm border border-white/[0.08]"
            : "text-gray-300 hover:text-white hover:bg-white/[0.04] border border-transparent"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
          {session.isPinned && (
            <Pin size={12} className="text-[#8B5CF6] shrink-0 fill-[#8B5CF6]/30" />
          )}
          <span className="truncate text-xs sm:text-[13px] font-normal leading-snug">
            {session.title || "AI Assistant"}
          </span>
        </div>

        {/* 3-Dot Options Trigger (••• MoreHorizontal) */}
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
                className="absolute right-0 top-full mt-1 w-36 rounded-xl bg-[#141416] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.9)] p-1 z-50 backdrop-blur-xl"
              >
                {/* 1. Rename */}
                <button
                  type="button"
                  onClick={(e) => handleStartRename(e, session)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  <Edit3 size={12} className="text-gray-300" />
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
                      <PinOff size={12} className="text-[#8B5CF6]" />
                      <span>Unpin</span>
                    </>
                  ) : (
                    <>
                      <Pin size={12} className="text-[#8B5CF6]" />
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
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
              stiffness: 350,
              damping: 32,
            }}
            className={`
              fixed inset-y-0 left-0 z-50 w-[85%] max-w-[270px] h-screen
              bg-[#050507] border-r border-white/[0.08] shadow-[4px_0_40px_rgba(0,0,0,0.8)]
              flex flex-col lg:relative lg:translate-x-0
            `}
          >
            {/* Top Bar: Back to Landing Page Arrow on Left | Sidebar Toggle Icon on Right */}
            <div className="p-3.5 px-4 flex items-center justify-between shrink-0 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                {/* Button to go back to landing page */}
                <button
                  type="button"
                  onClick={() => {
                    onTabChange("landing");
                    onClose?.();
                  }}
                  className="p-2.5 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-white/[0.04] border border-white/10 flex items-center gap-2"
                  title="Back to Landing Page"
                  aria-label="Back to Landing Page"
                >
                  <ArrowLeft size={18} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                {/* Sidebar Collapse Button (PanelLeft / Sidebar icon) */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close sidebar"
                  aria-label="Close sidebar"
                >
                  <PanelLeft size={16} />
                </button>
              </div>
            </div>

            {/* "New task" Button with SquarePen Icon */}
            <div className="px-3 pt-3 pb-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onSessionSelect("");
                  onTabChange("chat");
                  onClose?.();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer group text-xs sm:text-[13px] font-medium border border-white/[0.06] hover:border-white/15"
              >
                <SquarePen size={15} className="text-gray-300 group-hover:text-white" />
                <span>New task</span>
              </button>
            </div>

            {/* "Tasks" / History Section Header */}
            <div className="px-3 pt-3 pb-1 shrink-0">
              <div className="flex items-center justify-between px-3 py-1 text-gray-400 text-xs font-normal">
                <span>Tasks</span>
                <button
                  type="button"
                  onClick={() => {
                    onSessionSelect("");
                    onTabChange("chat");
                    onClose?.();
                  }}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="New Task"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Saved Chat Sessions List */}
            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 custom-scrollbar">
              {sessions.length === 0 ? (
                <div className="py-6 px-3 text-center">
                  <p className="text-xs text-gray-500 font-medium">
                    No recent tasks
                  </p>
                </div>
              ) : (
                <>
                  {/* PINNED TASKS */}
                  {pinnedSessions.length > 0 && (
                    <div className="space-y-0.5 mb-2">
                      {pinnedSessions.map((session) => renderChatItem(session))}
                    </div>
                  )}

                  {/* RECENT TASKS */}
                  {recentSessions.length > 0 && (
                    <div className="space-y-0.5">
                      {recentSessions.map((session) => renderChatItem(session))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Actions: Upgrade to Core Card + User Profile Info */}
            <div className="p-3 border-t border-white/[0.08] space-y-2.5 shrink-0 bg-[#050507]">
              {/* "Upgrade to Core" Card with Purple Lightning Badge */}
              <div 
                onClick={() => {
                  onTabChange("pricing");
                  onClose?.();
                }}
                className="w-full rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#8B5CF6]/40 p-3 flex items-center justify-between transition-all duration-200 cursor-pointer shadow-sm group"
              >
                <div className="flex flex-col text-left min-w-0 pr-2">
                  <span className="text-xs font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                    Upgrade to Core
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal truncate mt-0.5">
                    Unlock more features
                  </span>
                </div>

                <div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-[0_0_14px_rgba(139,92,246,0.6)] group-hover:scale-105 transition-transform">
                  <Zap size={14} className="fill-white text-white" />
                </div>
              </div>

              {/* User Profile Row: Avatar + Name + Plan + Sign Out */}
              <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-transparent">
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
                    <p className="text-xs font-medium text-white truncate group-hover:text-purple-200 transition-colors">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-gray-400 font-normal">
                      {planLabel}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer ml-1"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-2xl bg-[#141416] border border-red-500/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10"
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
