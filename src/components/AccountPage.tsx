import { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  Coins, 
  ShieldCheck, 
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
  const [, setProfile] = useState<UserProfile | null>(null);
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
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccountData() {
      const uid = user?.id || user?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        const [prof, freshPlanAndCredits, bolt] = await Promise.all([
          fetchUserProfile(user),
          fetchUserPlanAndCredits(uid, remainingCredits ?? undefined, user.user_metadata, user.email),
          fetchBoltProgress(uid),
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
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#07060B] text-white overflow-y-auto custom-scrollbar relative">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10 space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold mb-1">
              Operator Terminal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-nohemi">
              Account &amp; Profile Settings
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage your shared identity, plan subscriptions, and connected Bolt roadmap activity.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onGoToChat}
              className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Workspace
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* CONSOLIDATED PLAN & CREDITS CARD */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0B14] border border-zinc-800 space-y-6">
          
          {/* Active Plan Header & Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0 mt-0.5">
                {isMax ? <Crown size={18} /> : isCore ? <Zap size={18} /> : <ShieldCheck size={18} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white font-nohemi">
                    {isMax ? "Murgii Max / High Velocity" : isCore ? "Murgii Core / Leverage" : "Murgii Basic (Free)"}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">
                    • {planData.plan === "none" || planData.plan === "basic" ? "BASIC (FREE)" : `${planData.plan.toUpperCase()} TIER`}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {planData.maxCredits} AI credits replenished every 24 hours
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToPricing}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <span>{isMax ? "View Plan Tiers" : "Upgrade Plan"}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Daily Credits Remaining */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins size={15} className="text-zinc-400" />
                <span className="text-xs font-bold text-zinc-300">Daily Credits Remaining</span>
              </div>
              <div className="text-xs font-mono text-zinc-400">
                <span className="text-sm font-bold text-white">{effectiveCredits}</span> / {planData.maxCredits} ({creditsPercentage}% available)
              </div>
            </div>

            {/* Flat Minimal Progress Bar */}
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${Math.max(2, Math.min(100, creditsPercentage))}%` }}
              />
            </div>

            <p className="text-[11px] text-zinc-500 font-mono">
              Replenishes automatically every 24 hours.
            </p>
          </div>

        </div>

        {/* SHARED BOLT ROADMAP ACTIVITY SECTION */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0B14] border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} className="text-zinc-400 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight font-nohemi">
                  Bolt Roadmap Activity
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Shared execution state from the Bolt 6-category growth roadmap
                </p>
              </div>
            </div>

            <a
              href="https://bolt.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              <span>Open Bolt</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Core / Max State: Query and show real roadmap summary */}
          {!isBasic ? (
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-white font-mono">
                      {boltProgress.completedCount}
                    </span>
                    <span className="text-zinc-400 text-xs font-medium">
                      of {boltProgress.totalCount} roadmap items completed
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Real-time count retrieved directly from the shared Bolt progress table.
                  </p>
                </div>

                <div className="w-full sm:w-48 space-y-1.5 shrink-0">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 font-semibold">
                    <span>PROGRESS</span>
                    <span className="text-white font-bold">{boltProgress.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, boltProgress.percentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono mb-1 font-semibold">Architecture</span>
                  <span className="text-zinc-200 font-bold">6 Core Categories</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono mb-1 font-semibold">Ecosystem Status</span>
                  <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Synchronized Active
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono mb-1 font-semibold">Connected Tier</span>
                  <span className="text-zinc-200 font-bold">Bolt {planData.plan.toUpperCase()}</span>
                </div>
              </div>

              <div className="sm:hidden pt-1">
                <a
                  href="https://bolt.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 flex items-center justify-center gap-2"
                >
                  <span>Open Bolt Studio</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : (
            /* Basic / None State: Locked Section Visual Pattern */
            <div className="rounded-xl p-6 sm:p-8 bg-zinc-950 border border-zinc-800 text-center space-y-4">
              <Lock size={20} className="text-zinc-400 mx-auto" />
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-bold text-white font-nohemi">Unlock Bolt Access with Core or Max</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bolt roadmap synchronization and 6-category execution tracking are available on Bolt Core and Max plans.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onGoToPricing}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>View Pricing &amp; Upgrade</span>
                  <ArrowRight size={13} />
                </button>
                <a
                  href="https://whop.com/qreato/ai-leverage"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Whop Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* EDITABLE PROFILE SECTION */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0B14] border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <UserIcon size={18} className="text-zinc-400 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-nohemi">
                Profile Identity
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Synchronized with the shared Bolt profiles table
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Full / Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Username / Handle
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex_growth"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            {/* Email (Read-only reference from Auth) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Email Address (Primary Auth)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-500 text-xs cursor-not-allowed"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Bio / Operator Context
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your marketing offer, audience, or direct response focus..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
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
                      className="flex items-center gap-2 text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60"
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
                      className="flex items-center gap-2 text-xs font-bold text-red-400 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/60"
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
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
