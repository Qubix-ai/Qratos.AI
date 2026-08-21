import { useState, useEffect } from "react";
import { supabase, MurgiiMode } from "./lib/supabase";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { ChatInterface } from "./components/ChatInterface";
import { PromptBuilder } from "./components/PromptBuilder";
import { PricingPage } from "./components/PricingPage";
import { AccountPage } from "./components/AccountPage";
import { MemoryPage } from "./components/MemoryPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { LandingPage } from "./components/LandingPage";
import { SplashScreen } from "./components/SplashScreen";
import { AuthModal } from "./components/AuthModal";
import { AnimatePresence, motion } from "motion/react";
import { FilmGrainOverlay } from "./components/FilmGrainOverlay";
import { AmbientBackground } from "./components/AmbientBackground";
import { SpotlightCursor } from "./components/SpotlightCursor";
import { fetchUserPlan, UserPlanData } from "./lib/userAccount";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userPlanData, setUserPlanData] = useState<UserPlanData>({ plan: "none", maxCredits: 20 });
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [pendingPrompt, setPendingPrompt] = useState<{ text: string; mode: MurgiiMode; autoSubmit?: boolean } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("signup");

  const loadUserData = async (currentUser: any) => {
    if (currentUser?.id) {
      try {
        const plan = await fetchUserPlan(currentUser.id, currentUser.user_metadata);
        setUserPlanData(plan);
      } catch (err) {
        console.warn("Could not fetch user plan:", err);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Splash Screen Timer (2s)
    const splashTimer = setTimeout(() => {
      if (isMounted) setShowSplash(false);
    }, 2000);

    // Initial Supabase Session Check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Supabase getSession error:", error);
      }
      if (isMounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          loadUserData(currentUser);
          setActiveTab("chat");
        }
        setLoading(false);
      }
    });

    // Supabase Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (event === "SIGNED_IN" && currentUser) {
          loadUserData(currentUser);
          setActiveTab("chat");
        } else if (event === "SIGNED_OUT") {
          setUserPlanData({ plan: "none", maxCredits: 20 });
          setRemainingCredits(null);
          setActiveTab("landing");
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(splashTimer);
    };
  }, []);

  const handleStartWriting = (mode: "login" | "signup" = "signup") => {
    if (user) {
      setActiveTab("chat");
    } else {
      setAuthModalMode(mode);
      setAuthModalOpen(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserPlanData({ plan: "none", maxCredits: 20 });
    setRemainingCredits(null);
    setActiveTab("landing");
    setSidebarOpen(false);
    setShowAdmin(false);
  };

  if (loading) {
    return <SplashScreen />;
  }

  // Full-screen Landing Page
  if (activeTab === "landing" && !showAdmin) {
    return (
      <div className="h-screen bg-[#07060B] overflow-y-auto overflow-x-hidden selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <AnimatePresence>
          {showSplash && <SplashScreen />}
        </AnimatePresence>
        <LandingPage 
          user={user}
          onStart={() => handleStartWriting("signup")}
          onLogin={() => handleStartWriting("login")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            setActiveTab("chat");
          }}
        />
      </div>
    );
  }

  // If user is not logged in and tries to view workspace, route back to landing / open login modal
  if (!user && activeTab !== "landing") {
    return (
      <div className="h-screen bg-[#07060B] overflow-y-auto overflow-x-hidden selection:bg-[#8B5CF6]/40 relative flex items-center justify-center">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <LandingPage 
          user={user}
          onStart={() => handleStartWriting("signup")}
          onLogin={() => handleStartWriting("login")}
        />
        <AuthModal 
          isOpen={true}
          onClose={() => setActiveTab("landing")}
          initialMode="login"
          onSuccess={() => {
            setActiveTab("chat");
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#07060B] text-gray-200 overflow-hidden font-sans relative selection:bg-[#8B5CF6]/40">
      <AmbientBackground />
      <FilmGrainOverlay />
      <SpotlightCursor />
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <Sidebar 
        user={user}
        userData={{
          displayName: user?.email ? user.email.split('@')[0] : "Elite Operator",
          email: user?.email,
          remainingCredits: remainingCredits ?? userPlanData.maxCredits,
          totalCredits: userPlanData.maxCredits,
          plan: userPlanData.plan,
        }} 
        activeTab={activeTab} 
        activeSessionId={activeSessionId}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
          setShowAdmin(false);
        }} 
        onSessionSelect={(id) => {
          setActiveSessionId(id);
          setActiveTab("chat");
        }}
        onLogout={handleLogout}
        onShowAdmin={() => {
          setShowAdmin(true);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden z-20">
        {/* Persistent Top Navigation Bar for Logged-In State */}
        <TopNav
          user={user}
          activeTab={activeTab}
          remainingCredits={remainingCredits}
          maxCredits={userPlanData.maxCredits}
          userPlan={userPlanData.plan}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setShowAdmin(false);
          }}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />

        <div className="flex-1 relative min-h-0 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {showAdmin ? (
              <motion.div
                key="admin"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full min-h-0"
              >
                <AdminDashboard onClose={() => setShowAdmin(false)} />
              </motion.div>
            ) : activeTab === "pricing" ? (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full min-h-0 flex flex-col"
              >
                <PricingPage
                  user={user}
                  onGoToChat={() => setActiveTab("chat")}
                  onGoToAccount={() => setActiveTab("account")}
                />
              </motion.div>
            ) : activeTab === "account" ? (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full min-h-0 flex flex-col"
              >
                <AccountPage
                  user={user}
                  remainingCredits={remainingCredits}
                  onGoToPricing={() => setActiveTab("pricing")}
                  onGoToChat={() => setActiveTab("chat")}
                  onLogout={handleLogout}
                />
              </motion.div>
            ) : activeTab === "memory" ? (
              <motion.div
                key="memory"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full min-h-0 flex flex-col"
              >
                <MemoryPage
                  user={user}
                  onGoToChat={() => setActiveTab("chat")}
                />
              </motion.div>
            ) : activeTab === "prompt-builder" ? (
              <motion.div
                key="prompt-builder"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full min-h-0"
              >
                <PromptBuilder
                  user={user}
                  onSendToWorkspace={(promptText, mode) => {
                    setPendingPrompt({ text: promptText, mode, autoSubmit: true });
                    setActiveTab("chat");
                  }}
                  onGoToChat={() => setActiveTab("chat")}
                  onMenuToggle={() => setSidebarOpen(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full min-h-0 flex flex-col"
              >
                <ChatInterface 
                  user={user} 
                  activeTab={activeTab} 
                  activeSessionId={activeSessionId}
                  pendingPrompt={pendingPrompt}
                  remainingCredits={remainingCredits}
                  onRemainingCreditsChange={(credits) => setRemainingCredits(credits)}
                  onClearPendingPrompt={() => setPendingPrompt(null)}
                  onSessionChange={(id) => setActiveSessionId(id)}
                  onMenuToggle={() => setSidebarOpen(true)}
                  onGoHome={() => setActiveTab("landing")}
                  onGoToPricing={() => setActiveTab("pricing")}
                  onGoToAccount={() => setActiveTab("account")}
                  onLogout={handleLogout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          setAuthModalOpen(false);
          setActiveTab("chat");
        }}
      />
    </div>
  );
}
