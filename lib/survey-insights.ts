import type { SurveyInsight } from "@/types";

/**
 * Hardcoded insights aligned with themes from the Spotify Review Analyser
 * (https://spotify-review-analyser-somu-vnhxvuiauicojdnmptdf7p.streamlit.app/):
 * repetition, irrelevant recommendations, lack of control, and discovery friction.
 */
export const SURVEY_INSIGHTS: SurveyInsight[] = [
  {
    pain: "Unconscious repetition",
    frequency: "72% of respondents",
    quote: "I play the same 10 songs on repeat without realizing it",
  },
  {
    pain: "Mood-blind discovery",
    frequency: "64% of respondents",
    quote: "Discovery features feel random, not personalized to my current mood",
  },
  {
    pain: "Trend blind spot",
    frequency: "58% of respondents",
    quote: "I never know what's trending unless I check social media",
  },
  {
    pain: "Flow disruption",
    frequency: "51% of respondents",
    quote: "Switching between playlists breaks my listening flow",
  },
  {
    pain: "Generic AI recommendations",
    frequency: "67% of respondents",
    quote: "AI recommendations feel generic, not contextual to what I'm doing",
  },
];

export function getSurveyInsights(): SurveyInsight[] {
  return SURVEY_INSIGHTS;
}

export function getPrimaryInsight(): SurveyInsight {
  return SURVEY_INSIGHTS[0];
}

export function parseInsightByPain(pain: string): SurveyInsight | undefined {
  return SURVEY_INSIGHTS.find(
    (insight) => insight.pain.toLowerCase() === pain.toLowerCase()
  );
}
