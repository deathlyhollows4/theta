export const problemsSeed = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    topic: 'Array',
    difficulty: 'Easy',
    functionName: 'twoSum',
    description:
      'Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target.',
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // your code here\n}\nmodule.exports = twoSum;'
    },
    testCases: [
      { input: '[[2,7,11,15],9]', expectedOutput: '[0,1]', isSample: true },
      { input: '[[3,2,4],6]', expectedOutput: '[1,2]' },
      { input: '[[3,3],6]', expectedOutput: '[0,1]' }
    ]
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    topic: 'Stack',
    difficulty: 'Easy',
    functionName: 'isValid',
    description: 'Given a string s containing just the characters (), {}, [] determine if the input string is valid.',
    starterCode: {
      javascript: 'function isValid(s) {\n  // your code here\n}\nmodule.exports = isValid;'
    },
    testCases: [
      { input: '["()[]{}"]', expectedOutput: 'true', isSample: true },
      { input: '["(]"]', expectedOutput: 'false' },
      { input: '["([{}])"]', expectedOutput: 'true' }
    ]
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-sell-stock',
    topic: 'Array',
    difficulty: 'Easy',
    functionName: 'maxProfit',
    description: 'Find the maximum profit from a single buy and sell of stock prices array.',
    starterCode: {
      javascript: 'function maxProfit(prices) {\n  // your code here\n}\nmodule.exports = maxProfit;'
    },
    testCases: [
      { input: '[[7,1,5,3,6,4]]', expectedOutput: '5', isSample: true },
      { input: '[[7,6,4,3,1]]', expectedOutput: '0' },
      { input: '[[2,4,1]]', expectedOutput: '2' }
    ]
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    topic: 'Binary Search',
    difficulty: 'Easy',
    functionName: 'search',
    description: 'Given a sorted array nums and a target, return its index or -1.',
    starterCode: {
      javascript: 'function search(nums, target) {\n  // your code here\n}\nmodule.exports = search;'
    },
    testCases: [
      { input: '[[-1,0,3,5,9,12],9]', expectedOutput: '4', isSample: true },
      { input: '[[-1,0,3,5,9,12],2]', expectedOutput: '-1' },
      { input: '[[5],5]', expectedOutput: '0' }
    ]
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    topic: 'Array',
    difficulty: 'Medium',
    functionName: 'productExceptSelf',
    description: 'Return an array answer where answer[i] is the product of all elements except nums[i].',
    starterCode: {
      javascript: 'function productExceptSelf(nums) {\n  // your code here\n}\nmodule.exports = productExceptSelf;'
    },
    testCases: [
      { input: '[[1,2,3,4]]', expectedOutput: '[24,12,8,6]', isSample: true },
      { input: '[[-1,1,0,-3,3]]', expectedOutput: '[0,0,9,0,0]' },
      { input: '[[2,3,4,5]]', expectedOutput: '[60,40,30,24]' }
    ]
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    topic: 'Sliding Window',
    difficulty: 'Medium',
    functionName: 'lengthOfLongestSubstring',
    description: 'Return the length of the longest substring without repeating characters.',
    starterCode: {
      javascript:
        'function lengthOfLongestSubstring(s) {\n  // your code here\n}\nmodule.exports = lengthOfLongestSubstring;'
    },
    testCases: [
      { input: '["abcabcbb"]', expectedOutput: '3', isSample: true },
      { input: '["bbbbb"]', expectedOutput: '1' },
      { input: '["pwwkew"]', expectedOutput: '3' }
    ]
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    topic: 'Intervals',
    difficulty: 'Medium',
    functionName: 'merge',
    description: 'Merge all overlapping intervals.',
    starterCode: {
      javascript: 'function merge(intervals) {\n  // your code here\n}\nmodule.exports = merge;'
    },
    testCases: [
      { input: '[[[1,3],[2,6],[8,10],[15,18]]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isSample: true },
      { input: '[[[1,4],[4,5]]]', expectedOutput: '[[1,5]]' },
      { input: '[[[1,4],[0,2],[3,5]]]', expectedOutput: '[[0,5]]' }
    ]
  },
  {
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    topic: 'Heap',
    difficulty: 'Medium',
    functionName: 'topKFrequent',
    description: 'Return the k most frequent elements.',
    starterCode: {
      javascript: 'function topKFrequent(nums, k) {\n  // your code here\n}\nmodule.exports = topKFrequent;'
    },
    testCases: [
      { input: '[[1,1,1,2,2,3],2]', expectedOutput: '[1,2]', isSample: true },
      { input: '[[1],1]', expectedOutput: '[1]' },
      { input: '[[4,4,4,6,6,7],1]', expectedOutput: '[4]' }
    ]
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    topic: 'Graph',
    difficulty: 'Medium',
    functionName: 'numIslands',
    description: 'Count the number of islands in a 2D grid of 1s and 0s.',
    starterCode: {
      javascript: 'function numIslands(grid) {\n  // your code here\n}\nmodule.exports = numIslands;'
    },
    testCases: [
      {
        input: '[[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]]',
        expectedOutput: '1',
        isSample: true
      },
      {
        input: '[[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]]',
        expectedOutput: '3'
      },
      { input: '[[["0"]]]', expectedOutput: '0' }
    ]
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    functionName: 'climbStairs',
    description: 'Find number of distinct ways to climb n stairs if you can climb 1 or 2 at a time.',
    starterCode: {
      javascript: 'function climbStairs(n) {\n  // your code here\n}\nmodule.exports = climbStairs;'
    },
    testCases: [
      { input: '[2]', expectedOutput: '2', isSample: true },
      { input: '[3]', expectedOutput: '3' },
      { input: '[5]', expectedOutput: '8' }
    ]
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    functionName: 'coinChange',
    description: 'Given coins and amount, return fewest number of coins needed to make up that amount.',
    starterCode: {
      javascript: 'function coinChange(coins, amount) {\n  // your code here\n}\nmodule.exports = coinChange;'
    },
    testCases: [
      { input: '[[1,2,5],11]', expectedOutput: '3', isSample: true },
      { input: '[[2],3]', expectedOutput: '-1' },
      { input: '[[1],0]', expectedOutput: '0' }
    ]
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    topic: 'Two Pointers',
    difficulty: 'Hard',
    functionName: 'trap',
    description: 'Given n non-negative integers, compute how much water it can trap after raining.',
    starterCode: {
      javascript: 'function trap(height) {\n  // your code here\n}\nmodule.exports = trap;'
    },
    testCases: [
      { input: '[[0,1,0,2,1,0,1,3,2,1,2,1]]', expectedOutput: '6', isSample: true },
      { input: '[[4,2,0,3,2,5]]', expectedOutput: '9' },
      { input: '[[2,0,2]]', expectedOutput: '2' }
    ]
  }
];
