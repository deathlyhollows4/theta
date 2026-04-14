import Problem from '../models/problem.model.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getProblems = asyncHandler(async (req, res) => {
  const { difficulty, topic, search, page = 1, limit = 20 } = req.query;

  const filter = {};

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (topic) {
    filter.topic = topic;
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [problems, total] = await Promise.all([
    Problem.find(filter)
      .select('-testCases')
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Problem.countDocuments(filter)
  ]);

  return res.status(200).json({
    success: true,
    data: {
      items: problems,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit)
      }
    }
  });
});

export const getProblemBySlug = asyncHandler(async (req, res) => {
  const problem = await Problem.findOne({ slug: req.params.slug });

  if (!problem) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found.'
    });
  }

  return res.status(200).json({
    success: true,
    data: problem
  });
});
