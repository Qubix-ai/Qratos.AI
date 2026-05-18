import { useState } from "react";
import { BrainCircuit, MessageSquare, Plus, Settings, User as UserIcon, LogOut, LayoutDashboard, History, Sparkles, Target, Mic, Mail, FileText, Share2, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  userData: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onShowAdmin: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userData, activeTab, onTabChange, onLogout, onShowAdmin, isOpen, onClose }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState([
    { id: "campaigns", label: "Ad Campaigns", isOpen: true, items: [
      { id: "alpha", label: "Project Alpha Launch", type: "ad" },
      { id: "beta", label: "Beta Testing Funnel", type: "funnel" },
    ]},
    { id: "content", label: "Content Vault", isOpen: false, items: [] },
  ]);

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
        <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={() => onTabChange("chat")}>
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

        {/* Primary Action */}
        <button 
          onClick={() => {
            onTabChange("chat");
            onClose?.();
          }}
          className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-extrabold rounded-2xl text-xs uppercase tracking-widest hover:bg-gray-200 transition-all mb-8 shadow-xl"
        >
          <Plus size={16} />
          New Persuasion Goal
        </button>

        {/* Nav Sections Scrollable Area */}
        <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2 mb-8">
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
                  className={`flex items-center gap-3 w-full p-3 px-4 rounded-xl text-xs font-bold transition-all ${
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

          {/* Dynamic Channels/Folders */}
          {folders.map(folder => (
            <div key={folder.id}>
              <div className="flex items-center justify-between px-3 mb-3 group cursor-pointer">
                <h3 className="text-[9px] font-sans text-gray-500 uppercase tracking-[0.3em] font-black group-hover:text-[#FFB52E] transition-colors">{folder.label}</h3>
                <Sparkles size={10} className="text-gray-700 group-hover:text-[#FFB52E]/50" />
              </div>
              <div className="space-y-1">
                {folder.items.map(item => (
                   <button
                    key={item.id}
                    className="flex items-center gap-3 w-full p-2.5 px-4 rounded-xl text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all truncate"
                   >
                     <div className="w-1 h-1 rounded-full bg-[#FFB52E]" />
                     {item.label}
                   </button>
                ))}
              </div>
            </div>
          ))}

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
        </div>

        {/* Enhanced Footer Profile Section */}
        <div className="pt-6 border-t border-white/5">
          {/* Usage Meter */}
          <div className="mb-6 px-2">
            <div className="flex items-center justify-between text-[10px] font-sans mb-2">
              <span className="text-gray-500 uppercase tracking-widest font-black">Daily Intelligence Usage</span>
              <span className="text-[#FFB52E] font-bold">{userData?.remainingCredits ?? 20} / 20</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((userData?.remainingCredits ?? 20) / 20) * 100}%` }}
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
