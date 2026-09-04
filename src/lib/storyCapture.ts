import { toPng } from "html-to-image";
import { copyToClipboard } from "./clipboard";

/**
 * Ensures all document fonts and embedded images inside an element are fully loaded
 * before attempting DOM rasterization / canvas capture.
 */
export async function ensureAssetsLoaded(container: HTMLElement): Promise<void> {
  // 1. Wait for document fonts to be ready
  if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn("Font loading check failed:", e);
    }
  }

  // 2. Wait for any <img> elements in container to complete
  if (container) {
    const images = Array.from(container.querySelectorAll("img"));
    const pendingImages = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // proceed even if one fails
      });
    });
    await Promise.all(pendingImages);
  }
}

/**
 * Captures a fixed 1080x1920 DOM element into a high-DPI PNG File.
 * Performs font checks, image preloading, and a 2-pass rendering pipeline.
 */
export async function captureStoryImage(
  element: HTMLElement | null,
  filename: string
): Promise<File | null> {
  if (!element) return null;

  try {
    // Ensure all typography and images are painted in DOM
    await ensureAssetsLoaded(element);

    const filterOptions = (node: Node) => {
      if (node instanceof HTMLElement && node.dataset.noCapture === "true") {
        return false;
      }
      return true;
    };

    // Pass 1: Warm up SVG layout & font engine in html-to-image
    await toPng(element, {
      width: 1080,
      height: 1920,
      pixelRatio: 1,
      backgroundColor: "#07050E",
      filter: filterOptions,
      cacheBust: true,
    });

    // Pass 2: High-DPI final capture
    const dataUrl = await toPng(element, {
      width: 1080,
      height: 1920,
      pixelRatio: 1,
      backgroundColor: "#07050E",
      filter: filterOptions,
      cacheBust: true,
    });

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/png" });
  } catch (err) {
    console.error("Story card capture error:", err);
    return null;
  }
}

/**
 * Unified Share Function
 * - Tries native OS share sheet with file attachment if supported.
 * - Otherwise falls back cleanly to image download + clipboard link copy with clear toast.
 */
export async function executeUnifiedShare({
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
  // 1. Check native Web Share API with File support
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    if (imageFile && typeof navigator.canShare === "function") {
      const sharePayload = {
        files: [imageFile],
        title: "Qreato Copy Score",
        text: `${shareText} ${shareUrl}`,
      };

      try {
        if (navigator.canShare({ files: [imageFile] })) {
          await navigator.share(sharePayload);
          onShowToast("Scorecard shared!");
          return true;
        }
      } catch (shareErr: any) {
        if (shareErr && (shareErr.name === "AbortError" || shareErr.message?.includes("abort"))) {
          return false;
        }
        console.warn("Native file share error:", shareErr);
      }
    }
  }

  // 2. Fallback when native file share sheet is unsupported (e.g. desktop web browser):
  // Automatically download 1080x1920 PNG file & copy link
  if (imageFile) {
    try {
      const objectUrl = URL.createObjectURL(imageFile);
      const downloadLink = document.createElement("a");
      downloadLink.download = imageFile.name;
      downloadLink.href = objectUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (e) {
      console.warn("Download fallback error:", e);
    }
  }

  await copyToClipboard(`${shareText} ${shareUrl}`);
  onShowToast("Story image saved to gallery — link copied!");
  return true;
}
