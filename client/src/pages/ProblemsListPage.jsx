import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

const ProblemsListPage = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ difficulty: '', search: '', page: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadProblems = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await api.get('/problems', { params: { ...filters, limit: 20 } });
      setItems(response.data.data.items);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load problems.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, [filters.page, filters.difficulty]);

  const onSearch = (event) => {
    event.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
    loadProblems();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Problem Bank</h1>

      <form onSubmit={onSearch} className="mb-4 grid gap-2 md:grid-cols-3">
        <input
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          placeholder="Search problem"
          className="rounded border border-slate-700 bg-slate-900 px-3 py-2"
        />
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value, page: 1 }))}
          className="rounded border border-slate-700 bg-slate-900 px-3 py-2"
        >
          <option value="">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button className="rounded bg-cyan-600 px-4 py-2 hover:bg-cyan-500">Apply</button>
      </form>

      {error && (
        <div className="mb-4 rounded border border-rose-500/50 bg-rose-900/20 p-3 text-rose-200">
          {error}
          <button onClick={loadProblems} className="ml-3 rounded bg-cyan-600 px-3 py-1 text-sm hover:bg-cyan-500">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse rounded border border-slate-800 p-6 text-slate-400">Loading problems...</div>
      ) : !items.length ? (
        <div className="rounded border border-slate-800 p-6 text-slate-400">No problems found for selected filters.</div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Topic</th>
                  <th className="px-3 py-2">Difficulty</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((problem) => (
                  <tr key={problem._id} className="border-t border-slate-800">
                    <td className="px-3 py-2">{problem.title}</td>
                    <td className="px-3 py-2 text-slate-300">{problem.topic}</td>
                    <td className="px-3 py-2">{problem.difficulty}</td>
                    <td className="px-3 py-2">
                      <Link to={`/problems/${problem.slug}`} className="text-cyan-300 hover:underline">
                        Solve
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p>
              Page {pagination.page} / {pagination.totalPages}
            </p>
            <div className="space-x-2">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                className="rounded border border-slate-700 px-3 py-1 disabled:opacity-50"
                disabled={pagination.page <= 1}
              >
                Prev
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(prev.page + 1, pagination.totalPages) }))}
                className="rounded border border-slate-700 px-3 py-1 disabled:opacity-50"
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ProblemsListPage;
