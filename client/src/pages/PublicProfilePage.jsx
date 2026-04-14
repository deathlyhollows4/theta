import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';

const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get(`/profile/${username}`).then((response) => setProfile(response.data.data));
  }, [username]);

  if (!profile) return <div className="p-6">Loading profile...</div>;

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
