import React, { useState, useEffect, useRef } from "react";
import { 
  Trophy, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  Download, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Target,
  Flame,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { QreatoLogo } from "./QreatoLogo";
import { StoryScoreCard, getScoreTierConfig } from "./StoryScoreCard";
import { computeStrongestElement } from "../lib/scoreData";
import { 
  captureStoryImage, 
  downloadImageFile, 
  executeNativeShare 
} from "../lib/storyCapture";

interface ChallengeRecord {
  overall_score: number;
  attention_score?: number;
  clarity_score?: number;
  desire_score?: number;
  persuasion_score?: number;
  action_score?: number;
  strongest_dimension?: string;
  strongest_element?: string;
  strongestElement?: string;
  biggest_leverage?: string;
  diagnosis?: string;
  submitted_copy?: string;
  user_copy?: string;
  copy?: string;
  prompt?: string;
  brief?: string;
  share_slug?: string;
  slug?: string;
  created_at?: string;
}

interface ChallengePageProps {
  slug: string;
  onGoToHome: () => void;
  onGoToSignup: () => void;
}

export const ChallengePage: React.FC<ChallengePageProps> = ({
  slug,
  onGoToHome,
  onGoToSignup,
}) => {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const cachedFileRef = useRef<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ChallengeRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let isCancelled = false;

    async function fetchChallengeResult() {
      const cleanSlug = (slug || "").trim().replace(/[^a-zA-Z0-9_-]/g, "");
      if (!cleanSlug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setNotFound(false);

        // Safety timeout so UI never hangs
        const timeoutPromise = new Promise<{ timeout: true }>((resolve) =>
          setTimeout(() => resolve({ timeout: true }), 8000)
        );

        const fetchPromise = (async () => {
          // 1. Primary Query: Match on share_slug
          const { data: byShareSlug, error: err1 } = await supabase
            .from("challenge_results")
            .select("*")
            .eq("share_slug", cleanSlug)
            .maybeSingle();

          if (byShareSlug && !err1) {
            return {
              overall_score: byShareSlug.overall_score,
              attention_score: byShareSlug.attention_score,
              clarity_score: byShareSlug.clarity_score,
              desire_score: byShareSlug.desire_score,
              persuasion_score: byShareSlug.persuasion_score,
              action_score: byShareSlug.action_score,
              biggest_leverage: byShareSlug.biggest_leverage || "PERSUASION",
              diagnosis: byShareSlug.diagnosis,
              submitted_copy: byShareSlug.submitted_copy || "",
              user_copy: byShareSlug.submitted_copy || "",
              copy: byShareSlug.submitted_copy || "",
              share_slug: byShareSlug.share_slug,
              created_at: byShareSlug.created_at,
            };
          }

          // 2. Secondary Query: Match on ID if slug happens to be a UUID
          if (cleanSlug.length >= 30) {
            const { data: byId, error: err2 } = await supabase
              .from("challenge_results")
              .select("*")
              .eq("id", cleanSlug)
              .maybeSingle();

            if (byId && !err2) {
              return {
                overall_score: byId.overall_score,
                attention_score: byId.attention_score,
                clarity_score: byId.clarity_score,
                desire_score: byId.desire_score,
                persuasion_score: byId.persuasion_score,
                action_score: byId.action_score,
                biggest_leverage: byId.biggest_leverage || "PERSUASION",
                diagnosis: byId.diagnosis,
                submitted_copy: byId.submitted_copy || "",
                user_copy: byId.submitted_copy || "",
                copy: byId.submitted_copy || "",
                share_slug: byId.share_slug || cleanSlug,
                created_at: byId.created_at,
              };
            }
          }

          // 3. Fallback to API route
          try {
            const apiRes = await fetch(`/api/challenge/${encodeURIComponent(cleanSlug)}`);
            if (apiRes.ok) {
              const apiData = await apiRes.json();
              if (apiData && typeof apiData.overall_score === "number") {
                return {
                  overall_score: apiData.overall_score,
                  attention_score: apiData.attention_score,
                  clarity_score: apiData.clarity_score,
                  desire_score: apiData.desire_score,
                  persuasion_score: apiData.persuasion_score,
                  action_score: apiData.action_score,
                  biggest_leverage: apiData.biggest_leverage || "PERSUASION",
                  diagnosis: apiData.diagnosis,
                  submitted_copy: apiData.submitted_copy || apiData.userCopy || apiData.copy || "",
                  user_copy: apiData.submitted_copy || apiData.userCopy || apiData.copy || "",
                  copy: apiData.submitted_copy || apiData.userCopy || apiData.copy || "",
                  share_slug: apiData.share_slug || apiData.shareSlug || cleanSlug,
                  created_at: apiData.created_at,
                };
              }
            }
          } catch {
            // ignore network/api error in fallback
          }

          return null;
        })();

        const outcome = await Promise.race([fetchPromise, timeoutPromise]);

        if (isCancelled) return;

        if (outcome && !("timeout" in outcome)) {
          setResult(outcome);
          setNotFound(false);
        } else {
          setResult(null);
          setNotFound(true);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Error fetching challenge result:", err);
          setNotFound(true);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchChallengeResult();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  const overallScore = result?.overall_score ?? 0;
  const config = getScoreTierConfig(overallScore);
  const cleanSlug = (slug || "").trim();
  const shareUrl = typeof window !== "undefined" && window.location.origin
    ? `${window.location.origin}/challenge/${cleanSlug}`
    : `https://murgii.vercel.app/challenge/${cleanSlug}`;

  const rawUserCopy = (result?.submitted_copy || result?.user_copy || result?.copy || result?.prompt || result?.brief || "").trim();
  const evaluatedUserCopy = (() => {
    if (!rawUserCopy) return "";
    let cleaned = rawUserCopy;
    const quoteMatches = Array.from(cleaned.matchAll(/["'“«]([^"'”»]+)["'”»]/g));
    if (quoteMatches.length > 0) {
      const longest = quoteMatches.reduce((acc, curr) => 
        curr[1] && curr[1].trim().length > acc.length ? curr[1].trim() : acc
      , "");
      if (longest.length > 2) return longest;
    }
    cleaned = cleaned.replace(
      /^(?:can\s+you\s+|please\s+)?(?:score|evaluate|check|rate|analyze|grade|test|review|audit)\s+(?:my|this|the)?\s*(?:copy|headline|bio|ad|email|landing\s+page|text|hook|offer|message)?\s*[:\-–—]?\s*/i,
      ""
    );
    cleaned = cleaned.replace(/^["'“«]+|["'”»]+$/g, "").trim();
    return cleaned || rawUserCopy;
  })();

  const copySnippet = evaluatedUserCopy 
    ? (evaluatedUserCopy.length > 55 ? evaluatedUserCopy.slice(0, 52) + "..." : evaluatedUserCopy)
    : "";

  const shareText = copySnippet
    ? `I scored ${overallScore}/100 on Qreato Copy Challenge for: "${copySnippet}" — Can you beat me?`
    : `I scored ${overallScore}/100 on Qreato Copy Challenge. Can you beat me?`;

  const cacheKey = `challenge-${overallScore}-${cleanSlug}-${evaluatedUserCopy.slice(0, 40)}`;

  // Background single-pass rasterization once data is ready
  useEffect(() => {
    let isMounted = true;
    if (!result) return;

    const timer = setTimeout(async () => {
      if (storyCardRef.current && isMounted && !cachedFileRef.current) {
        try {
          const filename = `qreato-challenge-${cleanSlug || overallScore}.png`;
          const file = await captureStoryImage(storyCardRef.current, filename, cacheKey);
          if (file && isMounted) {
            cachedFileRef.current = file;
          }
        } catch (e) {
          console.warn("Challenge card pre-capture error:", e);
        }
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [result, cleanSlug, overallScore, evaluatedUserCopy, cacheKey]);

  const ensureImageFile = async (): Promise<File | null> => {
    if (cachedFileRef.current) return cachedFileRef.current;
    if (storyCardRef.current) {
      const filename = `qreato-challenge-${cleanSlug || overallScore}.png`;
      const file = await captureStoryImage(storyCardRef.current, filename, cacheKey);
      if (file) {
        cachedFileRef.current = file;
        return file;
      }
    }
    return null;
  };

  // Fix #1: Native OS Share Sheet
  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      const imageFile = await ensureImageFile();
      await executeNativeShare({
        imageFile,
        shareText,
        shareUrl,
        onShowToast: showToast,
      });
    } catch (err) {
      console.error("Share error:", err);
      showToast("Unable to open share sheet. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  // Fix #2: Direct Download with zero intermediate dialog
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const imageFile = await ensureImageFile();
      if (!imageFile) {
        showToast("Unable to render image. Please try again.");
        return;
      }

      const success = downloadImageFile(imageFile, `qreato-challenge-${overallScore}.png`);
      if (success) {
        setDownloadSuccess(true);
        showToast("Card saved to your device!");
        setTimeout(() => setDownloadSuccess(false), 2800);
      }
    } catch (err) {
      console.error("Download error:", err);
      showToast("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const dimensionsList = [
    {
      id: "attention",
      label: "Attention / Hook",
      score: result?.attention_score ?? Math.round(overallScore * 0.95),
      icon: Target,
      color: "from-amber-400 to-orange-500",
      textColor: "text-amber-400",
      desc: "Ability to stop the scroll and seize immediate mental focus.",
    },
    {
      id: "clarity",
      label: "Value Clarity",
      score: result?.clarity_score ?? Math.round(overallScore * 1.02),
      icon: CheckCircle2,
      color: "from-sky-400 to-blue-500",
      textColor: "text-sky-400",
      desc: "Speed at which the reader grasps the core transformation offer.",
    },
    {
      id: "desire",
      label: "Visceral Desire",
      score: result?.desire_score ?? Math.round(overallScore * 0.98),
      icon: Flame,
      color: "from-rose-400 to-red-500",
      textColor: "text-rose-400",
      desc: "Emotional tension created to desire the claimed outcome.",
    },
    {
      id: "persuasion",
      label: "Persuasion Mechanics",
      score: result?.persuasion_score ?? Math.round(overallScore * 0.92),
      icon: Zap,
      color: "from-purple-400 to-indigo-500",
      textColor: "text-purple-400",
      desc: "Proof structures, objection-handling, and cognitive momentum.",
    },
    {
      id: "action",
      label: "Action Urgency",
      score: result?.action_score ?? Math.round(overallScore * 1.05),
      icon: Trophy,
      color: "from-emerald-400 to-teal-500",
      textColor: "text-emerald-400",
      desc: "Frictionless impulse leading directly to the commitment call.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07060B] text-white flex flex-col justify-between selection:bg-[#8B5CF6]/40 relative overflow-x-hidden font-sans">
      {/* 
        OFFSCREEN 1080x1920 INSTAGRAM STORY TARGET
        Rendered once and cached in memory
      */}
      <div
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "1080px",
          height: "1920px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -9999,
        }}
        aria-hidden="true"
      >
        <div ref={storyCardRef} style={{ width: "1080px", height: "1920px" }}>
          <StoryScoreCard
            overallScore={overallScore}
            shareSlug={cleanSlug}
            userCopy={evaluatedUserCopy}
            strongestDimension={result?.strongest_dimension}
            strongestElement={result?.strongest_element}
            dimensions={{
              attention: result?.attention_score,
              clarity: result?.clarity_score,
              desire: result?.desire_score,
              persuasion: result?.persuasion_score,
              action: result?.action_score,
            }}
          />
        </div>
      </div>

      {/* Top Navigation */}
      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoToHome}>
          <QreatoLogo size={28} className="text-white" dotClassName="text-white fill-white" />
          <span className="text-base font-bold tracking-tight text-white font-['Nohemi',sans-serif]">
            Qreato
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 text-xs font-medium text-white/80 transition-all cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Back to Studio</span>
          </button>

          <button
            type="button"
            onClick={onGoToSignup}
            className="px-4 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)] cursor-pointer"
          >
            Score Your Copy
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 size={36} className="text-[#8B5CF6] animate-spin" />
            <p className="text-xs sm:text-sm font-mono tracking-widest text-white/60 uppercase">
              Loading persuasion scorecard...
            </p>
          </div>
        ) : notFound || !result ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl text-center space-y-6 shadow-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <AlertCircle size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-['Nohemi',sans-serif] text-white">
                Scorecard Not Found
              </h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                This challenge scorecard could not be located, or the link has expired.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onGoToHome}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Go to Studio
              </button>
              <button
                type="button"
                onClick={onGoToSignup}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Score Your Own Copy
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-6"
          >
            {/* Header Callout */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-white/90 text-xs font-mono uppercase tracking-widest shadow-sm">
                <Trophy size={13} className="text-[#FFBE0B]" />
                <span>Qreato Copy Score Challenge</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-['Nohemi',sans-serif] tracking-tight text-white">
                Can you beat this score?
              </h1>
              <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto">
                An operator put their copy against Qreato's persuasion evaluation engine. Here is how it scored:
              </p>
            </div>

            {/* Primary Score Card Frame */}
            {(() => {
              const strongestInfo = computeStrongestElement(
                {
                  attention: result?.attention_score,
                  clarity: result?.clarity_score,
                  desire: result?.desire_score,
                  persuasion: result?.persuasion_score,
                  action: result?.action_score,
                },
                result?.strongest_element
              );

              return (
                <div 
                  className="relative rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: "#0A0A0A",
                    background: "radial-gradient(ellipse at 50% 40%, #161616 0%, #0A0A0A 70%, #050505 100%)",
                  }}
                >
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Top Header Bar — Top-left shows ONLY the Qreato logo mark, nothing else */}
                    <div className="w-full flex items-center justify-start pb-6 mb-8 border-b border-white/10 px-1">
                      <QreatoLogo size={32} className="text-white" dotClassName="text-white fill-white" />
                    </div>

                    {/* Big Score Centerpiece — No label above, no status pill under */}
                    <div className="flex flex-col items-center mb-8">
                      <div className="flex items-baseline justify-center tracking-tight leading-none">
                        <span 
                          className="text-7xl sm:text-8xl font-black font-nohemi tracking-tight leading-none"
                          style={{ color: config.accentColor }}
                        >
                          {overallScore}
                        </span>
                        <span className="text-xl sm:text-2xl font-semibold text-white/35 font-mono ml-2">
                          /100
                        </span>
                      </div>
                    </div>

                    {/* Evaluated Copy Snippet */}
                    {evaluatedUserCopy && (
                      <div className="w-full mb-8 flex flex-col items-center text-center">
                        <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-white/40 uppercase mb-2">
                          EVALUATED COPY
                        </span>
                        <p className="text-sm sm:text-base text-white/88 font-normal italic leading-relaxed line-clamp-3 max-w-lg font-sans">
                          "{evaluatedUserCopy}"
                        </p>
                      </div>
                    )}

                    {/* 5 Dimension Breakdown Grid */}
                    <div className="w-full mt-8 pt-6 border-t border-white/10">
                      <div className="text-left text-xs font-mono uppercase tracking-widest text-white/50 mb-4 flex items-center justify-between">
                        <span>5-Dimension Evaluation Breakdown</span>
                        <span className="text-[10px] text-white/40">Benchmarked against top 1% copy</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
                        {dimensionsList.map((dim) => {
                          const DimIcon = dim.icon;
                          const clampedScore = Math.min(100, Math.max(0, dim.score));
                          return (
                            <div 
                              key={dim.id}
                              className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 transition-all"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <DimIcon size={14} className={dim.textColor} />
                                  <span className="text-xs font-bold text-white">{dim.label}</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-white">
                                  {clampedScore}<span className="text-white/40 text-[10px]">/100</span>
                                </span>
                              </div>

                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
                                <div 
                                  className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                                  style={{ width: `${clampedScore}%` }}
                                />
                              </div>

                              <div className="text-[10px] text-white/50 leading-tight">
                                {dim.desc}
                              </div>
                            </div>
                          );
                        })}

                        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span className="text-xs font-bold text-white">Conversion Audit</span>
                          </div>
                          <div className="text-[11px] text-white/70 leading-snug">
                            Calculated using verified direct response persuasion matrices.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strongest Element Callout — Positive, computed from actual subscores */}
                    <div className="w-full mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center flex flex-col items-center">
                      <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-white/40 uppercase mb-2">
                        STRONGEST ELEMENT
                      </span>
                      <span 
                        className="text-base sm:text-xl font-bold tracking-wider uppercase font-nohemi"
                        style={{ color: config.accentColor }}
                      >
                        {strongestInfo.dimensionUpper}
                      </span>
                      <p className="text-xs sm:text-sm text-white/85 leading-relaxed mt-2 font-sans max-w-md">
                        {strongestInfo.line}
                      </p>
                    </div>

                    {/* Challenge Line — Perfectly centered, no logo, no wordmark */}
                    <div className="w-full mt-7 p-4 sm:p-5 rounded-2xl border border-white/15 bg-white/[0.02] flex items-center justify-center text-center">
                      <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase font-nohemi text-center">
                        I GOT {overallScore}. CAN YOU BEAT ME?
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 
              Fix #2: Under the Challenge response card, show EXACTLY TWO BUTTONS: Share and Download.
              No social quick-icons, no external link button, no modal.
            */}
            <div className="w-full rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl p-4 sm:p-6 flex flex-col gap-3 shadow-lg">
              <div className="grid grid-cols-2 gap-3 w-full">
                {/* Button 1: Share (Native OS Share Sheet) */}
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border bg-white text-black hover:bg-neutral-200 border-white shadow-[0_2px_15px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 active:scale-[0.99]"
                  title="Share score card"
                >
                  {isSharing ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-black" />
                      <span>Sharing...</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} className="stroke-[2.5]" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                {/* Button 2: Download (Direct save to gallery/downloads) */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border flex items-center justify-center gap-2 active:scale-[0.99] ${
                    downloadSuccess
                      ? "bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]"
                      : "bg-white/[0.08] hover:bg-white/[0.16] border-white/20 text-white"
                  }`}
                  title="Download score card image"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Saving...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <Check size={16} className="stroke-[2.5]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} className="stroke-[2.2]" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>

              {/* Toast Feedback */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 3, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -3, height: 0 }}
                    className="p-2 rounded-xl bg-white/10 border border-white/20 text-xs text-[#E0AAFF] font-mono text-center"
                  >
                    {toastMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* High-Converting CTA Box */}
            <div className="rounded-3xl border border-white/20 bg-gradient-to-b from-white/[0.1] to-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
              <h2 className="text-xl sm:text-2xl font-black font-['Nohemi',sans-serif] text-white mb-2">
                Think you can write copy that scores 90+?
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto mb-6">
                Paste your headline, email, or ad into Qreato's Copy Score Challenge and get an instant breakdown of attention, clarity, desire, and persuasion strength.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onGoToSignup}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-black hover:bg-neutral-200 text-sm font-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Score Your Own Copy</span>
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={onGoToHome}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.12] text-sm font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
                >
                  Explore Qreato
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center gap-4 text-[11px] font-mono text-white/50">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Instant scoring
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  5 persuasion dimensions
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Free to start
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-md py-6 px-4 text-center text-xs text-white/40">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-bold text-white/70">Qreato</span>
          <span>—</span>
          <span>The Direct Response Conversion Engine</span>
        </div>
        <p className="text-[11px] text-white/30">
          Powered by persistent direct response cognitive architectures.
        </p>
      </footer>
    </div>
  );
};
