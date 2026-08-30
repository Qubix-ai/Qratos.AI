import React, { useState, useRef } from "react";
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Download,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { QreatoLogo } from "./QreatoLogo";
import { copyToClipboard } from "../lib/clipboard";

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
  // If explicitly provided via props
  if (customLeverage && customDiagnosis) {
    return {
      dimension: customLeverage.toUpperCase(),
      diagnosis: customDiagnosis,
    };
  }

  // If dimension scores are provided, find the lowest
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

  // Curated editorial diagnoses matched to score thresholds
  if (overallScore <= 45) {
    return {
      dimension: "PERSUASION",
      diagnosis: "The copy lacks emotional friction and urgent risk-reversal to compel immediate action.",
    };
  } else if (overallScore <= 60) {
    return {
      dimension: "HOOK RETENTION",
      diagnosis: "The opening hook fails to interrupt attention and prove instant relevance in the first 3 seconds.",
    };
  } else if (overallScore <= 75) {
    return {
      dimension: "DESIRE AMPLIFICATION",
      diagnosis: "The copy presents logical benefits but fails to trigger visceral emotional commitment.",
    };
  } else if (overallScore <= 88) {
    return {
      dimension: "ACTION CONVERSION",
      diagnosis: "Strong narrative foundation, but the closing call-to-action needs sharper incentive friction.",
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
  className = "",
  onNavigateToPublicChallenge,
  biggestLeverage,
  diagnosis,
  dimensions,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cleanSlug = shareSlug ? shareSlug.trim() : "";
  const shareUrl = `https://murgii.vercel.app/challenge/${cleanSlug}`;
  const shareText = `I got ${overallScore}/100 on Murgii Copy Score. Can you beat me?`;

  const leverageData = getLeverageData(overallScore, biggestLeverage, diagnosis, dimensions);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Helper to generate a clean PNG File object from the scorecard element
  const generateScorecardFile = async (): Promise<File | null> => {
    if (!cardRef.current) return null;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#090810",
        skipFonts: true,
        fontEmbedCSS: "",
        filter: (node) => {
          // Exclude action buttons bar from the generated image for a clean showcase card
          if (node instanceof HTMLElement && node.dataset.noCapture === "true") {
            return false;
          }
          return true;
        },
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `murgii-challenge-${cleanSlug || overallScore}.png`;
      return new File([blob], filename, { type: "image/png" });
    } catch (err) {
      console.warn("Failed to generate scorecard file:", err);
      return null;
    }
  };

  // Native Web Share flow attaching the scorecard image File
  const handleShareButton = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      // 1. Generate the scorecard image file
      const imageFile = await generateScorecardFile();

      // 2. Check if Web Share API is available on the device
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        // Prepare share data with image File if canShare supports it
        let shareDataWithFiles: ShareData | null = null;

        if (imageFile) {
          const testData = {
            files: [imageFile],
            title: "Murgii Copy Score",
            text: shareText,
            url: shareUrl,
          };

          if (typeof navigator.canShare === "function") {
            try {
              if (navigator.canShare({ files: [imageFile] })) {
                shareDataWithFiles = testData;
              } else if (navigator.canShare({ title: testData.title, text: testData.text, url: testData.url })) {
                shareDataWithFiles = {
                  title: testData.title,
                  text: testData.text,
                  url: testData.url,
                };
              }
            } catch {
              shareDataWithFiles = testData;
            }
          } else {
            shareDataWithFiles = testData;
          }
        }

        const payloadToShare = shareDataWithFiles || {
          title: "Murgii Copy Score",
          text: shareText,
          url: shareUrl,
        };

        try {
          await navigator.share(payloadToShare);
          showToast("Scorecard shared!");
          setIsSharing(false);
          return;
        } catch (shareErr: any) {
          // If user aborted or dismissed the share sheet, exit cleanly without error
          if (shareErr && (shareErr.name === "AbortError" || shareErr.message?.includes("abort"))) {
            setIsSharing(false);
            return;
          }

          // If sharing with files failed, try text/url fallback
          if (shareDataWithFiles?.files) {
            try {
              await navigator.share({
                title: "Murgii Copy Score",
                text: shareText,
                url: shareUrl,
              });
              setIsSharing(false);
              return;
            } catch {
              // Fall through to clipboard copy
            }
          }
        }
      }

      // 3. Fallback when Web Share is unsupported or fails: Copy link & show toast
      const success = await copyToClipboard(`${shareText} ${shareUrl}`);
      if (success) {
        setCopiedLink(true);
        showToast("Challenge link & score copied!");
        setTimeout(() => setCopiedLink(false), 2400);
      } else {
        showToast("Link: " + shareUrl);
      }
    } catch (err) {
      console.warn("Share flow failed:", err);
      showToast("Challenge link: " + shareUrl);
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareX = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  // Dedicated Instagram / Instagram Stories native share & save flow
  const handleShareInstagram = async () => {
    // Copy score caption & link for easy paste
    await copyToClipboard(`${shareText} ${shareUrl}`);

    // If native share sheet is supported on mobile, invoke it with the image file
    // which allows users to select Instagram or Instagram Stories directly
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        const imageFile = await generateScorecardFile();
        if (imageFile && typeof navigator.canShare === "function" && navigator.canShare({ files: [imageFile] })) {
          await navigator.share({
            files: [imageFile],
            title: "Murgii Copy Score",
            text: shareText,
          });
          return;
        } else {
          await navigator.share({
            title: "Murgii Copy Score",
            text: shareText,
            url: shareUrl,
          });
          return;
        }
      } catch (err: any) {
        if (err && (err.name === "AbortError" || err.message?.includes("abort"))) {
          return;
        }
      }
    }

    showToast("Caption copied! Download the card to share to Instagram Stories.");
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      // Allow fonts and styles to resolve cleanly without cross-origin cssRules blocking
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#090810",
        skipFonts: true,
        fontEmbedCSS: "",
        filter: (node) => {
          // Exclude action buttons bar from the saved gallery image for a clean showcase card
          if (node instanceof HTMLElement && node.dataset.noCapture === "true") {
            return false;
          }
          return true;
        },
      });

      const downloadLink = document.createElement("a");
      downloadLink.download = `murgii-challenge-score-${overallScore}.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadSuccess(true);
      showToast("Scorecard image downloaded to your gallery!");
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to download scorecard image:", err);
      showToast("Failed to save image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`mt-4 relative rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-[#0c0814]/95 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.18)] overflow-hidden ${className}`}
    >
      {/* Subtle deep burgundy ambient glow */}
      <div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20 bg-[#8B2652]"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Top Header Bar: Big Clear Qreato Logo Watermark on Top Left, Murgii AI Challenge on Right */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          {/* Top Left: Bold Iconic Qreato Brand Logo */}
          <div className="flex items-center" title="Qreato">
            <QreatoLogo 
              size={34} 
              className="text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.65)] hover:scale-105 transition-transform" 
              dotClassName="text-white fill-white" 
            />
          </div>

          {/* Top Right: Murgii AI Challenge */}
          <span 
            className="text-xs sm:text-sm font-bold tracking-wider text-white/90 font-nohemi"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            Murgii AI Challenge
          </span>
        </div>

        {/* Big Dominant Score Display (e.g. 35/100) */}
        <div className="relative my-3 sm:my-4 flex flex-col items-center">
          <div className="flex items-baseline justify-center tracking-tight">
            <span 
              className="text-6xl sm:text-7xl font-black font-['Nohemi',sans-serif] tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.35)] leading-none"
            >
              {overallScore}
            </span>
            <span className="text-2xl sm:text-3xl font-semibold text-white/35 font-mono ml-1.5">
              /100
            </span>
          </div>
        </div>

        {/* Small "BIGGEST LEVERAGE" Label + Weakest Dimension + 1-2 Line Diagnosis */}
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

        {/* Strong Bottom CTA: "I GOT 35. CAN YOU BEAT ME?" */}
        <div className="w-full mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-center">
          <div className="w-full py-2.5 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-center shadow-inner">
            <span 
              className="text-xs sm:text-sm font-black tracking-widest text-white uppercase font-nohemi drop-shadow-sm"
              style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              I GOT {overallScore}. CAN YOU BEAT ME?
            </span>
          </div>
        </div>

        {/* Short, Streamlined Share & Download Action Area (excluded from screenshot) */}
        <div data-no-capture="true" className="w-full mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-1.5 w-full">
            {/* Primary Share Card Button */}
            <button
              type="button"
              onClick={handleShareButton}
              disabled={isSharing}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                copiedLink
                  ? "bg-[#10B981] text-black border-[#10B981] shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                  : "bg-white text-black hover:bg-neutral-200 border-white shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
              }`}
              title="Share scorecard with attached image"
            >
              {isSharing ? (
                <>
                  <Loader2 size={13} className="animate-spin text-black" />
                  <span>Preparing...</span>
                </>
              ) : copiedLink ? (
                <>
                  <Check size={13} className="stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={13} className="stroke-[2.5]" />
                  <span>Share Card</span>
                </>
              )}
            </button>

            {/* X Icon Button */}
            <button
              type="button"
              onClick={handleShareX}
              className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
              title="Share on X"
              aria-label="Share on X"
            >
              <XIcon size={13} />
            </button>

            {/* Instagram Icon Button */}
            <button
              type="button"
              onClick={handleShareInstagram}
              className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F56040]/20 hover:from-[#833AB4]/40 hover:via-[#FD1D1D]/40 hover:to-[#F56040]/40 border border-[#FD1D1D]/30 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
              title="Share on Instagram"
              aria-label="Share on Instagram"
            >
              <InstagramIcon size={14} className="text-[#FD1D1D]" />
            </button>

            {/* Facebook Icon Button */}
            <button
              type="button"
              onClick={handleShareFacebook}
              className="w-8 h-8 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/30 border border-[#1877F2]/30 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
              title="Share on Facebook"
              aria-label="Share on Facebook"
            >
              <FacebookIcon size={14} className="text-[#1877F2]" />
            </button>

            {/* Download Scorecard to Gallery Button */}
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0 ${
                downloadSuccess
                  ? "bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]"
                  : "bg-white/[0.06] hover:bg-white/[0.14] border-white/10 hover:border-white/25 text-white/90 hover:text-white"
              }`}
              title="Save scorecard to gallery"
              aria-label="Save scorecard image"
            >
              {isDownloading ? (
                <Loader2 size={13} className="animate-spin text-white" />
              ) : downloadSuccess ? (
                <Check size={14} className="stroke-[2.5]" />
              ) : (
                <Download size={14} className="stroke-[2]" />
              )}
            </button>

            {/* Open Public Challenge Link if Available */}
            {cleanSlug && (
              <a
                href={`/challenge/${cleanSlug}`}
                onClick={(e) => {
                  if (onNavigateToPublicChallenge) {
                    e.preventDefault();
                    onNavigateToPublicChallenge(cleanSlug);
                  }
                }}
                className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 shrink-0"
                title="Open Public Challenge Page"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>

          {/* Dynamic Feedback Toast */}
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
      </div>
    </motion.div>
  );
};

