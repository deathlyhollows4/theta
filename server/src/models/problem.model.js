import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true
    },
    expectedOutput: {
      type: String,
      required: true,
      trim: true
    },
    isSample: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 120
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      index: true
    },
    starterCode: {
      javascript: {
        type: String,
        required: true
      }
    },
    functionName: {
      type: String,
      required: true,
      trim: true
    },
    testCases: {
      type: [testCaseSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 2,
        message: 'At least two test cases are required.'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
