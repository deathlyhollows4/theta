import { env } from '../config/env.js';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const buildPrompt = ({ code, problemDescription }) => `You are an expert DSA interviewer.
Analyze this code:
${code}

Problem:
${problemDescription}

Return STRICT JSON with keys:
- timeComplexity
- spaceComplexity
- mistakes (string array)
- betterApproach
- skillLevel (Beginner|Intermediate|Advanced)
- improvementSuggestion
- mistakeTags (string array, use labels like edge case, brute force, optimization, complexity, data structure)

Keep feedback concise, practical, and human-like.`;

const safeJsonParse = (rawText) => {
  try {
    return JSON.parse(rawText);
  } catch {
    return null;
  }
};

const fallbackFeedback = {
  timeComplexity: 'Unable to determine',
  spaceComplexity: 'Unable to determine',
  mistakes: ['AI analysis unavailable for this submission.'],
  betterApproach: 'Retry with AI service enabled.',
  skillLevel: 'Beginner',
  improvementSuggestion: 'Focus on dry-running your code against edge cases before submitting.',
  mistakeTags: ['analysis unavailable']
};

export const generateAIFeedback = async ({ code, problemDescription }) => {
  if (!env.OPENAI_API_KEY) {
    return {
      ...fallbackFeedback,
      mistakes: ['OPENAI_API_KEY is not configured.']
    };
  }

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You evaluate DSA solutions with accurate, concise, and encouraging feedback.'
          },
          {
            role: 'user',
            content: buildPrompt({ code, problemDescription })
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content || '{}';
    const parsed = safeJsonParse(raw);

    if (!parsed) {
      return fallbackFeedback;
    }

    return {
      timeComplexity: parsed.timeComplexity || fallbackFeedback.timeComplexity,
      spaceComplexity: parsed.spaceComplexity || fallbackFeedback.spaceComplexity,
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : fallbackFeedback.mistakes,
      betterApproach: parsed.betterApproach || fallbackFeedback.betterApproach,
      skillLevel: ['Beginner', 'Intermediate', 'Advanced'].includes(parsed.skillLevel)
        ? parsed.skillLevel
        : 'Beginner',
      improvementSuggestion: parsed.improvementSuggestion || fallbackFeedback.improvementSuggestion,
      mistakeTags: Array.isArray(parsed.mistakeTags) ? parsed.mistakeTags : fallbackFeedback.mistakeTags
    };
  } catch (error) {
    return {
      ...fallbackFeedback,
      mistakes: [`AI analysis failed: ${error.message}`]
    };
  }
};
