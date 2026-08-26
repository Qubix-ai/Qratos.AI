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
  fetchUserPlanAndCredits,
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
  const [planData, setPlanData] = useState<UserPlanData>({ plan: "none", maxCredits: 3 });
  const [liveRemainingCredits, setLiveRemainingCredits] = useState<number | null>(remainingCredits);
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
        const [prof, freshPlanAndCredits, bolt] = await Promise.all([
          fetchUserProfile(user),
          fetchUserPlanAndCredits(user.id, remainingCredits ?? undefined, user.user_metadata),
          fetchBoltProgress(user.id),
        ]);

        setProfile(prof);
        setName(prof.name || prof.full_name || "");
        setUsername(prof.username || "");
        setBio(prof.bio || "");
        setPlanData(freshPlanAndCredits.planData);
        setLiveRemainingCredits(freshPlanAndCredits.remainingCredits);
        setBoltProgress(bolt);
      } catch (err) {
        console.error("Failed loading account data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, [user, remainingCredits]);

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

  const effectiveCredits = liveRemainingCredits !== null ? liveRemainingCredits : (remainingCredits !== null ? remainingCredits : planData.maxCredits);
  const creditsPercentage = Math.round((effectiveCredits / Math.max(1, planData.maxCredits)) * 100);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#07060B] text-white overflow-y-auto custom-scrollbar relative selection:bg-white/30 selection:text-white">
      {/* Premium Multi-Layer White Specular Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Luminous ambient flares and white specular orbs */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[760px] h-[580px] bg-gradient-to-b from-white/[0.12] via-[#8B5CF6]/15 to-transparent rounded-full blur-[130px]" />
        <div className="absolute top-[25%] -left-[10%] w-[550px] h-[550px] bg-white/[0.06] rounded-full blur-[140px]" />
        <div className="absolute top-[45%] -right-[10%] w-[580px] h-[580px] bg-white/[0.06] rounded-full blur-[140px]" />
        <div className="absolute bottom-[0%] left-[25%] w-[650px] h-[450px] bg-white/[0.04] rounded-full blur-[130px]" />
        
        {/* Crisp geometric grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10 space-y-8">
        {/* Header with High-Contrast White Glass Accent */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-xl text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_#ffffff]" />
              Operator Terminal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
              Account & Profile Settings
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              Manage your shared identity, plan subscriptions, and connected Bolt roadmap activity.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onGoToChat}
              className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-100 font-bold text-xs shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              Workspace
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-red-500/20 border border-white/15 hover:border-red-500/30 text-xs font-bold text-neutral-300 hover:text-red-300 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xl hover:scale-[1.02]"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* TOP STATUS CARDS: PLAN & CREDITS (Pure White Glassmorphic Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CURRENT PLAN CARD */}
          <div 
            className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:border-white/40"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
            }}
          >
            {/* Top glass gradient overlay for luminous depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/[0.08] rounded-full blur-[50px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest font-bold">Active Plan</span>
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/15 border border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] backdrop-blur-md">
                  {planData.plan === "none" || planData.plan === "basic" ? "BASIC (FREE) TIER" : `${planData.plan.toUpperCase()} TIER`}
                </span>
              </div>

              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.35)] shrink-0">
                  {isMax ? <Crown size={22} strokeWidth={2.2} /> : isCore ? <Zap size={22} strokeWidth={2.2} /> : <ShieldCheck size={22} strokeWidth={2.2} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {isMax ? "Murgii Max / High Velocity" : isCore ? "Murgii Core / Leverage" : "Murgii Basic (Free)"}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {planData.maxCredits} AI credits replenished every 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between relative z-10">
              <span className="text-xs text-neutral-300 font-medium">
                {isMax ? "Highest tier active" : isCore ? "Upgrade for 60 credits/day" : "Upgrade for Core (20/day) or Max (60/day)"}
              </span>
              <button
                type="button"
                onClick={onGoToPricing}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                <span>{isMax ? "View Plan Tiers" : "Upgrade Plan"}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* DAILY RESPONSES / CREDITS REMAINING CARD */}
          <div 
            className="p-6 sm:p-7 rounded-[32px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:border-white/40"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
            }}
          >
            {/* Top glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/[0.08] rounded-full blur-[50px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest font-bold">Daily Credits Remaining</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center text-white shadow-sm">
                  <Coins size={16} />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                  {effectiveCredits}
                </span>
                <span className="text-neutral-300 text-xs font-mono font-medium">
                  / {planData.maxCredits} per day
                </span>
              </div>

              {/* Progress bar with luminous white fill */}
              <div className="w-full h-2.5 rounded-full bg-black/50 border border-white/15 p-[1px] overflow-hidden mb-2 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-white via-white/90 to-white/70 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  style={{ width: `${Math.max(5, Math.min(100, creditsPercentage))}%` }}
                />
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-neutral-300 relative z-10">
              <span>Replenished every 24 hours</span>
              <span className="font-bold text-white font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20">
                {creditsPercentage}% available
              </span>
            </div>
          </div>
        </div>

        {/* SHARED BOLT ACTIVITY SECTION (White Glassmorphic Card) */}
        <div 
          className="rounded-[32px] p-6 sm:p-8 relative overflow-hidden transition-all duration-300 group hover:border-white/40"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
          }}
        >
          {/* Top light sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.25)] shrink-0">
                <TrendingUp size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Bolt Roadmap Activity
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Shared execution state from the Bolt 6-category growth roadmap
                </p>
              </div>
            </div>

            <a
              href="https://bolt.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 shadow-sm text-xs font-bold text-white transition-all hover:scale-[1.02]"
            >
              <span>Open Bolt</span>
              <ExternalLink size={12} className="text-white" />
            </a>
          </div>

          {/* Core / Max State: Query and show real roadmap summary */}
          {!isBasic ? (
            <div className="space-y-6 relative z-10">
              <div className="p-5 sm:p-6 rounded-2xl bg-black/50 border border-white/15 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {boltProgress.completedCount}
                    </span>
                    <span className="text-neutral-300 text-sm font-medium">
                      of {boltProgress.totalCount} roadmap items completed
                    </span>
                  </div>
                  <p className="text-xs text-white/80">
                    Real-time count retrieved directly from the shared Bolt progress table.
                  </p>
                </div>

                <div className="w-full sm:w-48 space-y-1.5 shrink-0">
                  <div className="flex justify-between text-[10px] font-mono text-neutral-300 font-semibold">
                    <span>ROADMAP PROGRESS</span>
                    <span className="text-white font-bold">{boltProgress.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 p-[1px] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-white via-white/90 to-white/70 rounded-full transition-all duration-700 shadow-[0_0_10px_#ffffff]"
                      style={{ width: `${Math.max(4, boltProgress.percentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 shadow-sm">
                  <span className="text-neutral-400 block text-[10px] uppercase font-mono mb-1 font-semibold">Architecture</span>
                  <span className="text-white font-bold">6 Core Categories</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 shadow-sm">
                  <span className="text-neutral-400 block text-[10px] uppercase font-mono mb-1 font-semibold">Ecosystem Status</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                    Synchronized Active
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 shadow-sm">
                  <span className="text-neutral-400 block text-[10px] uppercase font-mono mb-1 font-semibold">Connected Tier</span>
                  <span className="text-white font-bold">Bolt {planData.plan.toUpperCase()}</span>
                </div>
              </div>

              <div className="sm:hidden pt-2">
                <a
                  href="https://bolt.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-white/[0.08] border border-white/20 text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <span>Open Bolt Studio</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : (
            /* Basic / None State: Locked Section Visual Pattern */
            <div className="relative rounded-2xl p-6 sm:p-8 bg-black/60 border border-white/15 text-center overflow-hidden shadow-inner relative z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
              <div className="max-w-md mx-auto relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center mx-auto text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Unlock Bolt Access with Core or Max</h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Bolt roadmap synchronization and 6-category execution tracking are available on Bolt Core and Max plans.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onGoToPricing}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:scale-105"
                  >
                    <span>View Pricing & Upgrade</span>
                    <ArrowRight size={13} />
                  </button>
                  <a
                    href="https://whop.com/qreato/ai-leverage"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
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
          className="rounded-[32px] p-6 sm:p-8 relative overflow-hidden transition-all duration-300 group hover:border-white/40"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.03)",
          }}
        >
          {/* Top light sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/15 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.25)] shrink-0">
              <UserIcon size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Profile Identity
              </h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                Synchronized with the shared Bolt profiles table
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserIcon size={13} className="text-white" />
                  <span>Full / Display Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-white/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <AtSign size={13} className="text-white" />
                  <span>Username / Handle</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex_growth"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-white/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Email (Read-only reference from Auth) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Mail size={13} className="text-white" />
                <span>Email Address (Primary Auth)</span>
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-neutral-400 text-xs cursor-not-allowed shadow-inner"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText size={13} className="text-white" />
                <span>Bio / Operator Context</span>
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your marketing offer, audience, or direct response focus..."
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-white/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/20 transition-all custom-scrollbar resize-none shadow-inner"
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
                      className="flex items-center gap-2 text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md"
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
                      className="flex items-center gap-2 text-xs font-bold text-red-400 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-md"
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
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-white text-black hover:bg-neutral-100 text-xs font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.35)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
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
