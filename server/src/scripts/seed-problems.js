import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import Problem from '../models/problem.model.js';
import { problemsSeed } from '../data/problems.seed.js';

const TARGET_COUNT = 360;

const cloneProblem = (problem, index) => {
  const n = index + 1;
  return {
    ...problem,
    title: `${problem.title} Variant ${n}`,
    slug: `${problem.slug}-v${n}`
  };
};

const buildLargeDataset = () => {
  const expanded = [];
  let i = 0;

  while (expanded.length < TARGET_COUNT) {
    const template = problemsSeed[i % problemsSeed.length];
    expanded.push(cloneProblem(template, i));
    i += 1;
  }

  return expanded;
};

const run = async () => {
  try {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      throw new Error(
        'Database connection unavailable. Add a valid MONGODB_URI in server/.env before running seed:problems.'
      );
    }

    const dataset = buildLargeDataset();

    await Problem.deleteMany({});
    await Problem.insertMany(dataset);

    console.info(`[SEED] Inserted ${dataset.length} problems successfully.`);
    process.exit(0);
  } catch (error) {
    const uriHint = env.MONGODB_URI
      ? 'Verify the URI and ensure your MongoDB instance is reachable from this environment.'
      : 'MONGODB_URI is missing in server/.env.';
    console.error('[SEED] Failed to seed problems:', `${error.message} ${uriHint}`);
    process.exit(1);
  }
};

run();
