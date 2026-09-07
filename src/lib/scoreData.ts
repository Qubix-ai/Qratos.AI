import { ChallengeResult } from "./supabase";

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
    // Match standard comment-wrapped score data block: <!--SCORE_DATA ... (SCORE_DATA-->|-->)
    .replace(/<!--\s*SCORE_DATA[\s\S]*?(?:SCORE_DATA\s*-->|-->)\s*/gi, "")
    // Safety: unclosed block at end of stream or string
    .replace(/<!--\s*SCORE_DATA[\s\S]*$/gi, "")
    // Safety: stray trailing closing tags
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

        challengeResult = {
          overallScore: overall,
          attention_score: attention,
          clarity_score: clarity,
          desire_score: desire,
          persuasion_score: persuasion,
          action_score: action,
          biggest_leverage: parsed.biggest_leverage || "PERSUASION",
          diagnosis: parsed.diagnosis || "",
          shareSlug,
          userCopy: extractedCopy,
          copy: extractedCopy,
          dimensions: {
            attention,
            clarity,
            desire,
            persuasion,
            action,
          },
        };
      }
    } catch (err) {
      console.warn("[ScoreData] Failed to parse internal SCORE_DATA JSON block:", err);
    }
  }

  const cleanText = stripScoreDataTags(rawText);

  return { cleanText, challengeResult };
}
