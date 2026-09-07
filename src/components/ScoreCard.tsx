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
import { captureStoryImage } from "../lib/storyCapture";
import { ShareModal } from "./ShareModal";

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  // Primary Share Flow — Opens the rich Share Modal with Instagram, X, Facebook, Messenger options
  const handleShareButton = async () => {
    setIsShareModalOpen(true);
    // Pregenerate high-res file if not already done so it's instantly ready
    if (!pregeneratedFileRef.current && !isGenerating) {
      setIsGenerating(true);
      generateStoryFile()
        .then((file) => {
          if (file) pregeneratedFileRef.current = file;
        })
        .catch((err) => console.warn("Background card generation error:", err))
        .finally(() => setIsGenerating(false));
    }
  };

  const handleShareX = async () => {
    setIsShareModalOpen(true);
  };

  const handleShareFacebook = async () => {
    setIsShareModalOpen(true);
  };

  const handleShareInstagram = async () => {
    setIsShareModalOpen(true);
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
        className="w-full relative rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col items-center text-center transition-all duration-300"
        style={{
          backgroundColor: "#0A0A0A",
          background: "radial-gradient(ellipse at 50% 40%, #161616 0%, #0A0A0A 70%, #050505 100%)",
        }}
      >
        <div className="relative z-10 w-full flex flex-col items-center text-center">
          {/* Top Header Bar */}
          <div className="w-full flex items-center justify-between pb-6 mb-8 border-b border-white/10 px-1">
            <div className="flex items-center gap-3">
              <QreatoLogo 
                size={32} 
                className="text-white" 
                dotClassName="text-white fill-white" 
              />
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-white font-nohemi leading-none">
                  Qreato Copy Engine
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase mt-1">
                  PERSUASION AUDIT
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-xs font-mono font-medium text-white/40 tracking-wide">
                murgii.vercel.app
              </span>
            </div>
          </div>

          {/* Evaluated Copy Snippet — Clean quoted string without container box */}
          {cleanUserCopy && (
            <div className="w-full mb-8 flex flex-col items-center text-center">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-white/40 uppercase mb-2">
                EVALUATED COPY
              </span>
              <p className="text-sm sm:text-base text-white/88 font-normal italic leading-relaxed line-clamp-3 max-w-md font-sans">
                "{cleanUserCopy}"
              </p>
            </div>
          )}

          {/* Big Dominant Score Display */}
          <div className="relative mb-8 flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold tracking-[0.28em] text-white/40 uppercase mb-3">
              OVERALL PERSUASION SCORE
            </span>
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

            {/* Score Tier Badge Pill */}
            <div className="mt-4 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-mono tracking-widest uppercase border border-white/15 bg-white/[0.02] text-white/70">
              {config.tierLabel}
            </div>
          </div>

          {/* Thin Accent Rule (1-2px in Accent Color) */}
          <div 
            className="w-16 h-[1px] mb-8 opacity-75"
            style={{ backgroundColor: config.accentColor }}
          />

          {/* Leverage Diagnosis */}
          <div className="w-full max-w-md flex flex-col items-center text-center">
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-white/40 uppercase mb-2">
              BIGGEST LEVERAGE
            </span>
            <span 
              className="text-base sm:text-xl font-bold tracking-wider uppercase font-nohemi"
              style={{ color: config.accentColor }}
            >
              {leverageData.dimension}
            </span>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed mt-2 font-sans max-w-sm">
              {leverageData.diagnosis}
            </p>
          </div>

          {/* Bottom Callout CTA Button */}
          <div className="w-full mt-8 p-4 sm:p-5 rounded-2xl border border-white/18 bg-white/[0.02] text-center flex flex-col items-center justify-center">
            <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase font-nohemi">
              I GOT {overallScore}. CAN YOU BEAT ME?
            </span>
            
            <span className="text-[11px] font-mono text-white/40 tracking-wider mt-1.5">
              Score your copy at <strong className="text-white/80 font-semibold">murgii.vercel.app</strong>
            </span>
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

        {/* Rich Sharing Sheet & Modal with Instagram Stories, Feed, X, Facebook, Messenger */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          overallScore={overallScore}
          shareSlug={cleanSlug}
          userCopy={userCopy}
          biggestLeverage={biggestLeverage}
          diagnosis={diagnosis}
          imageFile={pregeneratedFileRef.current}
          isGeneratingImage={isGenerating}
          onEnsureImageFile={generateStoryFile}
        />
      </div>
    </motion.div>
  );
};
