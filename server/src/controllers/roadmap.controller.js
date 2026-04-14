import mongoose from 'mongoose';
import Submission from '../models/submission.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { generateRoadmap } from '../services/roadmap.service.js';

const ObjectId = mongoose.Types.ObjectId;

export const getRoadmap = asyncHandler(async (req, res) => {
  const userId = new ObjectId(req.user._id);

  const [weakTopicsAgg, mistakeCategoriesAgg, skillAgg] = await Promise.all([
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
      { $group: { _id: '$problem.topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]),
    Submission.aggregate([
      { $match: { userId } },
      { $group: { _id: '$mistakeAnalysis.primaryCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]),
    Submission.aggregate([
      { $match: { userId } },
      { $group: { _id: '$aiFeedback.skillLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ])
  ]);

  const weakTopics = weakTopicsAgg.map((item) => item._id).filter(Boolean);
  const mistakeCategories = mistakeCategoriesAgg.map((item) => item._id).filter(Boolean);
  const currentSkillLevel = skillAgg[0]?._id || 'Beginner';

  const roadmap = await generateRoadmap({
    weakTopics,
    mistakeCategories,
    currentSkillLevel
  });

  return res.status(200).json({
    success: true,
    data: {
      profile: {
        currentSkillLevel,
        weakTopics,
        mistakeCategories
      },
      roadmap
    }
  });
});
