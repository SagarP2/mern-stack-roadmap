export default function StatsCard({ label, value, delta, icon }) {
  const positive = delta?.startsWith('+');

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 shadow-card transition hover:shadow-card-hover hover:-translate-y-1 duration-200 motion-reduce:transform-none">
      <div className="flex items-center gap-3 text-slate-400 text-sm">
        <span className="text-xl text-blue-300">{icon}</span>
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold text-slate-100">{value}</div>
      {delta && (
        <div className={`mt-2 text-xs font-medium ${positive ? 'text-success' : 'text-danger'}`}>
          {delta} from last week
        </div>
      )}
    </div>
  );
}

