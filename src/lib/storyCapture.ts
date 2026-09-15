import { toPng } from "html-to-image";
import { copyToClipboard } from "./clipboard";

// Memory cache for rendered score card image files
const storyImageCache = new Map<string, File>();

/**
 * Ensures document fonts and images inside element are fully loaded
 */
export async function ensureAssetsLoaded(container: HTMLElement): Promise<void> {
  if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn("Font loading check failed:", e);
    }
  }

  if (container) {
    const images = Array.from(container.querySelectorAll("img"));
    const pendingImages = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });
    if (pendingImages.length > 0) {
      await Promise.all(pendingImages);
    }
  }
}

/**
 * Captures a fixed 1080x1920 DOM element into a high-DPI PNG File.
 * Single-pass, cached in memory to eliminate lag and prevent duplicate rendering.
 */
export async function captureStoryImage(
  element: HTMLElement | null,
  filename: string,
  cacheKey?: string
): Promise<File | null> {
  if (!element) return null;

  const key = cacheKey || filename;
  if (storyImageCache.has(key)) {
    return storyImageCache.get(key)!;
  }

  try {
    await ensureAssetsLoaded(element);

    const filterOptions = (node: Node) => {
      if (node instanceof HTMLElement && node.dataset.noCapture === "true") {
        return false;
      }
      return true;
    };

    // Single-pass high-resolution capture
    const dataUrl = await toPng(element, {
      width: 1080,
      height: 1920,
      pixelRatio: 1,
      backgroundColor: "#0A0A0A",
      filter: filterOptions,
      cacheBust: false,
    });

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: "image/png" });

    storyImageCache.set(key, file);
    return file;
  } catch (err) {
    console.error("Story card capture error:", err);
    return null;
  }
}

/**
 * Downloads a pre-rendered image file directly to the device gallery / downloads
 * with zero intermediate dialogs.
 */
export function downloadImageFile(file: File | null, fallbackFilename = "qreato-copy-score.png"): boolean {
  if (!file) return false;
  try {
    const objectUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.download = file.name || fallbackFilename;
    downloadLink.href = objectUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    return true;
  } catch (err) {
    console.error("Download image error:", err);
    return false;
  }
}

/**
 * Native OS Share Sheet Execution (Fix #1)
 * 1. Checks if Web Share API supports file sharing -> opens native share sheet with file + URL + text.
 * 2. If file sharing is not supported by the browser -> falls back to navigator.share({ title, text, url }).
 * 3. If Web Share API is completely unsupported -> copies link to clipboard with toast.
 * Never displays a custom modal.
 */
export async function executeNativeShare({
  imageFile,
  shareText,
  shareUrl,
  onShowToast,
}: {
  imageFile: File | null;
  shareText: string;
  shareUrl: string;
  onShowToast: (msg: string) => void;
}): Promise<boolean> {
  const hasShareApi = typeof navigator !== "undefined" && typeof navigator.share === "function";

  // Tier 1: Native Share Sheet WITH file attachment
  if (hasShareApi && imageFile && typeof navigator.canShare === "function") {
    try {
      if (navigator.canShare({ files: [imageFile] })) {
        await navigator.share({
          files: [imageFile],
          title: "Qreato Copy Score Challenge",
          text: `${shareText}\n${shareUrl}`,
        });
        return true;
      }
    } catch (shareErr: any) {
      if (shareErr && (shareErr.name === "AbortError" || shareErr.message?.includes("abort"))) {
        // User closed native share sheet without picking an app
        return false;
      }
      console.warn("Native file share fallback:", shareErr);
    }
  }

  // Tier 2: Native Share Sheet with URL and caption text only
  if (hasShareApi) {
    try {
      await navigator.share({
        title: "Qreato Copy Score Challenge",
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch (shareErr: any) {
      if (shareErr && (shareErr.name === "AbortError" || shareErr.message?.includes("abort"))) {
        return false;
      }
      console.warn("Native text share fallback:", shareErr);
    }
  }

  // Tier 3: Universal Fallback — Copy public link directly to clipboard
  const copied = await copyToClipboard(shareUrl);
  if (copied) {
    onShowToast("Challenge link copied to clipboard!");
  } else {
    onShowToast("Unable to share. Please copy the URL manually.");
  }
  return copied;
}
