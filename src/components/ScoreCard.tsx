import React, { useState, useRef, useEffect } from "react";
import { 
  Share2, 
  Check, 
  ExternalLink, 
  Download,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QreatoLogo } from "./QreatoLogo";
import { copyToClipboard } from "../lib/clipboard";
import { StoryScoreCard, getScoreTierConfig } from "./StoryScoreCard";
import { captureStoryImage, executeUnifiedShare } from "../lib/storyCapture";

// Custom SVG Icons for Social Platforms (Icon Only)
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

export interface ScoreCardProps {
  overallScore: number;
  shareSlug: string;
  userCopy?: string;
  className?: string;
  onNavigateToPublicChallenge?: (slug: string) => void;
  biggestLeverage?: string;
  diagnosis?: string;
  dimensions?: {
    attention?: number;
    clarity?: number;
    desire?: number;
    persuasion?: number;
    action?: number;
  };
}

// Helper to determine the weakest leverage dimension and 1-2 line editorial diagnosis
function getLeverageData(
  overallScore: number,
  customLeverage?: string,
  customDiagnosis?: string,
  dimensions?: { [key: string]: number | undefined }
) {
  if (customLeverage && customDiagnosis) {
    return {
      dimension: customLeverage.toUpperCase(),
      diagnosis: customDiagnosis,
    };
  }

  if (dimensions) {
    const entries = Object.entries(dimensions).filter(([_, val]) => typeof val === "number") as [string, number][];
    if (entries.length > 0) {
      entries.sort((a, b) => a[1] - b[1]);
      const lowestKey = entries[0][0].toLowerCase();
      
      const diagnosisMap: Record<string, { name: string; diagnosis: string }> = {
        persuasion: {
          name: "PERSUASION",
          diagnosis: "The copy lacks emotional friction and urgent risk-reversal to compel immediate commitment.",
        },
        attention: {
          name: "HOOK RETENTION",
          diagnosis: "The opening hook lacks curiosity and pattern-interruption to stop the scroll in 3 seconds.",
        },
        clarity: {
          name: "VALUE CLARITY",
          diagnosis: "The core proposition is obscured by complex phrasing instead of concrete transformation outcomes.",
        },
        desire: {
          name: "DESIRE BUILDING",
          diagnosis: "The message lists functional features rather than triggering visceral aspirational transformation.",
        },
        action: {
          name: "ACTION URGENCY",
          diagnosis: "The closing call-to-action lacks urgent conviction and immediate incentive to act now.",
        },
      };

      if (diagnosisMap[lowestKey]) {
        return {
          dimension: customLeverage ? customLeverage.toUpperCase() : diagnosisMap[lowestKey].name,
          diagnosis: customDiagnosis || diagnosisMap[lowestKey].diagnosis,
        };
      }
    }
  }

  if (customLeverage) {
    return {
      dimension: customLeverage.toUpperCase(),
      diagnosis: customDiagnosis || "Lacks psychological friction and urgent risk-reversal to compel conversion.",
    };
  }

  if (overallScore <= 49) {
    return {
      dimension: "PERSUASION",
      diagnosis: "The copy lacks emotional friction and urgent risk-reversal to compel immediate action.",
    };
  } else if (overallScore <= 74) {
    return {
      dimension: "HOOK RETENTION",
      diagnosis: "The opening hook fails to interrupt attention and prove instant relevance in the first 3 seconds.",
    };
  } else {
    return {
      dimension: "CONVERSION VELOCITY",
      diagnosis: "Elite copy architecture with high velocity conversion triggers across all touchpoints.",
    };
  }
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  overallScore,
  shareSlug,
  userCopy,
  className = "",
  onNavigateToPublicChallenge,
  biggestLeverage,
  diagnosis,
  dimensions,
}) => {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const config = getScoreTierConfig(overallScore);
  const cleanSlug = shareSlug ? shareSlug.trim() : "";
  const shareUrl = typeof window !== "undefined" && window.location.origin
    ? `${window.location.origin}/challenge/${cleanSlug}`
    : `https://murgii.vercel.app/challenge/${cleanSlug}`;

  const sanitizeUserCopy = (text?: string) => {
    if (!text) return "";
    let cleaned = text.trim();
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
    return cleaned || text.trim();
  };

  const cleanUserCopy = sanitizeUserCopy(userCopy);
  const copySnippet = cleanUserCopy 
    ? (cleanUserCopy.length > 55 ? cleanUserCopy.slice(0, 52) + "..." : cleanUserCopy)
    : "";

  const shareText = copySnippet
    ? `I scored ${overallScore}/100 on Qreato Copy Challenge for: "${copySnippet}" — Can you beat me?`
    : `I scored ${overallScore}/100 on Qreato Copy Challenge. Can you beat me?`;

  const leverageData = getLeverageData(overallScore, biggestLeverage, diagnosis, dimensions);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const pregeneratedFileRef = useRef<File | null>(null);

  // Helper to trigger story image capture
  const generateStoryFile = async (): Promise<File | null> => {
    if (!storyCardRef.current) return null;
    const filename = `qreato-copy-score-${cleanSlug || overallScore}.png`;
    return await captureStoryImage(storyCardRef.current, filename);
  };

  // Background pre-generation of 1080x1920 Story image
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
          console.warn("Background story card pregeneration error:", e);
        }
      }
    }, 350);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [overallScore, cleanSlug, userCopy]);

  // Primary Unified Share Flow
  const handleShareButton = async () => {
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
      showToast("Failed to open share sheet. Retrying...");
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareX = async () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
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
    await handleShareButton();
  };

  const handleDownloadCard = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      let imageFile = pregeneratedFileRef.current;
      if (!imageFile) {
        setIsGenerating(true);
        showToast("Generating high-res card...");
        imageFile = await generateStoryFile();
        setIsGenerating(false);
        if (imageFile) pregeneratedFileRef.current = imageFile;
      }

      if (!imageFile) {
        showToast("Failed to generate card image. Tap to retry.");
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

      setDownloadSuccess(true);
      showToast("Scorecard image saved to gallery!");
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to download card:", err);
      showToast("Failed to save image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`mt-4 w-full flex flex-col ${className}`}
    >
      {/* 
        OFF-SCREEN FIXED 1080x1920 INSTAGRAM STORY CANVAS CAPTURE NODE
        This guarantees 100% reliable 9:16 Story framing on all devices.
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
            userCopy={userCopy}
            biggestLeverage={biggestLeverage}
            diagnosis={diagnosis}
            dimensions={dimensions}
          />
        </div>
      </div>

      {/* IN-VIEWPORT INTERACTIVE SCORE CARD */}
      <div
        className="w-full relative rounded-3xl border p-5 sm:p-7 shadow-[0_24px_70px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.22)] overflow-hidden flex flex-col items-center text-center transition-all duration-300"
        style={{
          backgroundColor: config.cardBg,
          borderColor: config.cardBorder,
        }}
      >
        {/* Subtle ambient radial glow behind card matching tier */}
        <div 
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-30"
          style={{ background: config.radialGlow }}
        />

        <div className="relative z-10 w-full flex flex-col items-center text-center">
          {/* Top Header Bar */}
          <div className="w-full flex items-center justify-between mb-3 px-0.5">
            <div className="flex items-center" title="Qreato">
              <QreatoLogo 
                size={34} 
                className="text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.65)]" 
                dotClassName="text-white fill-white" 
              />
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

          {/* Evaluated Copy Snippet */}
          {cleanUserCopy && (
            <div 
              className="w-full my-2.5 px-3.5 py-2.5 rounded-xl border text-left relative overflow-hidden"
              style={{
                backgroundColor: config.boxBg,
                borderColor: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-white/50 uppercase">
                    EVALUATED COPY
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-[13px] text-white/90 font-normal italic leading-relaxed line-clamp-3 break-words font-sans">
                "{cleanUserCopy}"
              </p>
            </div>
          )}

          {/* Big Dominant Score Display */}
          <div className="relative my-2 sm:my-3 flex flex-col items-center">
            <div className="flex items-baseline justify-center tracking-tight">
              <span 
                className="text-6xl sm:text-7xl font-black font-['Nohemi',sans-serif] tracking-tight text-white leading-none"
                style={{ filter: config.scoreGlow }}
              >
                {overallScore}
              </span>
              <span className="text-2xl sm:text-3xl font-semibold text-white/35 font-mono ml-1.5">
                /100
              </span>
            </div>

            {/* Score Tier Badge */}
            <div 
              className="mt-2 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold font-mono tracking-widest uppercase border shadow-sm"
              style={{
                backgroundColor: config.badgeBg,
                borderColor: config.badgeBorder,
                color: config.badgeText,
              }}
            >
              {config.tierLabel}
            </div>
          </div>

          {/* Leverage Diagnosis */}
          <div className="w-full max-w-sm flex flex-col items-center text-center my-1.5 px-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-white/40 uppercase mb-1">
              BIGGEST LEVERAGE
            </span>
            <span 
              className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-nohemi"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              {leverageData.dimension}
            </span>
            <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed mt-1 font-sans max-w-xs sm:max-w-sm">
              {leverageData.diagnosis}
            </p>
          </div>

          {/* Bottom Callout CTA */}
          <div className="w-full mt-4 pt-3 border-t border-white/[0.1] flex flex-col items-center gap-2">
            <div className="w-full py-2.5 px-3 rounded-xl bg-white/[0.08] border border-white/15 text-center shadow-inner">
              <span 
                className="text-xs sm:text-sm font-black tracking-widest text-white uppercase font-nohemi drop-shadow-sm"
                style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              >
                I GOT {overallScore}. CAN YOU BEAT ME?
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-white/50 tracking-wider pt-0.5">
              <span>Score yours at</span>
              <span className="text-white/80 font-bold underline">murgii.vercel.app</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="w-full mt-2.5 px-1 flex flex-col gap-2">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 w-full">
          {/* Primary Share Button */}
          <button
            type="button"
            onClick={handleShareButton}
            disabled={isSharing || isGenerating}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border bg-white text-black hover:bg-neutral-200 border-white shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
            title="Share 1080x1920 Story Card"
          >
            {isSharing || isGenerating ? (
              <>
                <Loader2 size={14} className="animate-spin text-black" />
                <span>{isGenerating ? "Generating..." : "Preparing..."}</span>
              </>
            ) : (
              <>
                <Share2 size={14} className="stroke-[2.5]" />
                <span>Share Card</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* X Icon Button */}
            <button
              type="button"
              onClick={handleShareX}
              className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
              title="Share on X"
              aria-label="Share on X"
            >
              <XIcon size={14} />
            </button>

            {/* Instagram Icon Button */}
            <button
              type="button"
              onClick={handleShareInstagram}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F56040]/20 hover:from-[#833AB4]/40 hover:via-[#FD1D1D]/40 hover:to-[#F56040]/40 border border-[#FD1D1D]/30 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
              title="Share on Instagram Story"
              aria-label="Share on Instagram Story"
            >
              <InstagramIcon size={15} className="text-[#FD1D1D]" />
            </button>

            {/* Facebook Icon Button */}
            <button
              type="button"
              onClick={handleShareFacebook}
              className="w-9 h-9 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/30 border border-[#1877F2]/30 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
              title="Share on Facebook"
              aria-label="Share on Facebook"
            >
              <FacebookIcon size={15} className="text-[#1877F2]" />
            </button>

            {/* Download Scorecard Button */}
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={isDownloading || isGenerating}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0 ${
                downloadSuccess
                  ? "bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]"
                  : "bg-white/[0.06] hover:bg-white/[0.14] border-white/10 hover:border-white/25 text-white/90 hover:text-white"
              }`}
              title="Save 1080x1920 image to gallery"
              aria-label="Save scorecard image"
            >
              {isDownloading || isGenerating ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : downloadSuccess ? (
                <Check size={15} className="stroke-[2.5]" />
              ) : (
                <Download size={15} className="stroke-[2]" />
              )}
            </button>

            {/* Open Public Challenge Link */}
            {cleanSlug && (
              <a
                href={`/challenge/${cleanSlug}`}
                onClick={(e) => {
                  if (onNavigateToPublicChallenge) {
                    e.preventDefault();
                    onNavigateToPublicChallenge(cleanSlug);
                  }
                }}
                className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 shrink-0"
                title="Open Public Challenge Page"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Dynamic Toast Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="text-[11px] font-mono text-[#E0AAFF] bg-white/[0.04] border border-white/10 rounded-lg py-1 px-2.5 text-center mt-1"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
