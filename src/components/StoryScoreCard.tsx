import React from "react";
import { QreatoLogo } from "./QreatoLogo";
import { computeStrongestElement } from "../lib/scoreData";

export interface StoryScoreCardProps {
  overallScore: number;
  shareSlug?: string;
  userCopy?: string;
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

// Score Tier metadata for dynamic accent color styling
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
 * Redesigned for a clean, minimal, premium look:
 * - Top-left shows ONLY the Qreato logo mark — nothing else.
 * - Centerpiece is the score number itself (no label above it, no status pill under it).
 * - Preserves the "Evaluated Copy" quoted excerpt.
 * - Negative "Biggest Leverage" diagnosis completely removed from the card.
 * - "Strongest Element" callout computed from the highest subscore among the 5 dimensions.
 * - Bottom of card shows ONLY "I GOT [score]. CAN YOU BEAT ME?" perfectly centered, with no logo or wordmark.
 */
export const StoryScoreCard: React.FC<StoryScoreCardProps> = ({
  overallScore,
  userCopy,
  strongestElement,
  dimensions,
}) => {
  const config = getScoreTierConfig(overallScore);
  const cleanCopy = sanitizeCopy(userCopy);

  // Computed from actual 5 subscores to guarantee authenticity
  const strongestInfo = computeStrongestElement(dimensions, strongestElement);

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
        padding: "100px 90px 90px 90px",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Outer Subtle Geometric Frame */}
      <div
        style={{
          position: "absolute",
          top: "36px",
          left: "36px",
          right: "36px",
          bottom: "36px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "32px",
          pointerEvents: "none",
        }}
      />

      {/* TOP HEADER: Top-left shows ONLY the Qreato logo mark — nothing else */}
      <div
        style={{
          width: "900px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          zIndex: 10,
          paddingBottom: "36px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <QreatoLogo size={36} className="text-white" dotClassName="text-white fill-white" />
      </div>

      {/* CENTER CORE: Evaluated Copy, Score Centerpiece, & Strongest Element */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          flex: 1,
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        {/* EVALUATED COPY — Quoted Excerpt */}
        {cleanCopy && (
          <div
            style={{
              width: "100%",
              marginBottom: "60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.25em",
                color: "rgba(255, 255, 255, 0.4)",
                textTransform: "uppercase",
                marginBottom: "18px",
              }}
            >
              EVALUATED COPY
            </span>
            <p
              style={{
                fontFamily: "Inter, -apple-system, sans-serif",
                fontSize: "27px",
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

        {/* HERO SCORE CENTERPIECE: Pure number centerpiece without label or status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            lineHeight: 0.82,
            marginBottom: "56px",
          }}
        >
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

        {/* THIN ACCENT RULE */}
        <div
          style={{
            width: "120px",
            height: "1px",
            backgroundColor: config.accentColor,
            opacity: 0.75,
            marginBottom: "56px",
          }}
        />

        {/* STRONGEST ELEMENT SECTION */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
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
            STRONGEST ELEMENT
          </span>

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
            {strongestInfo.dimensionUpper}
          </span>

          <p
            style={{
              fontFamily: "Inter, -apple-system, sans-serif",
              fontSize: "22px",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "760px",
            }}
          >
            {strongestInfo.line}
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION: Only "I GOT [score]. CAN YOU BEAT ME?" perfectly centered, no logo, no wordmark */}
      <div
        style={{
          width: "900px",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderRadius: "24px",
          padding: "36px 40px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 800,
            fontSize: "28px",
            letterSpacing: "0.12em",
            color: "#FFFFFF",
            textTransform: "uppercase",
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          I GOT {overallScore}. CAN YOU BEAT ME?
        </span>
      </div>
    </div>
  );
};
