const StatCard = ({ title, value }) => {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-cyan-300">{value}</p>
    </div>
  );
};

export default StatCard;
