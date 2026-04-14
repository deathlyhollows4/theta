import vm from 'node:vm';

const EXECUTION_TIMEOUT_MS = 800;

const normalizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = normalizeValue(value[key]);
        return acc;
      }, {});
  }

  return value;
};

const parseSerialized = (raw) => JSON.parse(raw);

const stringifyNormalized = (value) => JSON.stringify(normalizeValue(value));

export const executeSubmission = ({ code, functionName, testCases }) => {
  const start = Date.now();

  const sandbox = {
    module: { exports: {} },
    exports: {},
    require: undefined,
    process: undefined,
    global: undefined,
    globalThis: undefined,
    console: { log: () => {} }
  };

  vm.createContext(sandbox);

  try {
    const script = new vm.Script(code);
    script.runInContext(sandbox, { timeout: EXECUTION_TIMEOUT_MS });
  } catch (error) {
    return {
      status: 'failed',
      passedCount: 0,
      totalCount: testCases.length,
      executionMs: Date.now() - start,
      testResults: testCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: 'Runtime Error',
        passed: false,
        error: error.message
      }))
    };
  }

  const candidateFn = sandbox.module.exports || sandbox.exports;

  if (typeof candidateFn !== 'function') {
    return {
      status: 'failed',
      passedCount: 0,
      totalCount: testCases.length,
      executionMs: Date.now() - start,
      testResults: testCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: 'Invalid submission',
        passed: false,
        error: `Exported value must be a function via module.exports = ${functionName}`
      }))
    };
  }

  let passedCount = 0;

  const testResults = testCases.map((testCase) => {
    try {
      const args = parseSerialized(testCase.input);
      const expected = parseSerialized(testCase.expectedOutput);
      const actual = candidateFn(...args);

      const normalizedActual = stringifyNormalized(actual);
      const normalizedExpected = stringifyNormalized(expected);

      const passed = normalizedActual === normalizedExpected;
      if (passed) passedCount += 1;

      return {
        input: testCase.input,
        expectedOutput: normalizedExpected,
        actualOutput: normalizedActual,
        passed,
        error: ''
      };
    } catch (error) {
      return {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: 'Execution Error',
        passed: false,
        error: error.message
      };
    }
  });

  return {
    status: passedCount === testCases.length ? 'passed' : 'failed',
    passedCount,
    totalCount: testCases.length,
    executionMs: Date.now() - start,
    testResults
  };
};
