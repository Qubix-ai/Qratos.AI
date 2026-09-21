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
  Crown,
  Trash2,
  AlertTriangle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  fetchUserProfile, 
  updateUserProfile, 
  fetchUserPlanAndCredits,
  fetchBoltProgress, 
  deleteUserAccountAndData,
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

  // Account Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    if (deleteConfirmationInput.trim().toUpperCase() !== "DELETE") {
      setDeleteError('Please type "DELETE" exactly to confirm.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteUserAccountAndData(user.id, user.email);
      if (!result.success) {
        setDeleteError(result.error || "Failed to execute account deletion.");
        setIsDeleting(false);
        return;
      }

      setShowDeleteModal(false);
      // Log out and reset root app state
      onLogout();
    } catch (err: any) {
      console.error("Account deletion failed:", err);
      setDeleteError(err?.message || "An unexpected error occurred during account deletion.");
      setIsDeleting(false);
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

        {/* Section 3: Danger Zone - Account & Multi-Table Data Deletion */}
        <div className="rounded-2xl bg-[#0E0D14] border border-red-900/40 p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-red-400">
                <AlertTriangle size={14} />
                <span>Danger Zone</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight font-nohemi">
                Delete Account &amp; Purge Stored Data
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                Permanently purge your account identity and all associated database records across{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">profiles</code>,{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">progress</code>,{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">quick_notes</code>,{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">user_plan</code>,{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">chat_sessions</code>,{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">chat_messages</code>,{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">murgii_usage</code>,{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">murgii_memory</code>, and{" "}
                <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">challenge_results</code>.
              </p>
            </div>

            <button
              id="account-open-delete-modal-btn"
              type="button"
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteConfirmationInput("");
                setDeleteError(null);
              }}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 hover:text-red-100 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

      </div>

      {/* Account Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div 
            id="account-delete-modal-backdrop" 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              id="account-delete-modal-card"
              className="relative w-full max-w-[480px] rounded-3xl bg-[#0F0C10] border border-red-500/30 p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden z-10 space-y-6"
            >
              {/* Close Button */}
              <button
                id="account-delete-modal-close-btn"
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 transition-colors cursor-pointer disabled:opacity-30"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Geist',sans-serif]">
                    Permanently Delete Account
                  </h3>
                  <p className="text-xs text-red-300/80 font-mono mt-0.5">
                    Irreversible Multi-Table Purge
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-neutral-300 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/5">
                <p>
                  This action will permanently delete your user profile and execute a full purge across all tables storing your data:
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-neutral-400">
                  <li><strong className="text-neutral-200">profiles</strong> &amp; authentication credentials</li>
                  <li><strong className="text-neutral-200">chat_sessions</strong> &amp; <strong className="text-neutral-200">chat_messages</strong></li>
                  <li><strong className="text-neutral-200">murgii_memory</strong> &amp; brand context records</li>
                  <li><strong className="text-neutral-200">murgii_usage</strong> &amp; credit generation history</li>
                  <li><strong className="text-neutral-200">challenge_results</strong> score diagnostic cards</li>
                  <li><strong className="text-neutral-200">progress</strong>, <strong className="text-neutral-200">quick_notes</strong> &amp; <strong className="text-neutral-200">user_plan</strong></li>
                </ul>
                <p className="text-red-400 font-semibold pt-1">
                  Once deleted, your copy sequences and account history cannot be recovered.
                </p>
              </div>

              {deleteError && (
                <div className="rounded-xl border border-red-500/30 bg-red-950/50 p-3 text-xs text-red-200 flex items-start gap-2">
                  <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[11px] font-mono font-semibold text-neutral-300 uppercase tracking-wider">
                  Type <span className="text-red-400 font-bold">DELETE</span> to confirm:
                </label>
                <input
                  id="account-delete-confirmation-input"
                  type="text"
                  value={deleteConfirmationInput}
                  onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                  placeholder="DELETE"
                  disabled={isDeleting}
                  className="w-full bg-black/60 py-2.5 px-3.5 rounded-xl border border-red-500/30 text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500 font-mono text-sm uppercase tracking-widest disabled:opacity-50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  id="account-confirm-delete-btn"
                  type="button"
                  disabled={isDeleting || deleteConfirmationInput.trim().toUpperCase() !== "DELETE"}
                  onClick={handleDeleteAccount}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Purging All Data...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      <span>Permanently Delete Everything</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
