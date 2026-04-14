import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { api } from '../services/api.js';
import ToastMessage from '../components/ToastMessage.jsx';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript', enabled: true },
  { value: 'python', label: 'Python (coming soon)', enabled: false },
  { value: 'cpp', label: 'C++ (coming soon)', enabled: false }
];

const ProblemPage = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('[1,2,3]');
  const [customOutput, setCustomOutput] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);

  const accuracyLabel = useMemo(() => {
    if (!result) return '';
    return `${result.passedCount}/${result.totalCount} tests passed`;
  }, [result]);

  const loadProblem = useCallback(async () => {
    const response = await api.get(`/problems/${slug}`);
    const p = response.data.data;
    setProblem(p);
    setCode((prev) => (prev ? prev : p.starterCode.javascript));
  }, [slug]);

  const loadHistory = useCallback(async () => {
    const response = await api.get('/submit/history', { params: { problemSlug: slug, limit: 8 } });
    setHistory(response.data.data);
  }, [slug]);

  const loadAll = useCallback(() => {
    setError('');
    Promise.all([loadProblem(), loadHistory()]).catch((err) => {
      setError(err?.message || 'Failed to load problem.');
    });
  }, [loadProblem, loadHistory]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const runCode = useCallback(async () => {
    setError('');
    setIsRunning(true);
    try {
      const { data } = await api.post('/submit/run', { problemSlug: slug, code, language });
      setResult(data.data);
      setNotice({ type: 'success', text: 'Code executed on official test cases.' });
    } catch (err) {
      setError(err?.message || 'Run failed.');
    } finally {
      setIsRunning(false);
    }
  }, [slug, code, language]);

  const runCustom = useCallback(async () => {
    setError('');
    setIsRunning(true);
    try {
      const { data } = await api.post('/submit/run-custom', { code, customInput, language });
      setCustomOutput(data.data);
      setNotice({ type: 'success', text: 'Custom test executed.' });
    } catch (err) {
      setError(err?.message || 'Custom run failed.');
    } finally {
      setIsRunning(false);
    }
  }, [code, customInput, language]);

  const submitCode = useCallback(async () => {
    setError('');
    setIsRunning(true);
    try {
      const { data } = await api.post('/submit', { problemSlug: slug, code, language });
      setResult(data.data);
      loadHistory();
      setNotice({ type: 'success', text: 'Submission saved with AI feedback.' });
    } catch (err) {
      setError(err?.message || 'Submit failed.');
    } finally {
      setIsRunning(false);
    }
  }, [slug, code, language, loadHistory]);

  useEffect(() => {
    const keyHandler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (event.shiftKey) {
          submitCode();
        } else {
          runCode();
        }
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [runCode, submitCode]);

  if (!problem) {
    return (
      <div className="p-6">
        {error ? (
          <>
            <div className="mb-3 rounded border border-rose-500/50 bg-rose-900/20 p-3 text-rose-200">{error}</div>
            <button onClick={loadAll} className="rounded bg-cyan-600 px-4 py-2 hover:bg-cyan-500">
              Retry
            </button>
          </>
        ) : (
          <div className="animate-pulse text-slate-400">Loading problem...</div>
        )}
      </div>
    );
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-5">
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4 lg:col-span-2">
        <h1 className="text-xl font-semibold">{problem.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{problem.description}</p>

        <div className="mt-4 rounded-md border border-slate-800 bg-slate-950 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Recent submissions</p>
          <div className="space-y-2 text-xs">
            {history.map((item) => (
              <div key={item._id} className="rounded border border-slate-800 p-2">
                <p>
                  {item.status.toUpperCase()} · {item.passedCount}/{item.totalCount} · {item.executionMs}ms
                </p>
                <p className="text-slate-400">{new Date(item.createdAt).toLocaleString()} · {item.mistakeAnalysis?.primaryCategory || 'n/a'}</p>
              </div>
            ))}
            {!history.length && <p className="text-slate-400">No submissions yet.</p>}
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4 lg:col-span-3">
        {notice && <ToastMessage type={notice.type} message={notice.text} onClose={() => setNotice(null)} />}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <select aria-label="Language selector" value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2">
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={!opt.enabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="space-x-2">
            <button aria-label="Run official tests" onClick={runCode} disabled={isRunning} className="rounded-md bg-slate-700 px-3 py-2 hover:bg-slate-600 disabled:opacity-60">
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <button aria-label="Submit solution" onClick={submitCode} disabled={isRunning} className="rounded-md bg-cyan-600 px-3 py-2 hover:bg-cyan-500 disabled:opacity-60">
              Submit
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400">Shortcut: Ctrl/Cmd + Enter = Run, Ctrl/Cmd + Shift + Enter = Submit</p>

        <div className="h-[420px] overflow-hidden rounded-md border border-slate-700">
          <Editor height="100%" theme="vs-dark" language="javascript" value={code} onChange={(v) => setCode(v || '')} />
        </div>

        <div className="rounded border border-slate-800 bg-slate-950 p-3 text-xs">
          <p className="mb-2 font-medium text-cyan-300">Custom Input Runner (JSON array arguments)</p>
          <div className="flex gap-2">
            <input
              aria-label="Custom input JSON"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1"
              placeholder='Example: [[2,7,11,15],9]'
            />
            <button aria-label="Run custom input" onClick={runCustom} disabled={isRunning} className="rounded bg-indigo-600 px-3 py-1 hover:bg-indigo-500 disabled:opacity-60">
              Run Custom
            </button>
          </div>
          {customOutput && (
            <div className="mt-2 text-slate-300">
              <p>Input: {customOutput.input}</p>
              <p>Output: {customOutput.actualOutput}</p>
              {customOutput.error && <p className="text-rose-300">Error: {customOutput.error}</p>}
            </div>
          )}
        </div>

        {error && <div className="rounded border border-rose-500/40 bg-rose-500/10 p-2 text-sm text-rose-300">{error}</div>}

        {result && (
          <div className="rounded-md border border-slate-700 p-3 text-sm">
            <p className="mb-1">
              Status: <span className={result.status === 'passed' ? 'text-emerald-300' : 'text-rose-300'}>{result.status}</span>
            </p>
            <p className="mb-2 text-xs text-slate-400">{accuracyLabel}</p>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400">
                  <th>Input</th>
                  <th>Expected</th>
                  <th>Your Output</th>
                  <th>Pass</th>
                </tr>
              </thead>
              <tbody>
                {result.testResults?.map((tc, idx) => (
                  <tr key={`${tc.input}-${idx}`} className="border-t border-slate-800">
                    <td className="py-1 pr-2">{tc.input}</td>
                    <td className="py-1 pr-2">{tc.expectedOutput}</td>
                    <td className="py-1 pr-2">{tc.actualOutput}</td>
                    <td className="py-1">{tc.passed ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {result.aiFeedback && (
              <div className="mt-3 rounded border border-slate-800 bg-slate-950 p-2">
                <p className="font-medium text-cyan-300">AI Feedback</p>
                <p>Time: {result.aiFeedback.timeComplexity}</p>
                <p>Space: {result.aiFeedback.spaceComplexity}</p>
                <p>Skill: {result.aiFeedback.skillLevel}</p>
                <p>Suggestion: {result.aiFeedback.improvementSuggestion}</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProblemPage;
