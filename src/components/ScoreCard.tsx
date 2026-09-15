import React, { useState, useRef, useEffect } from "react";
import { 
  Share2, 
  Download,
  Check,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QreatoLogo } from "./QreatoLogo";
import { StoryScoreCard, getScoreTierConfig } from "./StoryScoreCard";
import { computeStrongestElement } from "../lib/scoreData";
import { 
  captureStoryImage, 
  downloadImageFile, 
  executeNativeShare 
} from "../lib/storyCapture";

export interface ScoreCardProps {
  overallScore: number;
  shareSlug: string;
  userCopy?: string;
  className?: string;
  onNavigateToPublicChallenge?: (slug: string) => void;
  strongestDimension?: string;
  strongestElement?: string;
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

export const ScoreCard: React.FC<ScoreCardProps> = ({
  overallScore,
  shareSlug,
  userCopy,
  className = "",
  strongestElement,
  dimensions,
}) => {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
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

  // Computed from actual 5 subscores to guarantee genuine mathematical accuracy
  const strongestInfo = computeStrongestElement(dimensions, strongestElement);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cache key unique to this scorecard configuration
  const cacheKey = `scorecard-${overallScore}-${cleanSlug}-${cleanUserCopy.slice(0, 40)}`;
  const cachedFileRef = useRef<File | null>(null);

  // Background single-pass pre-generation — renders once when score is produced, then caches
  useEffect(() => {
    let isMounted = true;
    const captureTimeout = setTimeout(async () => {
      if (storyCardRef.current && isMounted && !cachedFileRef.current) {
        try {
          const filename = `qreato-copy-score-${cleanSlug || overallScore}.png`;
          const file = await captureStoryImage(storyCardRef.current, filename, cacheKey);
          if (file && isMounted) {
            cachedFileRef.current = file;
          }
        } catch (e) {
          console.warn("Card pregeneration:", e);
        }
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(captureTimeout);
    };
  }, [overallScore, cleanSlug, cleanUserCopy, cacheKey]);

  // Helper to retrieve or generate card image on-demand
  const ensureImageFile = async (): Promise<File | null> => {
    if (cachedFileRef.current) return cachedFileRef.current;
    if (storyCardRef.current) {
      const filename = `qreato-copy-score-${cleanSlug || overallScore}.png`;
      const file = await captureStoryImage(storyCardRef.current, filename, cacheKey);
      if (file) {
        cachedFileRef.current = file;
        return file;
      }
    }
    return null;
  };

  // Native OS Share Sheet (Web Share API) — Zero custom modal, zero lag
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

  // Direct Download — saves cached image directly to gallery/downloads
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const imageFile = await ensureImageFile();
      if (!imageFile) {
        showToast("Unable to render image. Tap to retry.");
        return;
      }

      const success = downloadImageFile(imageFile, `qreato-copy-score-${overallScore}.png`);
      if (success) {
        setDownloadSuccess(true);
        showToast("Scorecard saved to your device!");
        setTimeout(() => setDownloadSuccess(false), 2800);
      }
    } catch (err) {
      console.error("Download error:", err);
      showToast("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`mt-4 w-full flex flex-col ${className}`}
    >
      {/* 
        OFF-SCREEN 1080x1920 STORY CAPTURE TARGET
        Rendered once and cached for both Share and Download
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
            strongestDimension={strongestInfo.dimensionUpper}
            strongestElement={strongestInfo.line}
            dimensions={dimensions}
          />
        </div>
      </div>

      {/* IN-VIEWPORT INTERACTIVE SCORE CARD */}
      <div
        className="w-full relative rounded-3xl border border-white/10 p-6 sm:p-9 shadow-2xl overflow-hidden flex flex-col items-center text-center"
        style={{
          backgroundColor: "#0A0A0A",
          background: "radial-gradient(ellipse at 50% 40%, #161616 0%, #0A0A0A 70%, #050505 100%)",
        }}
      >
        <div className="relative z-10 w-full flex flex-col items-center text-center">
          {/* Top Header Bar — Top-left shows ONLY the Qreato logo mark, nothing else */}
          <div className="w-full flex items-center justify-start pb-5 mb-7 border-b border-white/10 px-1">
            <QreatoLogo 
              size={30} 
              className="text-white" 
              dotClassName="text-white fill-white" 
            />
          </div>

          {/* Evaluated Copy Snippet — Kept intact */}
          {cleanUserCopy && (
            <div className="w-full mb-7 flex flex-col items-center text-center">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-white/40 uppercase mb-2">
                EVALUATED COPY
              </span>
              <p className="text-sm sm:text-base text-white/88 font-normal italic leading-relaxed line-clamp-3 max-w-md font-sans">
                "{cleanUserCopy}"
              </p>
            </div>
          )}

          {/* Big Dominant Score Centerpiece — No label above, no status pill under */}
          <div className="relative mb-7 flex flex-col items-center">
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

          {/* Thin Accent Rule */}
          <div 
            className="w-16 h-[1px] mb-7 opacity-75"
            style={{ backgroundColor: config.accentColor }}
          />

          {/* Strongest Element Callout — Positive, computed from actual subscores */}
          <div className="w-full max-w-md flex flex-col items-center text-center">
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-white/40 uppercase mb-2">
              STRONGEST ELEMENT
            </span>
            <span 
              className="text-base sm:text-xl font-bold tracking-wider uppercase font-nohemi"
              style={{ color: config.accentColor }}
            >
              {strongestInfo.dimensionUpper}
            </span>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed mt-2 font-sans max-w-sm">
              {strongestInfo.line}
            </p>
          </div>

          {/* Challenge Line — Perfectly centered, no logo, no wordmark, no extra text */}
          <div className="w-full mt-7 p-4 sm:p-5 rounded-2xl border border-white/15 bg-white/[0.02] flex items-center justify-center text-center">
            <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase font-nohemi text-center">
              I GOT {overallScore}. CAN YOU BEAT ME?
            </span>
          </div>
        </div>
      </div>

      {/* Two Action Buttons: Share and Download */}
      <div className="w-full mt-3 px-1 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2.5 w-full">
          {/* Button 1: Share — Triggers OS native share sheet */}
          <button
            type="button"
            onClick={handleShare}
            disabled={isSharing}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border bg-white text-black hover:bg-neutral-200 border-white shadow-[0_2px_12px_rgba(255,255,255,0.18)] flex items-center justify-center gap-2 active:scale-[0.99]"
            title="Share score card"
          >
            {isSharing ? (
              <>
                <Loader2 size={15} className="animate-spin text-black" />
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <Share2 size={15} className="stroke-[2.5]" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Button 2: Download — Directly saves cached card image to device */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer border flex items-center justify-center gap-2 active:scale-[0.99] ${
              downloadSuccess
                ? "bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]"
                : "bg-white/[0.08] hover:bg-white/[0.14] border-white/20 text-white"
            }`}
            title="Download score card image"
          >
            {isDownloading ? (
              <>
                <Loader2 size={15} className="animate-spin text-white" />
                <span>Saving...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check size={15} className="stroke-[2.5]" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Download size={15} className="stroke-[2.5]" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Toast Notification Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 3, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -3, height: 0 }}
              className="text-[11px] font-mono text-[#E0AAFF] bg-white/[0.04] border border-white/10 rounded-lg py-1.5 px-3 text-center"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
