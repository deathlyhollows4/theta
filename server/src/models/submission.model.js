import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    actualOutput: { type: String, required: true },
    passed: { type: Boolean, required: true },
    error: { type: String, default: '' }
  },
  { _id: false }
);

const aiFeedbackSchema = new mongoose.Schema(
  {
    timeComplexity: { type: String, default: '' },
    spaceComplexity: { type: String, default: '' },
    mistakes: { type: [String], default: [] },
    betterApproach: { type: String, default: '' },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    improvementSuggestion: { type: String, default: '' },
    mistakeTags: { type: [String], default: [] }
  },
  { _id: false }
);

const mistakeCategorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    score: { type: Number, required: true },
    matchedKeywords: { type: [String], default: [] }
  },
  { _id: false }
);

const mistakeAnalysisSchema = new mongoose.Schema(
  {
    primaryCategory: { type: String, default: 'uncategorized' },
    categories: { type: [mistakeCategorySchema], default: [] },
    extractedFromText: { type: String, default: '' }
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true
    },
    language: {
      type: String,
      enum: ['javascript'],
      default: 'javascript'
    },
    code: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['passed', 'failed'],
      required: true
    },
    passedCount: {
      type: Number,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
    testResults: {
      type: [testResultSchema],
      default: []
    },
    executionMs: {
      type: Number,
      default: 0
    },
    aiFeedback: {
      type: aiFeedbackSchema,
      default: () => ({})
    },
    mistakeAnalysis: {
      type: mistakeAnalysisSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
