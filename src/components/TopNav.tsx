import React from "react";
import { PanelLeft } from "lucide-react";

interface TopNavProps {
  user?: any;
  activeTab?: string;
  sessionTitle?: string;
  remainingCredits?: number | null;
  maxCredits?: number;
  userPlan?: string;
  onTabChange?: (tab: string) => void;
  onMenuToggle: () => void;
  onLogout?: () => void;
}

export function TopNav({
  sessionTitle = "New chat",
  onMenuToggle,
}: TopNavProps) {
  return (
    <header className="h-13 sm:h-14 border-b border-white/[0.06] bg-[#09090B] px-3 sm:px-4 flex items-center justify-between z-30 sticky top-0 shrink-0 select-none">
      {/* Top-Left: Sidebar-toggle icon */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors cursor-pointer flex items-center justify-center"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <PanelLeft size={18} className="stroke-[2.2]" />
        </button>
      </div>

      {/* Center: Current chat/session name only */}
      <div className="flex-1 flex items-center justify-center px-4 min-w-0">
        <span 
          className="text-xs sm:text-sm font-medium text-neutral-200 truncate max-w-[280px] sm:max-w-md tracking-tight font-sans"
          title={sessionTitle}
        >
          {sessionTitle}
        </span>
      </div>

      {/* Right balance spacer matching left toggle button width for optical centering */}
      <div className="w-9 h-9 shrink-0" aria-hidden="true" />
    </header>
  );
}

