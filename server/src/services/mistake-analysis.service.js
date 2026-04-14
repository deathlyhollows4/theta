const CATEGORY_RULES = {
  edge_case: ['edge case', 'corner case', 'null', 'empty array', 'single element', 'boundary'],
  brute_force: ['brute force', 'nested loop', 'o(n^2)', 'o(n3)', 'inefficient'],
  optimization: ['optimiz', 'improve complexity', 'faster approach', 'better approach'],
  complexity: ['time complexity', 'space complexity', 'big-o', 'complexity'],
  data_structure: ['hashmap', 'set', 'stack', 'queue', 'heap', 'tree', 'graph', 'prefix sum'],
  logic_bug: ['logic error', 'wrong condition', 'off by one', 'incorrect', 'bug']
};

const normalizeText = (text) => (text || '').toLowerCase();

const includesKeyword = (text, keyword) => text.includes(keyword.toLowerCase());

export const analyzeMistakes = (aiFeedback = {}) => {
  const combinedText = [
    ...(Array.isArray(aiFeedback.mistakes) ? aiFeedback.mistakes : []),
    aiFeedback.betterApproach,
    aiFeedback.improvementSuggestion,
    ...(Array.isArray(aiFeedback.mistakeTags) ? aiFeedback.mistakeTags : [])
  ]
    .filter(Boolean)
    .join(' | ');

  const source = normalizeText(combinedText);

  const matchedCategories = Object.entries(CATEGORY_RULES)
    .map(([category, keywords]) => {
      const matches = keywords.filter((keyword) => includesKeyword(source, keyword));
      return {
        category,
        score: matches.length,
        matchedKeywords: matches
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const primaryCategory = matchedCategories[0]?.category || 'uncategorized';

  return {
    primaryCategory,
    categories: matchedCategories,
    extractedFromText: combinedText
  };
};
