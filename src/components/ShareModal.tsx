import React, { useState } from "react";
import { 
  X as CloseIcon, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Loader2, 
  ExternalLink,
  MessageCircle,
  Smartphone,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { copyToClipboard } from "../lib/clipboard";
import { QreatoLogo } from "./QreatoLogo";

// Custom SVG Icons for exact social platform branding
const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const XTwitterIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const MessengerIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.085.3 2.238.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.192 14.962l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z" />
  </svg>
);

const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.301-.775.979-.95 1.18-.175.201-.35.226-.651.076-.301-.151-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.151-.675-1.628-.925-2.23-.244-.587-.492-.507-.676-.517-.175-.009-.375-.011-.575-.011-.2 0-.526.075-.802.376-.275.301-1.05 1.028-1.05 2.508s1.075 2.908 1.225 3.109c.15.2 2.115 3.23 5.124 4.53.716.31 1.275.495 1.71.634.719.229 1.373.197 1.89.12.577-.087 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.429-.075-.125-.275-.201-.576-.351zM12.04 21.785h-.002c-1.78 0-3.52-.48-5.04-1.39l-.36-.21-3.75.98 1-3.65-.23-.37a9.77 9.77 0 0 1-1.5-5.23c0-5.41 4.41-9.82 9.84-9.82 2.63 0 5.1 1.02 6.96 2.88 1.86 1.86 2.88 4.33 2.88 6.96 0 5.42-4.42 9.85-9.84 9.85zM12.04 0C5.45 0 .08 5.37.08 11.96c0 2.11.55 4.16 1.6 5.97L0 24l6.23-1.63c1.74.95 3.7 1.45 5.81 1.45 6.59 0 11.96-5.37 11.96-11.96C24 5.37 18.63 0 12.04 0z" />
  </svg>
);

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  overallScore: number;
  shareSlug: string;
  userCopy?: string;
  biggestLeverage?: string;
  diagnosis?: string;
  imageFile: File | null;
  isGeneratingImage?: boolean;
  onEnsureImageFile?: () => Promise<File | null>;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  overallScore,
  shareSlug,
  userCopy,
  imageFile,
  isGeneratingImage = false,
  onEnsureImageFile,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const cleanSlug = (shareSlug || "").replace(/[^a-zA-Z0-9_-]/g, "");
  const origin = typeof window !== "undefined" ? window.location.origin : "https://murgii.vercel.app";
  const shareUrl = cleanSlug 
    ? `${origin}/challenge/${cleanSlug}` 
    : `${origin}`;

  // Clean snippet for captions
  const sanitizeSnippet = (text?: string) => {
    if (!text) return "";
    let cleaned = text.trim().replace(/^["'“«]+|["'”»]+$/g, "").trim();
    if (cleaned.length > 55) return cleaned.slice(0, 52) + "...";
    return cleaned;
  };
  const snippet = sanitizeSnippet(userCopy);

  const shareText = snippet
    ? `I scored ${overallScore}/100 on Qreato Copy Challenge for: "${snippet}" — Can you beat me?`
    : `I scored ${overallScore}/100 on Qreato Copy Challenge. Can you beat me?`;

  const isInstagramInAppBrowser = typeof navigator !== "undefined" && /Instagram/i.test(navigator.userAgent || "");
  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const showStatus = (msg: string, duration = 3800) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage((curr) => (curr === msg ? null : curr));
    }, duration);
  };

  // Helper to ensure we have the generated PNG file
  const getOrGenerateFile = async (): Promise<File | null> => {
    if (imageFile) return imageFile;
    if (onEnsureImageFile) {
      showStatus("Rendering high-res 1080×1920 card...");
      const file = await onEnsureImageFile();
      return file;
    }
    return null;
  };

  // 1. Download card directly to device gallery
  const downloadCardFile = async (file: File | null) => {
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name || `qreato-copy-score-${overallScore}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.warn("Download error:", e);
    }
  };

  // 2. Share to Instagram Stories (The core user request)
  const handleInstagramStory = async () => {
    setActiveAction("instagram-story");
    try {
      const file = await getOrGenerateFile();
      
      // Step A: Save image to user's device gallery immediately so they have it
      if (file) {
        await downloadCardFile(file);
      }

      // Step B: Copy challenge link to clipboard so they can paste it as a link sticker
      await copyToClipboard(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);

      // Step C: Try Web Share API with file (iOS & Android native share opens Instagram Stories directly)
      if (file && hasNativeShare && typeof navigator.canShare === "function") {
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Qreato Copy Score",
              text: `${shareText}\n${shareUrl}`,
            });
            showStatus("Shared to Instagram!");
            setActiveAction(null);
            return;
          } catch (err: any) {
            if (err?.name === "AbortError") {
              setActiveAction(null);
              return;
            }
          }
        }
      }

      // Step D: If in Instagram Webview or native share not triggered, provide direct camera link or clear instructions
      if (isInstagramInAppBrowser) {
        showStatus("Card saved to Photos! Tap top-left (X) to exit browser, then swipe right to your Story!");
      } else {
        // Attempt deep link to Instagram story camera
        const deepLinks = [
          "instagram-stories://share",
          "instagram://story-camera",
          "instagram://app",
          "https://www.instagram.com/"
        ];
        
        // Open Instagram app
        window.location.href = deepLinks[0];
        
        showStatus("Card saved to camera roll & link copied! Opening Instagram...");
      }
    } catch (e) {
      console.error("Instagram Story error:", e);
      showStatus("Card downloaded! Open Instagram to post to Story.");
    } finally {
      setActiveAction(null);
    }
  };

  // 3. Share to Instagram Post / Feed
  const handleInstagramPost = async () => {
    setActiveAction("instagram-post");
    try {
      const file = await getOrGenerateFile();
      if (file) {
        await downloadCardFile(file);
      }
      await copyToClipboard(`${shareText}\n\nChallenge yourself at ${shareUrl} #Qreato #Copywriting #AI`);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);

      if (!isInstagramInAppBrowser) {
        window.location.href = "instagram://app";
      }
      showStatus("Card saved to Photos & caption copied! Open Instagram to create post.");
    } catch (e) {
      console.error(e);
      showStatus("Card downloaded to gallery.");
    } finally {
      setActiveAction(null);
    }
  };

  // 4. Share to X (Twitter)
  const handleShareX = async () => {
    setActiveAction("x");
    try {
      const file = await getOrGenerateFile();
      // If native share supported, try sharing file to X app directly
      if (file && hasNativeShare && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Qreato Copy Score",
            text: `${shareText}\n${shareUrl}`,
          });
          setActiveAction(null);
          return;
        } catch (err: any) {
          if (err?.name === "AbortError") {
            setActiveAction(null);
            return;
          }
        }
      }

      // Twitter Web Intent
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
    } finally {
      setActiveAction(null);
    }
  };

  // 5. Share to Facebook Feed / Post
  const handleFacebook = async () => {
    setActiveAction("facebook");
    try {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(fbUrl, "_blank", "noopener,noreferrer");
    } finally {
      setActiveAction(null);
    }
  };

  // 6. Share to Messenger
  const handleMessenger = async () => {
    setActiveAction("messenger");
    try {
      const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Deep link into Messenger app
        window.location.href = `fb-messenger://share?link=${encodeURIComponent(shareUrl)}`;
        setTimeout(() => {
          window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(shareUrl)}`, "_blank");
        }, 1200);
      } else {
        window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
      }
    } finally {
      setActiveAction(null);
    }
  };

  // 7. Share to WhatsApp
  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // 8. Device Native Share ("More Apps")
  const handleNativeDeviceShare = async () => {
    setActiveAction("native");
    try {
      const file = await getOrGenerateFile();
      if (file && hasNativeShare && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Qreato Copy Score",
          text: `${shareText}\n${shareUrl}`,
        });
        showStatus("Shared successfully!");
      } else if (hasNativeShare) {
        await navigator.share({
          title: "Qreato Copy Score",
          text: shareText,
          url: shareUrl,
        });
      } else {
        if (file) await downloadCardFile(file);
        await copyToClipboard(`${shareText} ${shareUrl}`);
        showStatus("Card downloaded & link copied to clipboard!");
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.warn("Native share error:", e);
      }
    } finally {
      setActiveAction(null);
    }
  };

  // 9. Direct Download Card Action
  const handleDownload = async () => {
    setActiveAction("download");
    try {
      const file = await getOrGenerateFile();
      if (file) {
        await downloadCardFile(file);
        showStatus("1080×1920 Story Card saved to device!");
      } else {
        showStatus("Card image is preparing. Please tap again in a moment.");
      }
    } catch (e) {
      console.warn("Download error:", e);
    } finally {
      setActiveAction(null);
    }
  };

  // 10. Copy Link Action
  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl);
    setCopiedLink(true);
    showStatus("Challenge link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#0C0B12] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10 shrink-0 bg-[#0C0B12]/80 backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                  <Share2 size={16} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-nohemi flex items-center gap-2">
                    <span>Share Scorecard</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">
                      1080×1920 HD
                    </span>
                  </h3>
                  <p className="text-xs text-white/50">
                    Post to Stories, Feed, or send directly
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* In-App Browser Callout Banner if user opened inside Instagram */}
            {isInstagramInAppBrowser && (
              <div className="mx-4 mt-3 p-3 rounded-2xl bg-[#FD1D1D]/10 border border-[#FD1D1D]/30 flex items-start gap-2.5 text-xs text-white/90">
                <InstagramIcon size={16} className="text-[#FD1D1D] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block font-medium">Instagram Browser Detected:</strong>
                  Tapping "Share Story" saves the card image to your phone so you can post it directly!
                </div>
              </div>
            )}

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              
              {/* Preview Card Bar */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-14 rounded-xl bg-[#14121E] border border-white/15 flex flex-col items-center justify-center shrink-0 shadow-inner">
                    <span className="text-lg font-black text-white font-nohemi leading-none">
                      {overallScore}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 uppercase mt-0.5 font-bold">
                      /100
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white truncate">
                      <QreatoLogo size={14} className="text-white shrink-0" />
                      <span>Qreato Persuasion Audit</span>
                    </div>
                    <p className="text-[11px] text-white/50 truncate mt-0.5">
                      {snippet ? `"${snippet}"` : "Score your copy challenge"}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full font-semibold">
                    Ready to share
                  </span>
                </div>
              </div>

              {/* SECTION 1: INSTAGRAM (Primary Hero Platform) */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-[#833AB4]/15 via-[#FD1D1D]/15 to-[#F56040]/15 border border-[#FD1D1D]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F56040] flex items-center justify-center text-white shadow-sm">
                      <InstagramIcon size={15} />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Instagram Sharing
                    </span>
                  </div>
                  <span className="text-[10px] text-white/60 font-mono">Story • Feed • DM</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Instagram Story Option */}
                  <button
                    type="button"
                    onClick={handleInstagramStory}
                    disabled={activeAction === "instagram-story" || isGeneratingImage}
                    className="flex flex-col items-start text-left p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 hover:border-white/40 text-white transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles size={13} className="text-[#FD1D1D]" />
                        <span>Instagram Stories</span>
                      </span>
                      {activeAction === "instagram-story" ? (
                        <Loader2 size={12} className="animate-spin text-white" />
                      ) : (
                        <ArrowRight size={13} className="text-white/40 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </div>
                    <span className="text-[11px] text-white/70 leading-snug">
                      Saves 1080×1920 card to gallery & copies link sticker
                    </span>
                  </button>

                  {/* Instagram Post / Feed Option */}
                  <button
                    type="button"
                    onClick={handleInstagramPost}
                    disabled={activeAction === "instagram-post" || isGeneratingImage}
                    className="flex flex-col items-start text-left p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 hover:border-white/40 text-white transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <InstagramIcon size={13} className="text-[#833AB4]" />
                        <span>Instagram Post / Feed</span>
                      </span>
                      {activeAction === "instagram-post" ? (
                        <Loader2 size={12} className="animate-spin text-white" />
                      ) : (
                        <ArrowRight size={13} className="text-white/40 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </div>
                    <span className="text-[11px] text-white/70 leading-snug">
                      Saves card & copies formatted challenge caption
                    </span>
                  </button>
                </div>
              </div>

              {/* SECTION 2: OTHER MAJOR PLATFORMS (X, Facebook, Messenger, WhatsApp) */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 px-1">
                  Social &amp; Messaging Apps
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* X / Twitter */}
                  <button
                    type="button"
                    onClick={handleShareX}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all text-white cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-black border border-white/15 flex items-center justify-center text-white mb-1.5 group-hover:scale-105 transition-transform">
                      <XTwitterIcon size={15} />
                    </div>
                    <span className="text-xs font-bold text-white">X (Twitter)</span>
                    <span className="text-[10px] text-white/50 mt-0.5">Post Tweet</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={handleFacebook}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all text-white cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2] mb-1.5 group-hover:scale-105 transition-transform">
                      <FacebookIcon size={17} />
                    </div>
                    <span className="text-xs font-bold text-white">Facebook</span>
                    <span className="text-[10px] text-white/50 mt-0.5">Feed / Story</span>
                  </button>

                  {/* Messenger */}
                  <button
                    type="button"
                    onClick={handleMessenger}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all text-white cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00B2FF]/20 border border-[#00B2FF]/40 flex items-center justify-center text-[#00B2FF] mb-1.5 group-hover:scale-105 transition-transform">
                      <MessengerIcon size={17} />
                    </div>
                    <span className="text-xs font-bold text-white">Messenger</span>
                    <span className="text-[10px] text-white/50 mt-0.5">Direct Chat</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all text-white cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] mb-1.5 group-hover:scale-105 transition-transform">
                      <WhatsAppIcon size={17} />
                    </div>
                    <span className="text-xs font-bold text-white">WhatsApp</span>
                    <span className="text-[10px] text-white/50 mt-0.5">Send Chat</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: SYSTEM UTILITIES (Device Share, Download Image, Copy Link) */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 px-1">
                  Device &amp; Link Options
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Native Device Share Sheet */}
                  <button
                    type="button"
                    onClick={handleNativeDeviceShare}
                    disabled={activeAction === "native"}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all cursor-pointer shadow-sm sm:col-span-1"
                  >
                    {activeAction === "native" ? (
                      <Loader2 size={14} className="animate-spin text-black" />
                    ) : (
                      <Smartphone size={14} />
                    )}
                    <span>More Apps...</span>
                  </button>

                  {/* Download Card PNG */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={activeAction === "download" || isGeneratingImage}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer sm:col-span-1"
                  >
                    {activeAction === "download" ? (
                      <Loader2 size={14} className="animate-spin text-white" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span>Save 1080p Image</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer sm:col-span-1 ${
                      copiedLink
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-white"
                    }`}
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Status Toast inside modal */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3 rounded-xl bg-white/[0.08] border border-white/20 text-center text-xs text-white font-medium shadow-md"
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Footer Notice */}
            <div className="px-5 py-3 border-t border-white/10 bg-[#09080E] text-[11px] text-white/50 text-center flex items-center justify-center gap-1.5">
              <span>Card formatted at 1080×1920 (9:16) for Instagram &amp; Facebook Stories</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
