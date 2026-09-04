import React from "react";
import { QreatoLogo } from "./QreatoLogo";

export interface StoryScoreCardProps {
  overallScore: number;
  shareSlug: string;
  userCopy?: string;
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

// Score Tier metadata for dynamic visual styling
export function getScoreTierConfig(score: number) {
  if (score <= 49) {
    return {
      tierKey: "LOW",
      tierLabel: "NEEDS WORK",
      accentColor: "#EF4444", // Crimson Red
      secondaryColor: "#F87171",
      badgeBg: "rgba(127, 29, 29, 0.85)",
      badgeBorder: "rgba(239, 68, 68, 0.6)",
      badgeText: "#FCA5A5",
      radialGlow: "radial-gradient(circle at 50% 30%, rgba(220, 38, 38, 0.35) 0%, rgba(153, 27, 27, 0.15) 50%, rgba(7, 5, 14, 0) 75%)",
      cardBorder: "rgba(239, 68, 68, 0.45)",
      cardBg: "#110912",
      boxBg: "#1D0D14",
      scoreGlow: "drop-shadow(0 0 45px rgba(239, 68, 68, 0.5))",
      bannerText: "NEEDS PSYCHOLOGICAL RE-FRAME",
    };
  } else if (score <= 74) {
    return {
      tierKey: "MID",
      tierLabel: "PROSPECTIVE COPY",
      accentColor: "#F59E0B", // Warm Amber / Gold
      secondaryColor: "#FBBF24",
      badgeBg: "rgba(120, 53, 15, 0.85)",
      badgeBorder: "rgba(245, 158, 11, 0.6)",
      badgeText: "#FDE68A",
      radialGlow: "radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, rgba(7, 5, 14, 0) 75%)",
      cardBorder: "rgba(245, 158, 11, 0.45)",
      cardBg: "#14100B",
      boxBg: "#22190E",
      scoreGlow: "drop-shadow(0 0 45px rgba(245, 158, 11, 0.5))",
      bannerText: "SOLID FOUNDATION · NEEDS URGENCY",
    };
  } else {
    return {
      tierKey: "HIGH",
      tierLabel: "ELITE COPY",
      accentColor: "#10B981", // Celebratory Emerald & Gold
      secondaryColor: "#34D399",
      badgeBg: "rgba(6, 78, 59, 0.85)",
      badgeBorder: "rgba(16, 185, 129, 0.6)",
      badgeText: "#A7F3D0",
      radialGlow: "radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.38) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(7, 5, 14, 0) 75%)",
      cardBorder: "rgba(16, 185, 129, 0.5)",
      cardBg: "#081310",
      boxBg: "#0F211B",
      scoreGlow: "drop-shadow(0 0 55px rgba(16, 185, 129, 0.6))",
      bannerText: "HIGH-CONVERSION ARCHITECTURE",
    };
  }
}

// Leverage Diagnosis helper
function getLeverageData(
  overallScore: number,
  customLeverage?: string,
  customDiagnosis?: string,
  dimensions?: { [key: string]: number | undefined }
) {
  if (customLeverage && customDiagnosis) {
    return { dimension: customLeverage.toUpperCase(), diagnosis: customDiagnosis };
  }

  if (dimensions) {
    const entries = Object.entries(dimensions).filter(([_, val]) => typeof val === "number") as [string, number][];
    if (entries.length > 0) {
      entries.sort((a, b) => a[1] - b[1]);
      const lowestKey = entries[0][0].toLowerCase();
      const map: Record<string, { name: string; diagnosis: string }> = {
        persuasion: { name: "PERSUASION", diagnosis: "Lacks emotional friction and risk-reversal to compel commitment." },
        attention: { name: "HOOK RETENTION", diagnosis: "The opening hook fails to interrupt attention in 3 seconds." },
        clarity: { name: "VALUE CLARITY", diagnosis: "The core proposition is obscured by complex phrasing." },
        desire: { name: "DESIRE BUILDING", diagnosis: "Lists functional features rather than triggering visceral desire." },
        action: { name: "ACTION URGENCY", diagnosis: "The closing call-to-action lacks urgent conviction." },
      };
      if (map[lowestKey]) {
        return {
          dimension: customLeverage ? customLeverage.toUpperCase() : map[lowestKey].name,
          diagnosis: customDiagnosis || map[lowestKey].diagnosis,
        };
      }
    }
  }

  if (overallScore <= 49) {
    return {
      dimension: customLeverage?.toUpperCase() || "PERSUASION",
      diagnosis: customDiagnosis || "Lacks emotional friction and risk-reversal to compel immediate commitment.",
    };
  } else if (overallScore <= 74) {
    return {
      dimension: customLeverage?.toUpperCase() || "HOOK RETENTION",
      diagnosis: customDiagnosis || "Strong narrative foundation, but the opening needs sharper pattern interruption.",
    };
  } else {
    return {
      dimension: customLeverage?.toUpperCase() || "CONVERSION VELOCITY",
      diagnosis: customDiagnosis || "Elite copy architecture with high velocity conversion triggers across all touchpoints.",
    };
  }
}

function sanitizeCopy(text?: string) {
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
}

/**
 * StoryScoreCard Component
 * Fixed Pixel Dimensions: Exactly 1080px width × 1920px height (9:16 aspect ratio).
 * Designed specifically for 100% reliable canvas export and direct Instagram Story sharing.
 */
export const StoryScoreCard: React.FC<StoryScoreCardProps> = ({
  overallScore,
  shareSlug,
  userCopy,
  biggestLeverage,
  diagnosis,
  dimensions,
}) => {
  const config = getScoreTierConfig(overallScore);
  const leverageData = getLeverageData(overallScore, biggestLeverage, diagnosis, dimensions);
  const cleanCopy = sanitizeCopy(userCopy);

  return (
    <div
      style={{
        width: "1080px",
        height: "1920px",
        backgroundColor: "#07050E",
        color: "#FFFFFF",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "80px 60px 70px 60px",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Dynamic Radial Glow according to Score Tier */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1080px",
          height: "1920px",
          background: config.radialGlow,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Outer Decorative Subtle Frame Accent */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          right: "30px",
          bottom: "30px",
          border: `1px solid ${config.cardBorder}`,
          borderRadius: "48px",
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0.6,
        }}
      />

      {/* TOP HEADER: Qreato Branding */}
      <div
        style={{
          width: "960px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
          paddingBottom: "30px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Left: Brand Mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <QreatoLogo size={68} className="text-white" dotClassName="text-white fill-white" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 800,
                fontSize: "30px",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                lineHeight: 1.1,
              }}
            >
              Qreato Copy Engine
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.5)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              PERSUASION AUDIT
            </span>
          </div>
        </div>

        {/* Right: URL pill */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "100px",
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: config.accentColor,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "20px",
              color: "#FFFFFF",
              letterSpacing: "0.05em",
            }}
          >
            murgii.vercel.app
          </span>
        </div>
      </div>

      {/* CENTER MAIN SCORE CARD FRAME */}
      <div
        style={{
          width: "960px",
          backgroundColor: config.cardBg,
          border: `2px solid ${config.cardBorder}`,
          borderRadius: "44px",
          padding: "54px 50px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 30px 90px rgba(0, 0, 0, 0.95)",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Rating Subtitle */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: "20px",
            letterSpacing: "0.3em",
            color: "rgba(255, 255, 255, 0.45)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          OVERALL PERSUASION RATING
        </span>

        {/* Big Dominant Score Display */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", filter: config.scoreGlow, margin: "10px 0 20px 0" }}>
          <span
            style={{
              fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 900,
              fontSize: "190px",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: "#FFFFFF",
            }}
          >
            {overallScore}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: "64px",
              color: "rgba(255, 255, 255, 0.35)",
              marginLeft: "12px",
            }}
          >
            /100
          </span>
        </div>

        {/* Tier Badge Pill */}
        <div
          style={{
            backgroundColor: config.badgeBg,
            border: `1.5px solid ${config.badgeBorder}`,
            borderRadius: "100px",
            padding: "12px 40px",
            marginBottom: "36px",
            display: "inline-block",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              fontSize: "22px",
              letterSpacing: "0.2em",
              color: config.badgeText,
              textTransform: "uppercase",
            }}
          >
            {config.tierLabel}
          </span>
        </div>

        {/* Evaluated Copy Snippet (if userCopy present) */}
        {cleanCopy && (
          <div
            style={{
              width: "100%",
              backgroundColor: config.boxBg,
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: "28px",
              padding: "28px 32px",
              marginBottom: "36px",
              textAlign: "left",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: "18px",
                  letterSpacing: "0.22em",
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                }}
              >
                EVALUATED COPY
              </span>
            </div>
            <p
              style={{
                fontFamily: "Inter, -apple-system, sans-serif",
                fontSize: "26px",
                fontStyle: "italic",
                color: "rgba(255, 255, 255, 0.92)",
                lineHeight: 1.5,
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              "{cleanCopy}"
            </p>
          </div>
        )}

        {/* Biggest Leverage Dimension + Diagnosis */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: "18px",
              letterSpacing: "0.25em",
              color: "rgba(255, 255, 255, 0.45)",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            BIGGEST LEVERAGE
          </span>
          <span
            style={{
              fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 800,
              fontSize: "34px",
              letterSpacing: "0.08em",
              color: "#FFFFFF",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {leverageData.dimension}
          </span>
          <p
            style={{
              fontFamily: "Inter, -apple-system, sans-serif",
              fontSize: "24px",
              color: "rgba(255, 255, 255, 0.75)",
              lineHeight: 1.5,
              margin: 0,
              maxWidth: "800px",
            }}
          >
            {leverageData.diagnosis}
          </p>
        </div>
      </div>

      {/* BOTTOM CALLOUT CTA BANNER */}
      <div
        style={{
          width: "960px",
          backgroundColor: "rgba(255, 255, 255, 0.07)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "32px",
          padding: "26px 40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 900,
            fontSize: "30px",
            letterSpacing: "0.18em",
            color: "#FFFFFF",
            textTransform: "uppercase",
            lineHeight: 1.2,
          }}
        >
          I GOT {overallScore}. CAN YOU BEAT ME?
        </span>

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.55)",
            letterSpacing: "0.08em",
            marginTop: "8px",
          }}
        >
          Score your copy at <strong style={{ color: "#FFFFFF" }}>murgii.vercel.app</strong>
        </span>
      </div>
    </div>
  );
};
