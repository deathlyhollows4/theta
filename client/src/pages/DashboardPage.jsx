import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import { api } from '../services/api.js';

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    api.get('/dashboard').then((response) => setDashboard(response.data.data));
    api.get('/auth/me').then((response) => setUsername(response.data.data.username));
  }, []);

  if (!dashboard) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard title="Solved" value={dashboard.totalProblemsSolved} />
        <StatCard title="Accuracy" value={`${dashboard.accuracy}%`} />
        <StatCard title="Avg Time" value={`${dashboard.averageExecutionMs}ms`} />
        <StatCard title="Submissions" value={dashboard.totalSubmissions} />
      </section>

      {username && (
        <section className="rounded border border-cyan-700/40 bg-cyan-900/10 p-3 text-sm">
          Public profile:
          <Link className="ml-2 text-cyan-300 underline" to={`/u/${username}`}>
            {`${window.location.origin}/u/${username}`}
          </Link>
        </section>
      )}

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-4 text-lg font-semibold">14-Day Activity</h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard.chartData.dailyTrend}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attempts" fill="#06b6d4" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
