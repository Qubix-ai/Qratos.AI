import { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  Mail, 
  AtSign, 
  FileText, 
  CreditCard, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Lock, 
  LogOut, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Zap,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QreatoLogo } from "./QreatoLogo";
import { 
  fetchUserProfile, 
  updateUserProfile, 
  fetchUserPlan, 
  fetchBoltProgress, 
  UserProfile, 
  UserPlanData, 
  BoltProgressSummary 
} from "../lib/userAccount";

interface AccountPageProps {
  user: any;
  remainingCredits: number | null;
  onGoToPricing: () => void;
  onGoToChat: () => void;
  onLogout: () => void;
}

export function AccountPage({
  user,
  remainingCredits,
  onGoToPricing,
  onGoToChat,
  onLogout,
}: AccountPageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [planData, setPlanData] = useState<UserPlanData>({ plan: "none", maxCredits: 20 });
  const [boltProgress, setBoltProgress] = useState<BoltProgressSummary>({
    completedCount: 0,
    totalCount: 24,
    percentage: 0,
  });

  // Edit form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccountData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [prof, plan, bolt] = await Promise.all([
          fetchUserProfile(user),
          fetchUserPlan(user.id, user.user_metadata),
          fetchBoltProgress(user.id),
        ]);

        setProfile(prof);
        setName(prof.name || prof.full_name || "");
        setUsername(prof.username || "");
        setBio(prof.bio || "");
        setPlanData(plan);
        setBoltProgress(bolt);
      } catch (err) {
        console.error("Failed loading account data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage("");

    const result = await updateUserProfile(user.id, {
      name,
      full_name: name,
      username,
      bio,
      email: user.email,
    });

    setIsSaving(false);
    if (result.success) {
      setSaveStatus("success");
      setProfile((prev) => (prev ? { ...prev, name, username, bio } : null));
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
      setErrorMessage(result.error || "Failed to update profile");
    }
  };

  const isBasic = planData.plan === "basic" || planData.plan === "none";
  const isCore = planData.plan === "core";
  const isMax = planData.plan === "max";

  const effectiveCredits = remainingCredits !== null ? remainingCredits : planData.maxCredits;
  const creditsPercentage = Math.round((effectiveCredits / planData.maxCredits) * 100);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#07060B] text-gray-200 overflow-y-auto custom-scrollbar relative selection:bg-[#8B5CF6]/30 selection:text-white">
      {/* Premium Multi-Layer Gradient Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep chromatic mesh glows */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-[#8B5CF6]/25 via-[#D946EF]/15 to-transparent rounded-full blur-[110px]" />
        <div className="absolute top-[35%] -left-[10%] w-[500px] h-[500px] bg-[#6366F1]/15 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] -right-[10%] w-[550px] h-[550px] bg-[#EC4899]/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-[0%] left-[20%] w-[600px] h-[400px] bg-[#A855F7]/12 rounded-full blur-[110px]" />
        
        {/* Subtle geometric grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10 space-y-8">
        {/* Header with Frosted White Glass Accent */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-xl text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">
              <QreatoLogo size={12} className="text-[#E879F9]" />
              Operator Terminal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Account & Profile Settings
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Manage your shared identity, plan subscriptions, and connected Bolt roadmap activity.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onGoToChat}
              className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl text-xs font-bold text-white transition-all cursor-pointer hover:scale-[1.02]"
            >
              Workspace
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-xs font-bold text-red-400 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* TOP STATUS CARDS: PLAN & CREDITS (White Glassmorphism with Specular Sheen) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CURRENT PLAN CARD */}
          <div 
            className="p-5 sm:p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-white/30 group"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
            }}
          >
            {/* Top glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#8B5CF6]/20 rounded-full blur-[40px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest font-semibold">Active Plan</span>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm backdrop-blur-md ${
                  isMax 
                    ? "bg-[#D946EF]/25 border-[#D946EF]/50 text-[#F472B6]" 
                    : isCore 
                    ? "bg-[#8B5CF6]/25 border-[#8B5CF6]/50 text-[#E879F9]" 
                    : "bg-white/[0.12] border-white/25 text-white"
                }`}>
                  {planData.plan.toUpperCase()} TIER
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#D946EF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-white/20">
                  {isMax ? <Crown size={22} /> : isCore ? <Zap size={22} /> : <ShieldCheck size={22} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {isMax ? "Murgii Max / High Velocity" : isCore ? "Murgii Core / Leverage" : "Murgii Basic (Free)"}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {planData.maxCredits} AI credits replenished every 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between relative z-10">
              <span className="text-xs text-gray-300">
                {isMax ? "Highest tier active" : isCore ? "Upgrade for 100 credits/day" : "Upgrade for Prompt Builder & Bolt"}
              </span>
              <button
                type="button"
                onClick={onGoToPricing}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E879F9] hover:text-[#F472B6] transition-colors cursor-pointer group-hover:translate-x-0.5 transition-transform"
              >
                <span>{isMax ? "View Plan Tiers" : "Upgrade Plan"}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* DAILY RESPONSES / CREDITS REMAINING CARD */}
          <div 
            className="p-5 sm:p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-white/30"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
            }}
          >
            {/* Top glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest font-semibold">Daily Credits Remaining</span>
                <Coins size={16} className="text-[#E879F9]" />
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {effectiveCredits}
                </span>
                <span className="text-gray-300 text-xs font-mono">
                  / {planData.maxCredits} per day
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-black/40 border border-white/10 p-[1px] overflow-hidden mb-2 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(217,70,239,0.7)]"
                  style={{ width: `${Math.max(5, Math.min(100, creditsPercentage))}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300 relative z-10">
              <span>Automatic daily reset at midnight UTC</span>
              <span className="font-bold text-white">{creditsPercentage}% available</span>
            </div>
          </div>
        </div>

        {/* SHARED BOLT ACTIVITY SECTION (White Glassmorphic Card) */}
        <div 
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
          }}
        >
          {/* Subtle top light sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/[0.1] border border-white/20 shadow-sm flex items-center justify-center text-[#E879F9]">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Bolt Roadmap Activity
                </h3>
                <p className="text-xs text-gray-300">
                  Shared execution state from the Bolt 6-category growth roadmap
                </p>
              </div>
            </div>

            <a
              href="https://bolt.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 shadow-sm text-xs font-bold text-white transition-all hover:scale-[1.02]"
            >
              <span>Open Bolt</span>
              <ExternalLink size={12} className="text-[#C084FC]" />
            </a>
          </div>

          {/* Core / Max State: Query and show real roadmap summary */}
          {!isBasic ? (
            <div className="space-y-6 relative z-10">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/15 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      {boltProgress.completedCount}
                    </span>
                    <span className="text-gray-300 text-sm font-medium">
                      of {boltProgress.totalCount} roadmap items completed
                    </span>
                  </div>
                  <p className="text-xs text-[#C084FC]">
                    Real-time count retrieved directly from the shared Bolt progress table.
                  </p>
                </div>

                <div className="w-full sm:w-48 space-y-1.5 shrink-0">
                  <div className="flex justify-between text-[10px] font-mono text-gray-300">
                    <span>ROADMAP PROGRESS</span>
                    <span className="text-white font-bold">{boltProgress.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 p-[1px] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                      style={{ width: `${Math.max(4, boltProgress.percentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/12 shadow-sm">
                  <span className="text-gray-400 block text-[10px] uppercase font-mono mb-1 font-semibold">Architecture</span>
                  <span className="text-white font-bold">6 Core Categories</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/12 shadow-sm">
                  <span className="text-gray-400 block text-[10px] uppercase font-mono mb-1 font-semibold">Ecosystem Status</span>
                  <span className="text-[#E879F9] font-bold">Synchronized Active</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/12 shadow-sm">
                  <span className="text-gray-400 block text-[10px] uppercase font-mono mb-1 font-semibold">Connected Tier</span>
                  <span className="text-white font-bold">Bolt {planData.plan.toUpperCase()}</span>
                </div>
              </div>

              <div className="sm:hidden pt-2">
                <a
                  href="https://bolt.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-white/[0.08] border border-white/15 text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <span>Open Bolt Studio</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : (
            /* Basic / None State: Locked Section Visual Pattern */
            <div className="relative rounded-2xl p-6 sm:p-8 bg-black/50 border border-white/15 text-center overflow-hidden shadow-inner relative z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent pointer-events-none" />
              <div className="max-w-md mx-auto relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/20 flex items-center justify-center mx-auto text-gray-300 shadow-md">
                  <Lock size={20} className="text-[#E879F9]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Unlock Bolt Access with Core or Max</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Bolt roadmap synchronization and 6-category execution tracking are available on Bolt Core and Max plans.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onGoToPricing}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-xs font-black uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.4)]"
                  >
                    <span>View Pricing & Upgrade</span>
                    <ArrowRight size={13} />
                  </button>
                  <a
                    href="https://whop.com/qreato/ai-leverage"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs font-bold text-gray-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Whop Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* EDITABLE PROFILE SECTION (White Glassmorphic Card) */}
        <div 
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
          }}
        >
          {/* Subtle top light sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10 relative z-10">
            <div className="w-9 h-9 rounded-2xl bg-white/[0.1] border border-white/20 shadow-sm flex items-center justify-center text-white">
              <UserIcon size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Profile Identity
              </h3>
              <p className="text-xs text-gray-300">
                Synchronized with the shared Bolt profiles table
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <UserIcon size={13} className="text-[#8B5CF6]" />
                  <span>Full / Display Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all shadow-inner"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <AtSign size={13} className="text-[#D946EF]" />
                  <span>Username / Handle</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex_growth"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Email (Read-only reference from Auth) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <Mail size={13} className="text-gray-400" />
                <span>Email Address (Primary Auth)</span>
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-400 text-xs cursor-not-allowed shadow-inner"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <FileText size={13} className="text-[#C084FC]" />
                <span>Bio / Operator Context</span>
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your marketing offer, audience, or direct response focus..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all custom-scrollbar resize-none shadow-inner"
              />
            </div>

            {/* Action Buttons & Status */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div>
                <AnimatePresence>
                  {saveStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-xs font-bold text-emerald-400"
                    >
                      <CheckCircle2 size={14} />
                      <span>Profile updated successfully!</span>
                    </motion.div>
                  )}
                  {saveStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-xs font-bold text-red-400"
                    >
                      <AlertCircle size={14} />
                      <span>{errorMessage || "Error updating profile."}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-95 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Save size={13} />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
