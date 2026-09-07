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
      accentColor: "#E5484D", // Muted red accent
    };
  } else if (score <= 74) {
    return {
      tierKey: "MID",
      tierLabel: "PROSPECTIVE COPY",
      accentColor: "#D4A94D", // Amber/Gold accent
    };
  } else {
    return {
      tierKey: "HIGH",
      tierLabel: "ELITE COPY",
      accentColor: "#F0D375", // Bright gold/champagne accent
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
 * Redesigned with a minimal, premium editorial layout (museum plaque / certificate aesthetic).
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
        backgroundColor: "#0A0A0A",
        background: "radial-gradient(ellipse at 50% 40%, #161616 0%, #0A0A0A 70%, #050505 100%)",
        color: "#FFFFFF",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "110px 90px 90px 90px",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Outer Subtle Frame Accent */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          right: "40px",
          bottom: "40px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "32px",
          pointerEvents: "none",
        }}
      />

      {/* TOP HEADER: Small & unobtrusive branding */}
      <div
        style={{
          width: "900px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
          paddingBottom: "40px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Left: Small Logo Mark + Clean Title (No sparkles or decorative icons) */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <QreatoLogo size={40} className="text-white" dotClassName="text-white fill-white" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 700,
                fontSize: "22px",
                letterSpacing: "-0.01em",
                color: "#FFFFFF",
                lineHeight: 1.1,
              }}
            >
              Qreato Copy Engine
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginTop: "3px",
              }}
            >
              PERSUASION AUDIT
            </span>
          </div>
        </div>

        {/* Right: Small, plain, muted-gray URL text (No icon) */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.08em",
          }}
        >
          murgii.vercel.app
        </span>
      </div>

      {/* CENTER CONTENT CONTAINER WITH GENEROUS EDITORIAL SPACING */}
      <div
        style={{
          width: "900px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          padding: "10px 0",
        }}
      >
        {/* EVALUATED COPY — Clean quoted line without container box */}
        {cleanCopy && (
          <div
            style={{
              width: "100%",
              marginBottom: "80px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: "0.25em",
                color: "rgba(255, 255, 255, 0.4)",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              EVALUATED COPY
            </span>
            <p
              style={{
                fontFamily: "Inter, -apple-system, sans-serif",
                fontSize: "28px",
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(255, 255, 255, 0.88)",
                lineHeight: 1.55,
                margin: 0,
                maxWidth: "820px",
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

        {/* HERO SCORE DISPLAY — Score is unmistakably the hero element */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "70px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.3em",
              color: "rgba(255, 255, 255, 0.4)",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            OVERALL PERSUASION SCORE
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              lineHeight: 0.82,
            }}
          >
            {/* Score number dramatically large in Tier Accent Color */}
            <span
              style={{
                fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 900,
                fontSize: "270px",
                letterSpacing: "-0.05em",
                color: config.accentColor,
                lineHeight: 0.82,
              }}
            >
              {overallScore}
            </span>
            {/* /100 notably smaller in muted gray */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: "52px",
                color: "rgba(255, 255, 255, 0.35)",
                marginLeft: "18px",
              }}
            >
              /100
            </span>
          </div>

          {/* Clean Tier Label Pill */}
          <div
            style={{
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "100px",
              padding: "10px 32px",
              marginTop: "32px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: "15px",
                letterSpacing: "0.2em",
                color: "rgba(255, 255, 255, 0.7)",
                textTransform: "uppercase",
              }}
            >
              {config.tierLabel}
            </span>
          </div>
        </div>

        {/* THIN ACCENT RULE (1-2px line in Tier Accent Color) */}
        <div
          style={{
            width: "120px",
            height: "1px",
            backgroundColor: config.accentColor,
            opacity: 0.75,
            marginBottom: "70px",
          }}
        />

        {/* BIGGEST LEVERAGE SECTION */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.25em",
              color: "rgba(255, 255, 255, 0.4)",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            BIGGEST LEVERAGE
          </span>

          {/* Heading in Tier Accent Color */}
          <span
            style={{
              fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 800,
              fontSize: "36px",
              letterSpacing: "0.05em",
              color: config.accentColor,
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {leverageData.dimension}
          </span>

          <p
            style={{
              fontFamily: "Inter, -apple-system, sans-serif",
              fontSize: "22px",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "760px",
            }}
          >
            {leverageData.diagnosis}
          </p>
        </div>
      </div>

      {/* BOTTOM CTA — Clean understated outlined button */}
      <div
        style={{
          width: "900px",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderRadius: "24px",
          padding: "32px 40px",
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
            fontWeight: 800,
            fontSize: "26px",
            letterSpacing: "0.12em",
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
            fontWeight: 400,
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.06em",
            marginTop: "10px",
          }}
        >
          Score your copy at <strong style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}>murgii.vercel.app</strong>
        </span>
      </div>
    </div>
  );
};
