import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';

const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    try {
      setError('');
      const response = await api.get(`/profile/${username}`);
      setProfile(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load public profile.');
    }
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-3 rounded border border-rose-500/50 bg-rose-900/20 p-3 text-rose-200">{error}</div>
        <button onClick={loadProfile} className="rounded bg-cyan-600 px-4 py-2 hover:bg-cyan-500">
          Retry
        </button>
      </div>
    );
  }

  if (!profile) return <div className="p-6 animate-pulse text-slate-400">Loading profile...</div>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <h1 className="text-2xl font-semibold">{profile.user.name}</h1>
        <p className="text-slate-400">@{profile.user.username}</p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded border border-slate-800 p-3">Solved: {profile.stats.totalProblemsSolved}</div>
          <div className="rounded border border-slate-800 p-3">Accuracy: {profile.stats.accuracy}%</div>
          <div className="rounded border border-slate-800 p-3">Avg Time: {profile.stats.averageExecutionMs}ms</div>
        </div>
      </div>
    </main>
  );
};

export default PublicProfilePage;
