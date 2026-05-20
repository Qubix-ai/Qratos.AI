import { useState, useEffect } from "react";
import { onAuthStateChanged, User, signInAnonymously } from "firebase/auth";
import { auth } from "./lib/firebase";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { AdminDashboard } from "./components/AdminDashboard";
import { LandingPage } from "./components/LandingPage";
import { SplashScreen } from "./components/SplashScreen";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, Target, Zap, ShieldCheck, BrainCircuit, Sparkles } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Transition away from splash screen after 2s
    const splashTimer = setTimeout(() => {
      if (isMounted) setShowSplash(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!isMounted) return;
      
      if (u) {
        setUser(u);
        try {
          const token = await u.getIdToken();
          const headers: Record<string, string> = {};
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
          const res = await fetch("/api/user/me", { headers });
          
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setUserData(data);
            }
          }
        } catch (e) {
          console.error("Error initializing user session:", e);
        }
      } else {
        // No user - sign in anonymously immediately
        signInAnonymously(auth).catch(err => {
          console.warn("Anonymous auth restricted or disabled in Firebase. Continuing as guest.", err);
          // We don't throw - user will just have null 'user' and app will still load
        }).finally(() => {
          if (isMounted) setLoading(false);
        });
        return; // loading will be set in finally
      }
      // Set loading false once auth state resolved (already signed in)
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(splashTimer);
    };
  }, []);

  // Return landing/chat structure always after initial loading
  if (loading) {
    return <SplashScreen />;
  }

  // Full-screen Landing Page to match user vision
  if (activeTab === "landing" && !showAdmin) {
    return (
      <div className="h-screen bg-[#050505] overflow-y-auto overflow-x-hidden selection:bg-[#FFB52E]/30">
        <AnimatePresence>
          {showSplash && <SplashScreen />}
        </AnimatePresence>
        <LandingPage onStart={() => setActiveTab("chat")} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-gray-200 overflow-hidden font-sans relative selection:bg-[#FFB52E]/30">
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <Sidebar 
        user={user}
        userData={userData} 
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
        onLogout={() => auth.signOut()}
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
                userData={userData} 
                activeTab={activeTab} 
                activeSessionId={activeSessionId}
                onSessionChange={(id) => setActiveSessionId(id)}
                onMenuToggle={() => setSidebarOpen(true)}
                onGoHome={() => setActiveTab("landing")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

