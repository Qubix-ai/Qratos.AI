import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, signInWithGoogle } from "./lib/firebase";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { AdminDashboard } from "./components/AdminDashboard";
import { LandingPage } from "./components/LandingPage";
import { AnimatePresence, motion } from "motion/react";
import { BrainCircuit, LayoutDashboard } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const token = await u.getIdToken();
          const res = await fetch("/api/user/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setUserData(data);
        } catch (e) {
          console.error("Failed to fetch user data", e);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => auth.signOut();

  if (loading) {
    return <div className="min-h-screen bg-[#050505]" />; // Silent load
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#050505] text-gray-200 overflow-hidden font-sans relative selection:bg-[#FFB52E]/30">
      {/* Cinematic Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#FFB52E]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-900/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar 
        userData={userData} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
          setShowAdmin(false);
        }} 
        activeTab={activeTab} 
        onLogout={handleLogout}
        onShowAdmin={() => {
          setShowAdmin(true);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden z-20">
        {/* Mobile Header - Luxury Metallic */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl z-40">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFB52E] to-[#E2A72E]/50 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(255,181,46,0.4)]">
                 <BrainCircuit size={20} className="text-black" />
              </div>
              <div className="flex flex-col">
                <div className="tracking-tighter text-sm leading-none text-white">
                  <span className="font-extrabold">QRATOS</span>
                  <span className="font-light">.AI</span>
                </div>
                <span className="text-[8px] font-sans text-[#FFB52E] tracking-widest uppercase">PERSUASION OS</span>
              </div>
           </div>
           <button 
             onClick={() => setSidebarOpen(true)}
             className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white active:scale-95 transition-all"
           >
             <LayoutDashboard size={20} />
           </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={showAdmin ? "admin" : activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 h-full min-h-0"
          >
            {showAdmin ? (
              <AdminDashboard onClose={() => setShowAdmin(false)} />
            ) : (
              <ChatInterface user={user} userData={userData} activeTab={activeTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
