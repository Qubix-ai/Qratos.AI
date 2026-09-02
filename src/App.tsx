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
import { AnimatePresence, motion } from "motion/react";
import { FilmGrainOverlay } from "./components/FilmGrainOverlay";
import { AmbientBackground } from "./components/AmbientBackground";
import { SpotlightCursor } from "./components/SpotlightCursor";
import { fetchUserPlan, fetchUserPlanAndCredits, UserPlanData } from "./lib/userAccount";

export default function App() {
  const getSlugFromPath = () => {
    if (typeof window === "undefined") return null;
    const path = window.location.pathname;
    const match = path.match(/^\/challenge\/([^/?#]+)/i);
    return match ? match[1] : null;
  };

  const checkIsTermsPath = () => {
    if (typeof window === "undefined") return false;
    return window.location.pathname.toLowerCase() === "/terms";
  };

  const checkIsPrivacyPath = () => {
    if (typeof window === "undefined") return false;
    return window.location.pathname.toLowerCase() === "/privacy";
  };

  const checkIsRefundPolicyPath = () => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname.toLowerCase();
    return p === "/refund-policy" || p === "/refund";
  };

  const checkIsPlatformRulesPath = () => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname.toLowerCase();
    return p === "/platform-rules" || p === "/rules";
  };

  const checkIsGeneralRulesPath = () => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname.toLowerCase();
    return p === "/general-rules" || p === "/general";
  };

  const checkIsMediaPath = () => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname.toLowerCase();
    return p === "/media" || p === "/press";
  };

  const checkIsEnterprisePath = () => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname.toLowerCase();
    return p === "/enterprise" || p === "/teams";
  };

  const checkIsSecurityPath = () => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname.toLowerCase();
    return p === "/security";
  };

  const checkIsTrustCentrePath = () => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname.toLowerCase();
    return p === "/trust-centre" || p === "/trust-center" || p === "/trust";
  };

  const [challengeSlug, setChallengeSlug] = useState<string | null>(getSlugFromPath());
  const [isTermsPage, setIsTermsPage] = useState<boolean>(checkIsTermsPath());
  const [isPrivacyPage, setIsPrivacyPage] = useState<boolean>(checkIsPrivacyPath());
  const [isRefundPolicyPage, setIsRefundPolicyPage] = useState<boolean>(checkIsRefundPolicyPath());
  const [isPlatformRulesPage, setIsPlatformRulesPage] = useState<boolean>(checkIsPlatformRulesPath());
  const [isGeneralRulesPage, setIsGeneralRulesPage] = useState<boolean>(checkIsGeneralRulesPath());
  const [isMediaPage, setIsMediaPage] = useState<boolean>(checkIsMediaPath());
  const [isEnterprisePage, setIsEnterprisePage] = useState<boolean>(checkIsEnterprisePath());
  const [isSecurityPage, setIsSecurityPage] = useState<boolean>(checkIsSecurityPath());
  const [isTrustCentrePage, setIsTrustCentrePage] = useState<boolean>(checkIsTrustCentrePath());
  const [user, setUser] = useState<any>(null);
  const [userPlanData, setUserPlanData] = useState<UserPlanData>({ plan: "none", maxCredits: 3 });
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [pendingPrompt, setPendingPrompt] = useState<{ text: string; mode: MurgiiMode; autoSubmit?: boolean } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("signup");

  useEffect(() => {
    const handlePopState = () => {
      setChallengeSlug(getSlugFromPath());
      setIsTermsPage(checkIsTermsPath());
      setIsPrivacyPage(checkIsPrivacyPath());
      setIsRefundPolicyPage(checkIsRefundPolicyPath());
      setIsPlatformRulesPage(checkIsPlatformRulesPath());
      setIsGeneralRulesPage(checkIsGeneralRulesPath());
      setIsMediaPage(checkIsMediaPath());
      setIsEnterprisePage(checkIsEnterprisePath());
      setIsSecurityPage(checkIsSecurityPath());
      setIsTrustCentrePage(checkIsTrustCentrePath());
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

  useEffect(() => {
    let isMounted = true;

    // Initial Supabase Session Check - Immediately resolves destination tab to eliminate intermediate render
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error("Supabase getSession error:", error);
      }
      if (isMounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          // Immediately set destination to chat workspace before splash finishes
          setActiveTab("chat");
          loadUserData(currentUser);
        } else {
          setActiveTab("landing");
        }
        setAuthResolved(true);
        setLoading(false);
      }
    });

    // Supabase Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isMounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser && (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED")) {
          setActiveTab("chat");
          loadUserData(currentUser);
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
    setActiveTab("landing");
    setSidebarOpen(false);
    setShowAdmin(false);
  };

  if (challengeSlug) {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <ChallengePage 
          slug={challengeSlug}
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setChallengeSlug(null);
            setActiveTab(user ? "chat" : "landing");
          }}
          onGoToSignup={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setChallengeSlug(null);
            if (user) {
              setActiveTab("chat");
            } else {
              setActiveTab("landing");
              handleStartWriting("signup");
            }
          }}
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

  if (isTermsPage || activeTab === "terms") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <TermsPage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsTermsPage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsTermsPage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
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

  if (isPrivacyPage || activeTab === "privacy") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <PrivacyPage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsPrivacyPage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsPrivacyPage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
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

  if (isRefundPolicyPage || activeTab === "refund-policy" || activeTab === "refund") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <RefundPolicyPage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsRefundPolicyPage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsRefundPolicyPage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
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

  if (isPlatformRulesPage || activeTab === "platform-rules" || activeTab === "rules") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <PlatformRulesPage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsPlatformRulesPage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsPlatformRulesPage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
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

  if (isGeneralRulesPage || activeTab === "general-rules" || activeTab === "general") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <GeneralRulesPage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsGeneralRulesPage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsGeneralRulesPage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
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

  if (isMediaPage || activeTab === "media" || activeTab === "press") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <MediaPage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsMediaPage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsMediaPage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
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

  if (isEnterprisePage || activeTab === "enterprise" || activeTab === "teams") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <EnterprisePage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsEnterprisePage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsEnterprisePage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
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

  if (isSecurityPage || activeTab === "security") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <SecurityPage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsSecurityPage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsSecurityPage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
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

  if (isTrustCentrePage || activeTab === "trust-centre" || activeTab === "trust-center" || activeTab === "trust") {
    return (
      <div className="min-h-screen bg-[#07060B] selection:bg-[#8B5CF6]/40 relative">
        <AmbientBackground />
        <FilmGrainOverlay />
        <SpotlightCursor />
        <TrustCentrePage 
          onGoToHome={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsTrustCentrePage(false);
            setActiveTab("landing");
          }}
          onGoToChat={() => {
            if (typeof window !== "undefined") {
              window.history.pushState({}, "", "/");
            }
            setIsTrustCentrePage(false);
            setActiveTab(user ? "chat" : "landing");
          }}
          onNavigatePolicy={(key) => {
            setIsTrustCentrePage(false);
            if (key === "terms") {
              if (typeof window !== "undefined") window.history.pushState({}, "", "/terms");
              setIsTermsPage(true);
              setActiveTab("terms");
            } else if (key === "privacy") {
              if (typeof window !== "undefined") window.history.pushState({}, "", "/privacy");
              setIsPrivacyPage(true);
              setActiveTab("privacy");
            } else if (key === "security") {
              if (typeof window !== "undefined") window.history.pushState({}, "", "/security");
              setIsSecurityPage(true);
              setActiveTab("security");
            } else if (key === "refund") {
              if (typeof window !== "undefined") window.history.pushState({}, "", "/refund-policy");
              setIsRefundPolicyPage(true);
              setActiveTab("refund-policy");
            } else if (key === "platform-rules") {
              if (typeof window !== "undefined") window.history.pushState({}, "", "/platform-rules");
              setIsPlatformRulesPage(true);
              setActiveTab("platform-rules");
            } else if (key === "general-rules") {
              if (typeof window !== "undefined") window.history.pushState({}, "", "/general-rules");
              setIsGeneralRulesPage(true);
              setActiveTab("general-rules");
            }
          }}
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

  if (loading || showSplash || !authResolved) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
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
            if (tab === "terms") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/terms");
              }
              setIsTermsPage(true);
              setActiveTab("terms");
            } else if (tab === "privacy") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/privacy");
              }
              setIsPrivacyPage(true);
              setActiveTab("privacy");
            } else if (tab === "refund-policy" || tab === "refund") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/refund-policy");
              }
              setIsRefundPolicyPage(true);
              setActiveTab("refund-policy");
            } else if (tab === "platform-rules" || tab === "rules") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/platform-rules");
              }
              setIsPlatformRulesPage(true);
              setActiveTab("platform-rules");
            } else if (tab === "general-rules" || tab === "general") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/general-rules");
              }
              setIsGeneralRulesPage(true);
              setActiveTab("general-rules");
            } else if (tab === "media" || tab === "press") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/media");
              }
              setIsMediaPage(true);
              setActiveTab("media");
            } else if (tab === "enterprise" || tab === "teams") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/enterprise");
              }
              setIsEnterprisePage(true);
              setActiveTab("enterprise");
            } else if (tab === "security") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/security");
              }
              setIsSecurityPage(true);
              setActiveTab("security");
            } else if (tab === "trust-centre" || tab === "trust-center" || tab === "trust") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/trust-centre");
              }
              setIsTrustCentrePage(true);
              setActiveTab("trust-centre");
            } else if (tab === "pricing") {
              setActiveTab("pricing");
            } else if (tab === "prompt-builder") {
              setActiveTab("prompt-builder");
            } else if (tab === "challenge") {
              handleStartChallenge();
            } else if (tab === "chat" || tab === "workspace" || tab === "ai") {
              if (user) setActiveTab("chat");
              else handleStartWriting("login");
            } else if (tab === "account") {
              if (user) setActiveTab("account");
              else handleStartWriting("login");
            } else if (tab === "memory") {
              if (user) setActiveTab("memory");
              else handleStartWriting("login");
            }
          }}
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
            if (tab === "terms") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/terms");
              }
              setIsTermsPage(true);
              setActiveTab("terms");
            } else if (tab === "privacy") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/privacy");
              }
              setIsPrivacyPage(true);
              setActiveTab("privacy");
            } else if (tab === "refund-policy" || tab === "refund") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/refund-policy");
              }
              setIsRefundPolicyPage(true);
              setActiveTab("refund-policy");
            } else if (tab === "platform-rules" || tab === "rules") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/platform-rules");
              }
              setIsPlatformRulesPage(true);
              setActiveTab("platform-rules");
            } else if (tab === "general-rules" || tab === "general") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/general-rules");
              }
              setIsGeneralRulesPage(true);
              setActiveTab("general-rules");
            } else if (tab === "media" || tab === "press") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/media");
              }
              setIsMediaPage(true);
              setActiveTab("media");
            } else if (tab === "enterprise" || tab === "teams") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/enterprise");
              }
              setIsEnterprisePage(true);
              setActiveTab("enterprise");
            } else if (tab === "security") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/security");
              }
              setIsSecurityPage(true);
              setActiveTab("security");
            } else if (tab === "trust-centre" || tab === "trust-center" || tab === "trust") {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", "/trust-centre");
              }
              setIsTrustCentrePage(true);
              setActiveTab("trust-centre");
            } else if (tab === "pricing") {
              setActiveTab("pricing");
            } else if (tab === "prompt-builder") {
              setActiveTab("prompt-builder");
            } else if (tab === "challenge") {
              handleStartChallenge();
            } else if (tab === "chat" || tab === "workspace" || tab === "ai") {
              handleStartWriting("login");
            } else if (tab === "account") {
              handleStartWriting("login");
            } else if (tab === "memory") {
              handleStartWriting("login");
            }
          }}
        />
        <AuthModal 
          isOpen={true}
          onClose={() => setActiveTab("landing")}
          initialMode="login"
          onSuccess={() => {
            setActiveTab("chat");
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
      className="flex h-screen bg-[#07060B] text-gray-200 overflow-hidden font-sans relative selection:bg-[#8B5CF6]/40"
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
                  onGoHome={() => setActiveTab("landing")}
                  onGoToPricing={() => setActiveTab("pricing")}
                  onGoToAccount={() => setActiveTab("account")}
                  onLogout={handleLogout}
                  onNavigateToPublicChallenge={(slug) => {
                    if (typeof window !== "undefined") {
                      window.history.pushState({}, "", `/challenge/${slug}`);
                    }
                    setChallengeSlug(slug);
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
