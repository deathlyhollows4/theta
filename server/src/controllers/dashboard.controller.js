import mongoose from 'mongoose';
import Submission from '../models/submission.model.js';
import { asyncHandler } from '../utils/async-handler.js';

const ObjectId = mongoose.Types.ObjectId;

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = new ObjectId(req.user._id);

  const [summaryAgg, weakTopicsAgg, recentSubmissions, dailyTrend, mistakeBreakdown] = await Promise.all([
    Submission.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          totalPassedTests: { $sum: '$passedCount' },
          totalTests: { $sum: '$totalCount' },
          averageExecutionMs: { $avg: '$executionMs' },
          solvedProblemIds: {
            $addToSet: {
              $cond: [{ $eq: ['$status', 'passed'] }, '$problemId', '$$REMOVE']
            }
          }
        }
      }
    ]),
    Submission.aggregate([
      { $match: { userId, status: 'failed' } },
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem'
        }
      },
      { $unwind: '$problem' },
      {
        $group: {
          _id: '$problem.topic',
          failedAttempts: { $sum: 1 }
        }
      },
      { $sort: { failedAttempts: -1 } },
      { $limit: 5 }
    ]),
    Submission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('problemId', 'title slug topic difficulty')
      .select(
        'status passedCount totalCount executionMs createdAt problemId aiFeedback.skillLevel aiFeedback.mistakeTags mistakeAnalysis.primaryCategory'
      ),
    Submission.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          attempts: { $sum: 1 },
          solved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'passed'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.day': 1 } },
      { $limit: 14 }
    ]),
    Submission.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$mistakeAnalysis.primaryCategory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 7 }
    ])
  ]);

  const summary = summaryAgg[0] || {
    totalSubmissions: 0,
    totalPassedTests: 0,
    totalTests: 0,
    averageExecutionMs: 0,
    solvedProblemIds: []
  };

  const accuracy = summary.totalTests > 0 ? Number(((summary.totalPassedTests / summary.totalTests) * 100).toFixed(2)) : 0;

  return res.status(200).json({
    success: true,
    data: {
      totalProblemsSolved: summary.solvedProblemIds.length,
      totalSubmissions: summary.totalSubmissions,
      accuracy,
      averageExecutionMs: Number((summary.averageExecutionMs || 0).toFixed(2)),
      weakTopics: weakTopicsAgg.map((item) => ({
        topic: item._id,
        failedAttempts: item.failedAttempts
      })),
      mistakeBreakdown: mistakeBreakdown.map((item) => ({
        category: item._id || 'uncategorized',
        count: item.count
      })),
      recentSubmissions,
      chartData: {
        dailyTrend: dailyTrend.map((point) => ({
          date: point._id.day,
          attempts: point.attempts,
          solved: point.solved
        }))
      }
    }
  });
});
