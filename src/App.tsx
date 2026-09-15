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
import { AuthModal } from "./components/AuthModal";
import { ChallengePage } from "./components/ChallengePage";
import { TermsPage } from "./components/TermsPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { RefundPolicyPage } from "./components/RefundPolicyPage";
import { PlatformRulesPage } from "./components/PlatformRulesPage";
import { GeneralRulesPage } from "./components/GeneralRulesPage";
import { MediaPage } from "./components/MediaPage";
import { EnterprisePage } from "./components/EnterprisePage";
import { SecurityPage } from "./components/SecurityPage";
import { TrustCentrePage } from "./components/TrustCentrePage";
import { LearnPage } from "./components/LearnPage";
import { GuidesPage } from "./components/GuidesPage";
import { AffiliatesPage } from "./components/AffiliatesPage";
import { SupportPage } from "./components/SupportPage";
import { ReviewsPage } from "./components/ReviewsPage";
import { AnimatePresence, motion } from "motion/react";
import { FilmGrainOverlay } from "./components/FilmGrainOverlay";
import { AmbientBackground } from "./components/AmbientBackground";
import { SpotlightCursor } from "./components/SpotlightCursor";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { fetchUserPlan, fetchUserPlanAndCredits, UserPlanData } from "./lib/userAccount";
import { loadUserSessions, createChatSession, notifySessionsChanged, getSessionById, SESSIONS_UPDATED_EVENT } from "./lib/chatHistory";

const LAST_ACTIVE_SESSION_KEY = "murgii_last_active_session_id";

export default function App() {
  const getSlugFromPath = (pathname?: string) => {
    if (typeof window === "undefined" && !pathname) return null;
    const path = pathname || window.location.pathname;
    const match = path.match(/^\/challenge\/([^/?#]+)/i);
    return match ? match[1] : null;
  };

  const getRouteFromPath = (pathname?: string): string => {
    if (typeof window === "undefined" && !pathname) return "landing";
    const p = (pathname || window.location.pathname).toLowerCase();

    if (p.startsWith("/challenge")) return "challenge";
    if (p === "/terms") return "terms";
    if (p === "/privacy") return "privacy";
    if (p === "/refund-policy" || p === "/refund") return "refund-policy";
    if (p === "/platform-rules" || p === "/rules") return "platform-rules";
    if (p === "/general-rules" || p === "/general") return "general-rules";
    if (p === "/media" || p === "/press") return "media";
    if (p === "/enterprise" || p === "/teams") return "enterprise";
    if (p === "/security") return "security";
    if (p === "/trust-centre" || p === "/trust-center" || p === "/trust") return "trust-centre";
    if (p === "/learn" || p === "/getting-started") return "learn";
    if (p === "/guides" || p === "/guide") return "guides";
    if (p === "/affiliates" || p === "/affiliate" || p === "/partner" || p === "/partners") return "affiliates";
    if (p === "/support" || p === "/help" || p === "/contact") return "support";
    if (p === "/reviews" || p === "/testimonials") return "reviews";

    return "landing";
  };

  const initialPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const initialRoute = getRouteFromPath(initialPath);
  const [currentRoute, setCurrentRoute] = useState<string>(initialRoute);
  const [challengeSlug, setChallengeSlug] = useState<string | null>(getSlugFromPath(initialPath));

  const [user, setUser] = useState<any>(null);
  const [userPlanData, setUserPlanData] = useState<UserPlanData>({ plan: "none", maxCredits: 3 });
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(initialRoute !== "landing" ? initialRoute : "landing");
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [activeSessionTitle, setActiveSessionTitle] = useState<string>("New chat");
  const [pendingPrompt, setPendingPrompt] = useState<{ text: string; mode: MurgiiMode; autoSubmit?: boolean } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("signup");

  const navigate = (target: string, pushState = true) => {
    let route = target;
    let path = "/";
    let slug: string | null = null;

    if (target.startsWith("/challenge/") || target === "challenge" || target === "/challenge") {
      route = "challenge";
      if (target.startsWith("/challenge/")) {
        slug = target.split("/challenge/")[1]?.split("/")[0]?.split("?")[0] || null;
        path = target;
      } else {
        path = "/challenge";
      }
    } else if (target === "terms" || target === "/terms") {
      route = "terms";
      path = "/terms";
    } else if (target === "privacy" || target === "/privacy") {
      route = "privacy";
      path = "/privacy";
    } else if (target === "refund-policy" || target === "refund" || target === "/refund-policy" || target === "/refund") {
      route = "refund-policy";
      path = "/refund-policy";
    } else if (target === "platform-rules" || target === "rules" || target === "/platform-rules" || target === "/rules") {
      route = "platform-rules";
      path = "/platform-rules";
    } else if (target === "general-rules" || target === "general" || target === "/general-rules" || target === "/general") {
      route = "general-rules";
      path = "/general-rules";
    } else if (target === "media" || target === "press" || target === "/media" || target === "/press") {
      route = "media";
      path = "/media";
    } else if (target === "enterprise" || target === "teams" || target === "/enterprise" || target === "/teams") {
      route = "enterprise";
      path = "/enterprise";
    } else if (target === "security" || target === "/security") {
      route = "security";
      path = "/security";
    } else if (target === "trust-centre" || target === "trust-center" || target === "trust" || target === "/trust-centre" || target === "/trust-center" || target === "/trust") {
      route = "trust-centre";
      path = "/trust-centre";
    } else if (target === "learn" || target === "getting-started" || target === "/learn" || target === "/getting-started") {
      route = "learn";
      path = "/learn";
    } else if (target === "guides" || target === "guide" || target === "/guides" || target === "/guide") {
      route = "guides";
      path = "/guides";
    } else if (target === "affiliates" || target === "affiliate" || target === "partner" || target === "partners" || target === "/affiliates" || target === "/affiliate") {
      route = "affiliates";
      path = "/affiliates";
    } else if (target === "support" || target === "contact" || target === "/support" || target === "/contact") {
      route = "support";
      path = "/support";
    } else if (target === "reviews" || target === "testimonials" || target === "/reviews" || target === "/testimonials") {
      route = "reviews";
      path = "/reviews";
    } else if (target === "chat" || target === "workspace" || target === "ai" || target === "/chat") {
      route = "chat";
      path = "/";
    } else if (target === "pricing" || target === "/pricing") {
      route = "pricing";
      path = "/pricing";
    } else if (target === "prompt-builder" || target === "/prompt-builder") {
      route = "prompt-builder";
      path = "/prompt-builder";
    } else if (target === "account" || target === "/account") {
      route = "account";
      path = "/account";
    } else if (target === "memory" || target === "/memory") {
      route = "memory";
      path = "/memory";
    } else {
      route = "landing";
      path = "/";
    }

    if (pushState && typeof window !== "undefined") {
      window.history.pushState({}, "", path);
    }

    setCurrentRoute(route);
    setChallengeSlug(slug);
    setActiveTab(route);
  };

  useEffect(() => {
    const handlePopState = () => {
      const slug = getSlugFromPath();
      const route = getRouteFromPath();
      setChallengeSlug(slug);
      setCurrentRoute(slug ? "challenge" : route);
      setActiveTab(slug ? "challenge" : route);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const loadUserData = async (currentUser: any, knownRemaining?: number) => {
    const uid = currentUser?.id || currentUser?.uid;
    if (uid) {
      try {
        const { planData, remainingCredits: freshCredits } = await fetchUserPlanAndCredits(
          uid,
          knownRemaining,
          currentUser.user_metadata,
          currentUser.email
        );
        setUserPlanData(planData);
        setRemainingCredits(freshCredits);
        return { planData, remainingCredits: freshCredits };
      } catch (err) {
        console.warn("Could not fetch user plan and credit usage from Supabase:", err);
      }
    }
    return null;
  };

  const syncInitialSession = async (userId: string) => {
    if (!userId) return;
    console.log(`[Supabase Chat] App mounting/authenticating. Syncing initial active session for user: ${userId}`);
    try {
      const sessions = await loadUserSessions(userId);
      console.log(`[Supabase Chat] Initial session query returned ${sessions.length} sessions from Supabase.`);

      const storedSessionId = typeof window !== "undefined" ? localStorage.getItem(LAST_ACTIVE_SESSION_KEY) : null;

      if (storedSessionId && sessions.some((s) => s.id === storedSessionId)) {
        console.log(`[Supabase Chat] Restoring last active session on initial load/refresh: ${storedSessionId}`);
        setActiveSessionId(storedSessionId);
      } else if (sessions.length > 0) {
        console.log(`[Supabase Chat] Selecting most recent session on initial load/refresh: ${sessions[0].id}`);
        setActiveSessionId(sessions[0].id);
        localStorage.setItem(LAST_ACTIVE_SESSION_KEY, sessions[0].id);
      } else {
        console.log("[Supabase Chat] No existing chat sessions found in Supabase. Creating initial session in chat_sessions...");
        const newSession = await createChatSession(userId, "New Conversation");
        if (newSession) {
          console.log(`[Supabase Chat] Created initial session in Supabase: ${newSession.id}`);
          setActiveSessionId(newSession.id);
          localStorage.setItem(LAST_ACTIVE_SESSION_KEY, newSession.id);
        }
      }
    } catch (e) {
      console.error("[Supabase Chat Error] Exception syncing initial session:", e);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Initial Supabase Session Check
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error("Supabase getSession error:", error);
      }
      if (isMounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          loadUserData(currentUser);
          syncInitialSession(currentUser.id);
        }
        setAuthResolved(true);
      }
    });

    // Supabase Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isMounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser && event === "SIGNED_IN") {
          setActiveTab("chat");
          loadUserData(currentUser);
          syncInitialSession(currentUser.id);
        } else if (currentUser) {
          loadUserData(currentUser);
          syncInitialSession(currentUser.id);
        } else if (event === "SIGNED_OUT") {
          setUserPlanData({ plan: "none", maxCredits: 3 });
          setRemainingCredits(null);
          setActiveTab("landing");
        }
        setAuthResolved(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSessionSelect = (id: string) => {
    console.log(`[Supabase Chat] User selected session: ${id}`);
    setActiveSessionId(id);
    if (id) {
      localStorage.setItem(LAST_ACTIVE_SESSION_KEY, id);
    } else {
      localStorage.removeItem(LAST_ACTIVE_SESSION_KEY);
    }
    setActiveTab("chat");
  };

  const handleCreateNewSession = async () => {
    const uid = user?.id || user?.uid;
    if (!uid) return;
    console.log("[Supabase Chat] User requested new chat session in App...");
    const newSession = await createChatSession(uid, "New Conversation");
    if (newSession) {
      console.log(`[Supabase Chat] New session inserted into Supabase with ID: ${newSession.id}`);
      setActiveSessionId(newSession.id);
      localStorage.setItem(LAST_ACTIVE_SESSION_KEY, newSession.id);
      setActiveTab("chat");
      notifySessionsChanged();
    }
  };

  useEffect(() => {
    let isMounted = true;
    const syncTitle = async () => {
      if (!activeSessionId) {
        if (isMounted) setActiveSessionTitle("New chat");
        return;
      }
      const uid = user?.id || user?.uid;
      if (!uid) return;
      try {
        const sess = await getSessionById(uid, activeSessionId);
        if (isMounted) {
          if (sess && sess.title) {
            setActiveSessionTitle(sess.title);
          } else {
            setActiveSessionTitle("New chat");
          }
        }
      } catch {
        if (isMounted) setActiveSessionTitle("New chat");
      }
    };

    syncTitle();
    const handleUpdate = () => syncTitle();
    window.addEventListener(SESSIONS_UPDATED_EVENT, handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener(SESSIONS_UPDATED_EVENT, handleUpdate);
    };
  }, [activeSessionId, user]);

  const handleStartWriting = (mode: "login" | "signup" = "signup") => {
    if (user) {
      setActiveTab("chat");
    } else {
      setAuthModalMode(mode);
      setAuthModalOpen(true);
    }
  };

  const handleStartChallenge = (initialText?: string) => {
    if (user) {
      setPendingPrompt({
        text: initialText || "",
        mode: "challenge",
        autoSubmit: !!(initialText && initialText.trim().length > 0)
      });
      setActiveTab("chat");
    } else {
      if (initialText) {
        setPendingPrompt({
          text: initialText,
          mode: "challenge",
          autoSubmit: true
        });
      } else {
        setPendingPrompt({
          text: "",
          mode: "challenge",
          autoSubmit: false
        });
      }
      handleStartWriting("signup");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserPlanData({ plan: "none", maxCredits: 3 });
    setRemainingCredits(null);
    navigate("landing");
    setSidebarOpen(false);
    setShowAdmin(false);
  };

  if (challengeSlug || currentRoute === "challenge") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <ErrorBoundary fallbackTitle="Challenge Scorecard Error" onReset={() => navigate("landing")}>
          <ChallengePage 
            slug={challengeSlug || ""}
            onGoToHome={() => navigate("landing")}
            onGoToSignup={() => {
              if (user) {
                navigate("chat");
              } else {
                navigate("landing");
                handleStartWriting("signup");
              }
            }}
          />
        </ErrorBoundary>
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "terms") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <TermsPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "privacy") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <PrivacyPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "refund-policy") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <RefundPolicyPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "platform-rules") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <PlatformRulesPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "general-rules") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <GeneralRulesPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "media") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <MediaPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "enterprise") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <EnterprisePage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "security") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <SecurityPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "trust-centre") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <TrustCentrePage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
          onNavigatePolicy={(key) => navigate(key)}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "learn") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <LearnPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
          onNavigate={(tab) => {
            if (tab === "memory" && !user) {
              handleStartWriting("login");
            } else if (tab === "challenge") {
              handleStartChallenge();
            } else if (tab === "chat" && !user) {
              handleStartWriting("login");
            } else {
              navigate(tab);
            }
          }}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "guides") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <GuidesPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
          onNavigate={(tab) => {
            if (tab === "chat" && !user) {
              handleStartWriting("login");
            } else {
              navigate(tab);
            }
          }}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "support") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <SupportPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
          onNavigate={(tab) => {
            if (tab === "chat" && !user) {
              handleStartWriting("login");
            } else {
              navigate(tab);
            }
          }}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "reviews") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <ReviewsPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
          onNavigate={(tab) => {
            if (tab === "chat" && !user) {
              handleStartWriting("login");
            } else {
              navigate(tab);
            }
          }}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  if (currentRoute === "affiliates") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <AffiliatesPage 
          onGoToHome={() => navigate("landing")}
          onGoToChat={() => navigate(user ? "chat" : "landing")}
          onNavigate={(tab) => {
            if (tab === "chat" && !user) {
              handleStartWriting("login");
            } else {
              navigate(tab);
            }
          }}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </div>
    );
  }

  // Full-screen Landing Page
  if (activeTab === "landing" && !showAdmin) {
    return (
      <motion.div 
        key="landing-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-screen bg-[#07060B] overflow-y-auto overflow-x-hidden selection:bg-[#8B5CF6]/40 relative"
      >
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <LandingPage 
          user={user}
          userData={userPlanData}
          onStart={() => handleStartWriting("signup")}
          onLogin={() => handleStartWriting("login")}
          onStartChallenge={handleStartChallenge}
          onNavigate={(tab) => {
            if (tab === "challenge") {
              handleStartChallenge();
            } else if ((tab === "chat" || tab === "workspace" || tab === "ai" || tab === "account" || tab === "memory") && !user) {
              handleStartWriting("login");
            } else {
              navigate(tab);
            }
          }}
        />
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigate("chat");
          }}
        />
      </motion.div>
    );
  }

  // If user is not logged in and tries to view private workspace sections, route back to landing / open login modal
  if (!user && (activeTab === "chat" || activeTab === "account" || activeTab === "memory")) {
    return (
      <motion.div 
        key="unauth-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-screen bg-[#07060B] overflow-y-auto overflow-x-hidden selection:bg-[#8B5CF6]/40 relative flex items-center justify-center"
      >
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <LandingPage 
          user={user}
          userData={userPlanData}
          onStart={() => handleStartWriting("signup")}
          onLogin={() => handleStartWriting("login")}
          onStartChallenge={handleStartChallenge}
          onNavigate={(tab) => {
            if (tab === "challenge") {
              handleStartChallenge();
            } else if ((tab === "chat" || tab === "workspace" || tab === "ai" || tab === "account" || tab === "memory") && !user) {
              handleStartWriting("login");
            } else {
              navigate(tab);
            }
          }}
        />
        <AuthModal 
          isOpen={true}
          onClose={() => navigate("landing")}
          initialMode="login"
          onSuccess={() => {
            navigate("chat");
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      key="workspace-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-screen bg-[#09090B] text-gray-200 overflow-hidden font-sans relative selection:bg-[#F59E0B]/30"
    >
      <AmbientBackground />
      <FilmGrainOverlay />
      <SpotlightCursor />

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
          navigate(tab);
          setSidebarOpen(false);
          setShowAdmin(false);
        }} 
        onSessionSelect={handleSessionSelect}
        onNewSession={handleCreateNewSession}
        onLogout={handleLogout}
        onShowAdmin={() => {
          setShowAdmin(true);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden z-20 bg-[#09090B]">
        {/* Persistent Top Navigation Bar for Logged-In State */}
        <TopNav
          sessionTitle={activeSessionTitle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
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
                  userData={userPlanData}
                  onSendToWorkspace={(promptText, mode) => {
                    setPendingPrompt({ text: promptText, mode, autoSubmit: true });
                    setActiveTab("chat");
                  }}
                  onGoToChat={() => user ? setActiveTab("chat") : setActiveTab("landing")}
                  onGoToPricing={() => setActiveTab("pricing")}
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
                  userData={userPlanData}
                  activeTab={activeTab} 
                  activeSessionId={activeSessionId}
                  pendingPrompt={pendingPrompt}
                  remainingCredits={remainingCredits}
                  onRemainingCreditsChange={(credits) => setRemainingCredits(credits)}
                  onUserDataRefresh={(plan, credits) => {
                    setUserPlanData(plan);
                    setRemainingCredits(credits);
                  }}
                  onClearPendingPrompt={() => setPendingPrompt(null)}
                  onSessionChange={(id) => setActiveSessionId(id)}
                  onMenuToggle={() => setSidebarOpen(true)}
                  onGoHome={() => navigate("landing")}
                  onGoToPricing={() => navigate("pricing")}
                  onGoToAccount={() => navigate("account")}
                  onLogout={handleLogout}
                  onNavigateToPublicChallenge={(slug) => {
                    navigate(`/challenge/${slug}`);
                  }}
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
    </motion.div>
  );
}
