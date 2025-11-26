import { useState } from 'react';

export default function SiteHeader({ onSearch, user }) {
  const [query, setQuery] = useState('');

  return (
    <header className="bg-ink-900/80 backdrop-blur border-b border-ink-700">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-blue-400/20 shadow-glow" />
          <span className="font-semibold text-blue-200 tracking-wide">BlogSpace</span>
        </div>

        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm text-slate-300">
          {['Home', 'Posts'].map((item) => (
            <button
              key={item}
              className="hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-300/60 rounded"
            >
              {item}
            </button>
          ))}
        </nav>

        <form
          className="relative flex-1 md:flex-none"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch?.(query);
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts"
            className="w-full rounded-full bg-ink-800/70 px-4 py-2 text-sm text-slate-200 placeholder-slate-400 ring-1 ring-ink-600 focus:ring-2 focus:ring-blue-300/70 transition shadow-inner"
          />
        </form>

        <button className="relative flex items-center gap-3 rounded-full bg-ink-800/80 px-3 py-2 text-sm text-slate-200 ring-1 ring-ink-600 hover:ring-blue-400 transition-shadow focus-visible:ring-2 focus-visible:ring-blue-300/70">
          <span>{user?.name ?? 'Guest'}</span>
          <img
            src={user?.avatar ?? '/images/avatar-fallback.png'}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}

