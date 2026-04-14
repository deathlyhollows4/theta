import Problem from '../models/problem.model.js';
import Submission from '../models/submission.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { executeSubmission } from '../services/execution.service.js';
import { generateAIFeedback } from '../services/ai-feedback.service.js';
import { analyzeMistakes } from '../services/mistake-analysis.service.js';

const buildExecutionResponse = (result) => ({
  status: result.status,
  passedCount: result.passedCount,
  totalCount: result.totalCount,
  executionMs: result.executionMs,
  testResults: result.testResults
});

const executeCustomInput = ({ code, customInput }) => {
  const customTest = [
    {
      input: customInput,
      expectedOutput: 'null'
    }
  ];

  const result = executeSubmission({
    code,
    functionName: 'custom',
    testCases: customTest
  });

  return result.testResults?.[0] || null;
};

export const runCode = asyncHandler(async (req, res) => {
  const { problemSlug, code, language = 'javascript' } = req.body;

  const problem = await Problem.findOne({ slug: problemSlug });
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  if (language !== 'javascript') {
    return res.status(400).json({ success: false, message: 'Only JavaScript is supported right now.' });
  }

  const result = executeSubmission({
    code,
    functionName: problem.functionName,
    testCases: problem.testCases
  });

  return res.status(200).json({
    success: true,
    message: 'Execution completed.',
    data: buildExecutionResponse(result)
  });
});

export const runCustomCode = asyncHandler(async (req, res) => {
  const { code, customInput, language = 'javascript' } = req.body;

  if (language !== 'javascript') {
    return res.status(400).json({ success: false, message: 'Only JavaScript is supported right now.' });
  }

  const testResult = executeCustomInput({ code, customInput });

  return res.status(200).json({
    success: true,
    data: {
      input: customInput,
      actualOutput: testResult?.actualOutput || 'Execution Error',
      error: testResult?.error || ''
    }
  });
});

export const submitCode = asyncHandler(async (req, res) => {
  const { problemSlug, code, language = 'javascript' } = req.body;

  const problem = await Problem.findOne({ slug: problemSlug });
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  if (language !== 'javascript') {
    return res.status(400).json({ success: false, message: 'Only JavaScript is supported right now.' });
  }

  const executionResult = executeSubmission({
    code,
    functionName: problem.functionName,
    testCases: problem.testCases
  });

  const aiFeedback = await generateAIFeedback({
    code,
    problemDescription: problem.description
  });

  const mistakeAnalysis = analyzeMistakes(aiFeedback);

  const submission = await Submission.create({
    userId: req.user._id,
    problemId: problem._id,
    language,
    code,
    ...buildExecutionResponse(executionResult),
    aiFeedback,
    mistakeAnalysis
  });

  return res.status(201).json({
    success: true,
    message: 'Submission recorded.',
    data: {
      id: submission._id,
      problemSlug,
      ...buildExecutionResponse(executionResult),
      aiFeedback: submission.aiFeedback,
      mistakeAnalysis: submission.mistakeAnalysis
    }
  });
});

export const getSubmissionHistory = asyncHandler(async (req, res) => {
  const { problemSlug, limit = 10 } = req.query;
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const filter = { userId: req.user._id };

  if (problemSlug) {
    const problem = await Problem.findOne({ slug: problemSlug }).select('_id');
    if (problem) {
      filter.problemId = problem._id;
    } else {
      return res.status(200).json({ success: true, data: [] });
    }
  }

  const submissions = await Submission.find(filter)
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .populate('problemId', 'title slug difficulty topic')
    .select('status passedCount totalCount executionMs createdAt aiFeedback.skillLevel mistakeAnalysis.primaryCategory');

  return res.status(200).json({
    success: true,
    data: submissions
  });
});
