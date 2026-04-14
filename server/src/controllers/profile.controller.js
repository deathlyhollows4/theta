import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Submission from '../models/submission.model.js';
import { asyncHandler } from '../utils/async-handler.js';

const ObjectId = mongoose.Types.ObjectId;

export const getPublicProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select('name username createdAt');

  if (!user) {
    return res.status(404).json({ success: false, message: 'Public profile not found.' });
  }

  const userId = new ObjectId(user._id);

  const [summaryAgg, recent] = await Promise.all([
    Submission.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          solvedProblems: { $addToSet: { $cond: [{ $eq: ['$status', 'passed'] }, '$problemId', '$$REMOVE'] } },
          avgExecutionMs: { $avg: '$executionMs' },
          passedTests: { $sum: '$passedCount' },
          totalTests: { $sum: '$totalCount' }
        }
      }
    ]),
    Submission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('problemId', 'title slug difficulty')
      .select('status passedCount totalCount createdAt problemId')
  ]);

  const summary = summaryAgg[0] || {
    totalSubmissions: 0,
    solvedProblems: [],
    avgExecutionMs: 0,
    passedTests: 0,
    totalTests: 0
  };

  const accuracy = summary.totalTests ? Number(((summary.passedTests / summary.totalTests) * 100).toFixed(2)) : 0;

  return res.status(200).json({
    success: true,
    data: {
      user,
      stats: {
        totalSubmissions: summary.totalSubmissions,
        totalProblemsSolved: summary.solvedProblems.length,
        averageExecutionMs: Number((summary.avgExecutionMs || 0).toFixed(2)),
        accuracy
      },
      recentSubmissions: recent
    }
  });
});
