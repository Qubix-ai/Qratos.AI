import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { AdminDashboard } from "./components/AdminDashboard";
import { LandingPage } from "./components/LandingPage";
import { SplashScreen } from "./components/SplashScreen";
import { AuthModal } from "./components/AuthModal";
import { AnimatePresence, motion } from "motion/react";
import { FilmGrainOverlay } from "./components/FilmGrainOverlay";
import { SpotlightCursor } from "./components/SpotlightCursor";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("signup");

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
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Supabase Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        if (session?.user && activeTab === "landing") {
          // If user logged in while on landing, they can continue or go to chat
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
      <div className="h-screen bg-[#050505] overflow-y-auto overflow-x-hidden selection:bg-[#FFB52E]/30 relative">
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
      <div className="h-screen bg-[#050505] overflow-y-auto overflow-x-hidden selection:bg-[#FFB52E]/30 relative flex items-center justify-center">
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
    <div className="flex h-screen bg-[#050505] text-gray-200 overflow-hidden font-sans relative selection:bg-[#FFB52E]/30">
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
        <AnimatePresence mode="popLayout" initial={false}>
          {showAdmin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 h-full min-h-0"
            >
              <AdminDashboard onClose={() => setShowAdmin(false)} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 h-full min-h-0"
            >
              <ChatInterface 
                user={user} 
                activeTab={activeTab} 
                activeSessionId={activeSessionId}
                onSessionChange={(id) => setActiveSessionId(id)}
                onMenuToggle={() => setSidebarOpen(true)}
                onGoHome={() => setActiveTab("landing")}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
