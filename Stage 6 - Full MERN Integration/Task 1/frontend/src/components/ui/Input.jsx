export default function Input({ label, hint, error, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      {label && <span className="font-medium">{label}</span>}
      <input
        {...props}
        className={`rounded-xl bg-ink-900/40 px-4 py-3 text-slate-100 placeholder-slate-500 ring-1 ring-ink-700 transition focus:ring-2 focus:ring-blue-300/70 focus:outline-none ${error ? 'ring-danger focus:ring-danger' : ''} ${className}`}
      />
      {(hint || error) && (
        <span className={`text-xs ${error ? 'text-danger' : 'text-slate-400'}`}>
          {error ?? hint}
        </span>
      )}
    </label>
  );
}