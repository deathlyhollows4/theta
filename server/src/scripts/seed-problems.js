import { connectDB } from '../config/db.js';
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
    await connectDB();

    const dataset = buildLargeDataset();

    await Problem.deleteMany({});
    await Problem.insertMany(dataset);

    console.info(`[SEED] Inserted ${dataset.length} problems successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Failed to seed problems:', error.message);
    process.exit(1);
  }
};

run();
