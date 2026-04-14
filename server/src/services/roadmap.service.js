import { env } from '../config/env.js';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const buildRoadmapPrompt = ({ weakTopics, mistakeCategories, currentSkillLevel }) => `Create a practical 7-day DSA roadmap.

User profile:
- Current skill level: ${currentSkillLevel}
- Weak topics: ${weakTopics.join(', ') || 'Not enough data'}
- Frequent mistake categories: ${mistakeCategories.join(', ') || 'Not enough data'}

Return STRICT JSON:
{
  "goal": "...",
  "days": [
    {"day": 1, "focus": "...", "tasks": ["..."], "practiceCount": 3},
    ... up to day 7
  ],
  "tips": ["..."]
}

Keep it realistic and human-friendly.`;

const fallbackRoadmap = ({ weakTopics, mistakeCategories }) => ({
  goal: 'Build consistency in problem solving and reduce repeated mistakes.',
  days: [
    {
      day: 1,
      focus: weakTopics[0] || 'Arrays & Hashing',
      tasks: ['Review core patterns', 'Solve 3 easy problems', 'Write edge cases manually'],
      practiceCount: 3
    },
    {
      day: 2,
      focus: weakTopics[1] || 'Two Pointers / Sliding Window',
      tasks: ['Practice dry-runs', 'Solve 2 easy + 1 medium', 'Analyze failed submissions'],
      practiceCount: 3
    },
    {
      day: 3,
      focus: 'Complexity optimization',
      tasks: ['Refactor brute-force attempts', 'Compare O(n^2) vs O(n) approaches', 'Solve 2 medium'],
      practiceCount: 2
    },
    {
      day: 4,
      focus: weakTopics[2] || 'Dynamic Programming basics',
      tasks: ['Practice state definition', 'Solve 2 DP easy/medium', 'Document recurrence relation'],
      practiceCount: 2
    },
    {
      day: 5,
      focus: 'Mock interview set',
      tasks: ['Solve 3 timed problems', 'Explain approach out loud', 'Track mistakes'],
      practiceCount: 3
    },
    {
      day: 6,
      focus: 'Mistake repair day',
      tasks: [`Revisit ${mistakeCategories[0] || 'edge_case'} errors`, 'Fix old wrong submissions'],
      practiceCount: 2
    },
    {
      day: 7,
      focus: 'Revision and reflection',
      tasks: ['Re-solve 3 previously failed problems', 'Summarize learnings', 'Plan next week'],
      practiceCount: 3
    }
  ],
  tips: ['Consistency beats intensity.', 'Always test edge cases before submit.', 'Track why you got a problem wrong.']
});

export const generateRoadmap = async ({ weakTopics, mistakeCategories, currentSkillLevel }) => {
  if (!env.OPENAI_API_KEY) {
    return fallbackRoadmap({ weakTopics, mistakeCategories });
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
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are a DSA coach creating concise, personalized weekly practice roadmaps.'
          },
          {
            role: 'user',
            content: buildRoadmapPrompt({ weakTopics, mistakeCategories, currentSkillLevel })
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(text);

    if (!parsed.goal || !Array.isArray(parsed.days)) {
      return fallbackRoadmap({ weakTopics, mistakeCategories });
    }

    return {
      goal: parsed.goal,
      days: parsed.days.slice(0, 7),
      tips: Array.isArray(parsed.tips) ? parsed.tips : []
    };
  } catch {
    return fallbackRoadmap({ weakTopics, mistakeCategories });
  }
};
