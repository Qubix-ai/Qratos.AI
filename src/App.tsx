import { useState, useEffect } from "react";
import { onAuthStateChanged, User, signInAnonymously } from "firebase/auth";
import { auth } from "./lib/firebase";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { AdminDashboard } from "./components/AdminDashboard";
import { SplashScreen } from "./components/SplashScreen";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Transition away from splash screen after 1.5s
    const splashTimer = setTimeout(() => {
      if (isMounted) setShowSplash(false);
    }, 1500);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!isMounted) return;
      
      if (u) {
        setUser(u);
        try {
          const token = await u.getIdToken();
          const res = await fetch("/api/user/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setUserData(data);
            }
          }
        } catch (e) {
          console.error("Error initializing user session:", e);
        }
        setLoading(false);
      } else {
        // No user - sign in anonymously immediately
        signInAnonymously(auth).catch(err => {
          console.error("Anonymous auth failed:", err);
          setLoading(false);
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(splashTimer);
    };
  }, []);

  if (loading || showSplash) {
    return <SplashScreen />;
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
          if (tab === "chat" && !activeSessionId) {
             // Reset to newest? Or just let it be.
          }
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
          <motion.div
            key={showAdmin ? "admin" : activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 h-full min-h-0"
          >
            {showAdmin ? (
              <AdminDashboard onClose={() => setShowAdmin(false)} />
            ) : (
              <ChatInterface 
                user={user} 
                userData={userData} 
                activeTab={activeTab} 
                activeSessionId={activeSessionId}
                onSessionChange={(id) => setActiveSessionId(id)}
                onMenuToggle={() => setSidebarOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
