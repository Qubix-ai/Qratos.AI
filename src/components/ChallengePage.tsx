import React, { useState, useEffect, useRef } from "react";
import { 
  Trophy, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Target,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Brain,
  ShieldCheck,
  Download,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { copyToClipboard } from "../lib/clipboard";
import { QreatoLogo } from "./QreatoLogo";
import { StoryScoreCard, getScoreTierConfig } from "./StoryScoreCard";
import { captureStoryImage, executeUnifiedShare } from "../lib/storyCapture";

interface ChallengeRecord {
  overall_score: number;
  attention_score?: number;
  clarity_score?: number;
  desire_score?: number;
  persuasion_score?: number;
  action_score?: number;
  biggest_leverage?: string;
  diagnosis?: string;
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

// Social Icons
const XIcon: React.FC<{ size?: number; className?: string }> = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon: React.FC<{ size?: number; className?: string }> = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const ChallengePage: React.FC<ChallengePageProps> = ({
  slug,
  onGoToHome,
  onGoToSignup,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const storyCardRef = useRef<HTMLDivElement>(null);
  const pregeneratedFileRef = useRef<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ChallengeRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    async function fetchChallengeResult() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setNotFound(false);

        // 1. Try querying with share_slug
        const { data: byShareSlug, error: err1 } = await supabase
          .from("challenge_results")
          .select("overall_score, attention_score, clarity_score, desire_score, persuasion_score, action_score, biggest_leverage, diagnosis, user_copy, copy, prompt, brief, share_slug")
          .eq("share_slug", slug)
          .maybeSingle();

        if (byShareSlug && !err1) {
          setResult(byShareSlug);
          setLoading(false);
          return;
        }

        // 2. Try fallback query with slug column
        const { data: bySlug, error: err2 } = await supabase
          .from("challenge_results")
          .select("overall_score, attention_score, clarity_score, desire_score, persuasion_score, action_score, biggest_leverage, diagnosis, user_copy, copy, prompt, brief, slug")
          .eq("slug", slug)
          .maybeSingle();

        if (bySlug && !err2) {
          setResult(bySlug);
          setLoading(false);
          return;
        }

        // 3. Try fallback to local server challenge store API
        try {
          const apiRes = await fetch(`/api/challenge/${slug}`);
          if (apiRes.ok) {
            const apiData = await apiRes.json();
            if (apiData && typeof apiData.overall_score === 'number') {
              setResult(apiData);
              setLoading(false);
              return;
            }
          }
        } catch {
          // fallback
        }

        setNotFound(true);
      } catch (err) {
        console.error("Error fetching challenge result:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchChallengeResult();
  }, [slug]);

  const overallScore = result?.overall_score ?? 0;
  const config = getScoreTierConfig(overallScore);
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://murgii.vercel.app/challenge/${slug}`;
  
  const rawUserCopy = (result?.user_copy || result?.copy || result?.prompt || result?.brief || "").trim();
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

  const generateStoryFile = async (): Promise<File | null> => {
    if (!storyCardRef.current) return null;
    const filename = `qreato-challenge-${slug || overallScore}.png`;
    return await captureStoryImage(storyCardRef.current, filename);
  };

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (storyCardRef.current && isMounted && !pregeneratedFileRef.current) {
        try {
          const file = await generateStoryFile();
          if (file && isMounted) {
            pregeneratedFileRef.current = file;
          }
        } catch (e) {
          console.warn("Background challenge pregeneration error:", e);
        }
      }
    }, 350);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [overallScore, slug, evaluatedUserCopy]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      showToast("Challenge link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  const handleUnifiedShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      let imageFile = pregeneratedFileRef.current;
      if (!imageFile) {
        setIsGenerating(true);
        showToast("Generating 1080x1920 Story card...");
        imageFile = await generateStoryFile();
        setIsGenerating(false);
        if (imageFile) {
          pregeneratedFileRef.current = imageFile;
        } else {
          showToast("Failed to generate card image. Tap to retry.");
          setIsSharing(false);
          return;
        }
      }

      await executeUnifiedShare({
        imageFile,
        shareText,
        shareUrl,
        onShowToast: showToast,
      });
    } catch (err) {
      console.error("Share error:", err);
      showToast("Failed to share card. Retrying...");
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareX = async () => {
    let imageFile = pregeneratedFileRef.current;
    if (imageFile && typeof navigator !== "undefined" && typeof navigator.share === "function" && typeof navigator.canShare === "function") {
      if (navigator.canShare({ files: [imageFile] })) {
        try {
          await navigator.share({
            files: [imageFile],
            title: "Qreato Copy Score",
            text: `${shareText} ${shareUrl}`,
          });
          return;
        } catch (e: any) {
          if (e && e.name === "AbortError") return;
        }
      }
    }
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = async () => {
    let imageFile = pregeneratedFileRef.current;
    if (imageFile && typeof navigator !== "undefined" && typeof navigator.share === "function" && typeof navigator.canShare === "function") {
      if (navigator.canShare({ files: [imageFile] })) {
        try {
          await navigator.share({
            files: [imageFile],
            title: "Qreato Copy Score",
            text: `${shareText} ${shareUrl}`,
          });
          return;
        } catch (e: any) {
          if (e && e.name === "AbortError") return;
        }
      }
    }
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareInstagram = async () => {
    await handleUnifiedShare();
  };

  const handleDownloadCard = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      let imageFile = pregeneratedFileRef.current;
      if (!imageFile) {
        setIsGenerating(true);
        showToast("Generating 1080x1920 Story image...");
        imageFile = await generateStoryFile();
        setIsGenerating(false);
        if (imageFile) pregeneratedFileRef.current = imageFile;
      }

      if (!imageFile) {
        showToast("Failed to generate image. Tap to retry.");
        return;
      }

      const objectUrl = URL.createObjectURL(imageFile);
      const downloadLink = document.createElement("a");
      downloadLink.download = imageFile.name;
      downloadLink.href = objectUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      showToast("Scorecard saved to gallery!");
    } catch (err) {
      console.error("Failed to save scorecard:", err);
      showToast("Failed to save image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const dimensionsList = [
    {
      id: "attention",
      label: "Hook Retention",
      score: result?.attention_score ?? Math.round(overallScore * 0.95),
      color: "from-amber-400 to-amber-600",
      textColor: "text-amber-400",
      desc: "Captures scroll attention in 3 seconds",
      icon: Flame,
    },
    {
      id: "clarity",
      label: "Value Clarity",
      score: result?.clarity_score ?? Math.round(overallScore * 1.02),
      color: "from-sky-400 to-blue-600",
      textColor: "text-sky-400",
      desc: "Communicates zero-ambiguity value proposition",
      icon: Brain,
    },
    {
      id: "desire",
      label: "Desire Building",
      score: result?.desire_score ?? Math.round(overallScore * 0.98),
      color: "from-purple-400 to-indigo-600",
      textColor: "text-purple-400",
      desc: "Triggers visceral emotional aspiration",
      icon: Target,
    },
    {
      id: "persuasion",
      label: "Persuasion Force",
      score: result?.persuasion_score ?? overallScore,
      color: "from-emerald-400 to-teal-600",
      textColor: "text-emerald-400",
      desc: "Overcomes cognitive friction and objections",
      icon: ShieldCheck,
    },
    {
      id: "action",
      label: "Action Urgency",
      score: result?.action_score ?? Math.round(overallScore * 0.92),
      color: "from-rose-400 to-red-600",
      textColor: "text-rose-400",
      desc: "Compels immediate commitment and conversion",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07050E] text-white flex flex-col font-sans selection:bg-white/20 relative overflow-x-hidden">
      {/* 
        OFF-SCREEN FIXED 1080x1920 INSTAGRAM STORY CANVAS CAPTURE NODE
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
            shareSlug={slug}
            userCopy={evaluatedUserCopy}
            biggestLeverage={result?.biggest_leverage}
            diagnosis={result?.diagnosis}
          />
        </div>
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-white/10 bg-black/40 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onGoToHome}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <QreatoLogo size={28} className="text-white group-hover:scale-105 transition-transform" />
          <span 
            className="text-base sm:text-lg font-bold tracking-tight text-white font-nohemi"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            Qreato
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onGoToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.12] text-xs font-medium text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={onGoToSignup}
            className="flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer"
          >
            <span>Score Your Copy Free</span>
            <ArrowRight size={14} className="stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-8 sm:py-14 max-w-4xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 animate-pulse">
              Retrieving Challenge Score…
            </p>
          </div>
        ) : notFound ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl text-center shadow-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">This challenge result wasn't found</h2>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">
              The copy score link you followed may have expired, or the challenge slug does not exist.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onGoToHome}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/20 bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Go to Homepage
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
            transition={{ duration: 0.6 }}
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
            <div 
              ref={cardRef}
              className="relative rounded-3xl border p-6 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.22)] overflow-hidden"
              style={{
                backgroundColor: config.cardBg,
                borderColor: config.cardBorder,
              }}
            >
              {/* Internal ambient glow */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-30"
                style={{ background: config.radialGlow }}
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Top Header Bar */}
                <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center" title="Qreato">
                    <QreatoLogo size={32} className="text-white" dotClassName="text-white fill-white" />
                  </div>

                  <div className="flex flex-col items-end text-right">
                    <span 
                      className="text-xs sm:text-sm font-bold tracking-tight text-white font-nohemi"
                      style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                    >
                      Test your own copy
                    </span>
                    <a
                      href="https://murgii.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] sm:text-xs font-mono font-medium text-white/70 hover:text-white underline underline-offset-2 tracking-wide transition-colors mt-0.5"
                    >
                      murgii.vercel.app
                    </a>
                  </div>
                </div>

                {/* Big Score Header */}
                <div className="flex flex-col items-center">
                  <div className="text-[11px] uppercase font-mono tracking-widest text-white/50 mb-1">
                    Overall Persuasion Rating
                  </div>
                  <div className="flex items-baseline justify-center gap-1.5 my-1">
                    <span 
                      className="text-6xl sm:text-8xl font-black font-['Nohemi',sans-serif] tracking-tight text-white"
                      style={{ filter: config.scoreGlow }}
                    >
                      {overallScore}
                    </span>
                    <span className="text-3xl sm:text-4xl font-bold text-white/40 font-mono">
                      /100
                    </span>
                  </div>
                  
                  <div 
                    className="mt-2 px-4 py-1 rounded-full border text-xs font-bold font-mono tracking-wider uppercase shadow-sm"
                    style={{
                      backgroundColor: config.badgeBg,
                      borderColor: config.badgeBorder,
                      color: config.badgeText,
                    }}
                  >
                    {config.tierLabel}
                  </div>
                </div>

                {/* Evaluated Copy Box */}
                {evaluatedUserCopy && (
                  <div 
                    className="w-full mt-6 p-4 rounded-2xl border text-left relative overflow-hidden"
                    style={{
                      backgroundColor: config.boxBg,
                      borderColor: "rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white/70" />
                        <span className="text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase">
                          EVALUATED COPY
                        </span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-white/95 font-normal italic leading-relaxed break-words font-sans">
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

                {/* Biggest Leverage Point */}
                {result?.biggest_leverage && (
                  <div className="w-full mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase font-mono tracking-wider font-bold text-amber-300 mb-0.5">
                        Biggest Leverage Opportunity
                      </div>
                      <div className="text-xs text-white/85 leading-relaxed">
                        {result.diagnosis || result.biggest_leverage}
                      </div>
                    </div>
                  </div>
                )}

                {/* Finished Card Footer Banner */}
                <div className="w-full mt-6 pt-4 border-t border-white/[0.1] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-white/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span>Tested on Qreato Copy Engine</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Score yours free at</span>
                    <a href="https://murgii.vercel.app" target="_blank" rel="noopener noreferrer" className="text-white font-bold underline">murgii.vercel.app</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Share & Challenge Controls Bar */}
            <div className="w-full rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl p-4 sm:p-6 flex flex-col gap-3 shadow-lg">
              <div className="text-[10px] uppercase font-mono tracking-widest text-white/40 text-center">
                Share 1080x1920 Story Card or Challenge a Colleague
              </div>

              {/* Primary Full Width Share Button */}
              <button
                type="button"
                onClick={handleUnifiedShare}
                disabled={isSharing || isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_2px_15px_rgba(255,255,255,0.25)] cursor-pointer"
              >
                {isSharing || isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>{isGenerating ? "Generating 1080x1920 Card..." : "Preparing Share Sheet..."}</span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="stroke-[2.5]" />
                    <span>Share 1080x1920 Instagram Story Card</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-3 w-full">
                {/* Share to X */}
                <button
                  type="button"
                  onClick={handleShareX}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <XIcon size={14} />
                  <span className="truncate">Share X</span>
                </button>

                {/* Share to Instagram */}
                <button
                  type="button"
                  onClick={handleShareInstagram}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl bg-gradient-to-r from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F56040]/20 hover:from-[#833AB4]/35 hover:via-[#FD1D1D]/35 hover:to-[#F56040]/35 border border-[#FD1D1D]/30 text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <InstagramIcon size={14} className="text-[#FD1D1D]" />
                  <span className="truncate">Instagram</span>
                </button>

                {/* Share to Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/30 text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FacebookIcon size={14} className="text-[#1877F2]" />
                  <span className="truncate">Facebook</span>
                </button>

                {/* Download Card */}
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  disabled={isDownloading || isGenerating}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isDownloading || isGenerating ? <Loader2 size={14} className="animate-spin text-white" /> : <Download size={14} />}
                  <span className="truncate">Save Card</span>
                </button>
              </div>

              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  copiedLink
                    ? "bg-[#10B981] text-black border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    : "bg-white/[0.08] hover:bg-white/[0.15] text-white border-white/20"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check size={14} className="stroke-[3]" />
                    <span>Challenge Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="stroke-[2.5]" />
                    <span>Copy Challenge URL</span>
                  </>
                )}
              </button>

              {toastMessage && (
                <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-xs text-[#E0AAFF] font-mono text-center">
                  {toastMessage}
                </div>
              )}
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
