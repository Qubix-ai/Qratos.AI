import { ChallengeResult } from "./supabase";

export type DimensionName = "Attention" | "Clarity" | "Desire" | "Persuasion" | "Action";

export interface StrongestElementInfo {
  dimension: DimensionName;
  dimensionUpper: string;
  score: number;
  line: string;
}

/**
 * Computes whichever of the 5 scored dimensions (Attention, Clarity, Desire, Persuasion, Action)
 * has the highest subscore for that submission, and returns a short, positive statement.
 * If all subscores are low, it still identifies the relatively-highest dimension framed positively
 * without fabricating unsupported claims.
 */
export function computeStrongestElement(
  dimensions?: {
    attention?: number;
    clarity?: number;
    desire?: number;
    persuasion?: number;
    action?: number;
  },
  customPraiseLine?: string
): StrongestElementInfo {
  const attention = typeof dimensions?.attention === "number" ? dimensions.attention : 0;
  const clarity = typeof dimensions?.clarity === "number" ? dimensions.clarity : 0;
  const desire = typeof dimensions?.desire === "number" ? dimensions.desire : 0;
  const persuasion = typeof dimensions?.persuasion === "number" ? dimensions.persuasion : 0;
  const action = typeof dimensions?.action === "number" ? dimensions.action : 0;

  const candidates: { dimension: DimensionName; score: number }[] = [
    { dimension: "Attention", score: attention },
    { dimension: "Clarity", score: clarity },
    { dimension: "Desire", score: desire },
    { dimension: "Persuasion", score: persuasion },
    { dimension: "Action", score: action },
  ];

  // Pick the dimension with the highest subscore (stable order for ties)
  candidates.sort((a, b) => b.score - a.score);
  const highest = candidates[0];

  const isHighTier = highest.score >= 15;
  const isMidTier = highest.score >= 10 && highest.score < 15;

  let positiveLine = "";
  if (highest.dimension === "Attention") {
    if (isHighTier) {
      positiveLine = "Your clearest strength: Attention — Magnetic hook with immediate curiosity and pattern interruption.";
    } else if (isMidTier) {
      positiveLine = "Your clearest strength: Attention — Captures early focus and draws the reader into the opening.";
    } else {
      positiveLine = "Your clearest strength: Attention — The opening concept delivers the most initial intrigue.";
    }
  } else if (highest.dimension === "Clarity") {
    if (isHighTier) {
      positiveLine = "Your clearest strength: Clarity — Sharp, effortless value proposition with seamless reading flow.";
    } else if (isMidTier) {
      positiveLine = "Your clearest strength: Clarity — Direct, easy-to-grasp message and clean value delivery.";
    } else {
      positiveLine = "Your clearest strength: Clarity — The core point and intent are immediately understandable.";
    }
  } else if (highest.dimension === "Desire") {
    if (isHighTier) {
      positiveLine = "Your clearest strength: Desire — Vivid emotional pull with irresistible benefit transformation.";
    } else if (isMidTier) {
      positiveLine = "Your clearest strength: Desire — Highlights tangible outcomes that resonate with the reader.";
    } else {
      positiveLine = "Your clearest strength: Desire — Frames an appealing end benefit for the reader.";
    }
  } else if (highest.dimension === "Persuasion") {
    if (isHighTier) {
      positiveLine = "Your clearest strength: Persuasion — High-conviction argument backed by credible, believable framing.";
    } else if (isMidTier) {
      positiveLine = "Your clearest strength: Persuasion — Strong logical flow that builds natural trust and buy-in.";
    } else {
      positiveLine = "Your clearest strength: Persuasion — Establishes the most credible rationale to believe.";
    }
  } else {
    // Action
    if (isHighTier) {
      positiveLine = "Your clearest strength: Action — Decisive call-to-action with frictionless, urgent momentum.";
    } else if (isMidTier) {
      positiveLine = "Your clearest strength: Action — Clear and motivating next step that spurs immediate response.";
    } else {
      positiveLine = "Your clearest strength: Action — The desired next step is straightforward and direct.";
    }
  }

  // If a valid, non-critical custom line was returned for this dimension, format it nicely
  if (customPraiseLine && typeof customPraiseLine === "string") {
    const trimmed = customPraiseLine.trim();
    if (
      trimmed.length > 10 &&
      !trimmed.toLowerCase().includes("fail") &&
      !trimmed.toLowerCase().includes("lack") &&
      !trimmed.toLowerCase().includes("weak") &&
      !trimmed.toLowerCase().includes("need")
    ) {
      positiveLine = trimmed.startsWith("Your clearest strength:")
        ? trimmed
        : `Your clearest strength: ${highest.dimension} — ${trimmed.replace(/^[^:]+:\s*/, "")}`;
    }
  }

  return {
    dimension: highest.dimension,
    dimensionUpper: highest.dimension.toUpperCase(),
    score: highest.score,
    line: positiveLine,
  };
}

export interface ParsedScoreResult {
  cleanText: string;
  challengeResult: ChallengeResult | null;
}

/**
 * Strips raw <!--SCORE_DATA ... --> syntax completely from any text
 * so that users never see internal score JSON blocks in the chat UI.
 */
export function stripScoreDataTags(rawText: string): string {
  if (!rawText) return "";
  return rawText
    .replace(/<!--\s*SCORE_DATA[\s\S]*?(?:SCORE_DATA\s*-->|-->)\s*/gi, "")
    .replace(/<!--\s*SCORE_DATA[\s\S]*$/gi, "")
    .replace(/SCORE_DATA-->/gi, "")
    .trim();
}

/**
 * Parses embedded <!--SCORE_DATA {...} SCORE_DATA--> or <!--SCORE_DATA {...} -->
 * programmatically into structured ChallengeResult data for the Score Card UI,
 * and returns clean visible text with the raw data block completely removed.
 */
export function parseAndExtractScoreData(rawText: string, fallbackCopy?: string): ParsedScoreResult {
  if (!rawText) {
    return { cleanText: "", challengeResult: null };
  }

  let challengeResult: ChallengeResult | null = null;

  // Flexible regex to locate the SCORE_DATA comment block
  const scoreDataMatch = rawText.match(/<!--\s*SCORE_DATA\s*([\s\S]*?)(?:SCORE_DATA\s*-->|-->)/i);

  if (scoreDataMatch && scoreDataMatch[1]) {
    try {
      const blockContent = scoreDataMatch[1].trim();
      const firstBrace = blockContent.indexOf("{");
      const lastBrace = blockContent.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonStr = blockContent.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonStr);

        const attention = Number(parsed.attention_score) || 0;
        const clarity = Number(parsed.clarity_score) || 0;
        const desire = Number(parsed.desire_score) || 0;
        const persuasion = Number(parsed.persuasion_score) || 0;
        const action = Number(parsed.action_score) || 0;
        const overall = 
          typeof parsed.overall_score === "number" 
            ? parsed.overall_score 
            : (attention + clarity + desire + persuasion + action);

        // Generate an 8-character hex slug for shareable challenge link
        const chars = "abcdef0123456789";
        let shareSlug = "";
        for (let i = 0; i < 8; i++) {
          shareSlug += chars[Math.floor(Math.random() * chars.length)];
        }

        const extractedCopy = 
          (typeof parsed.extracted_copy === "string" && parsed.extracted_copy.trim()) ||
          fallbackCopy ||
          "";

        const dimensions = {
          attention,
          clarity,
          desire,
          persuasion,
          action,
        };

        const strongestInfo = computeStrongestElement(dimensions, parsed.strongest_element);

        challengeResult = {
          overallScore: overall,
          attention_score: attention,
          clarity_score: clarity,
          desire_score: desire,
          persuasion_score: persuasion,
          action_score: action,
          strongest_dimension: strongestInfo.dimensionUpper,
          strongest_element: strongestInfo.line,
          strongestElement: strongestInfo.line,
          biggest_leverage: parsed.biggest_leverage || "PERSUASION",
          diagnosis: parsed.diagnosis || "",
          shareSlug,
          userCopy: extractedCopy,
          copy: extractedCopy,
          dimensions,
        };
      }
    } catch (err) {
      console.warn("[ScoreData] Failed to parse internal SCORE_DATA JSON block:", err);
    }
  }

  const cleanText = stripScoreDataTags(rawText);

  return { cleanText, challengeResult };
}
