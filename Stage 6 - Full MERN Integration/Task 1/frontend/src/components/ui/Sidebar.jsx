import { Link } from 'react-router-dom';

export default function Sidebar({ items = [], active }) {
  return (
    <aside className="hidden lg:flex lg:w-56 xl:w-64 flex-col border-r border-ink-700 bg-ink-900/70 backdrop-blur">
      <div className="px-4 xl:px-6 py-4 xl:py-5 text-xs uppercase tracking-[0.25em] xl:tracking-[0.3em] text-slate-200">Admin</div>
      <nav className="flex-1 space-y-1 px-2 xl:px-3">
        {items.map((item) => {
          const isActive = active === item.id;
          const Component = item.path ? Link : 'button';
          const props = item.path ? { to: item.path } : { onClick: () => {} };
          
          return (
            <Component
              key={item.id}
              {...props}
              className={`group flex w-full items-center gap-2 xl:gap-3 rounded-lg xl:rounded-xl px-2.5 xl:px-3 py-2 text-left text-xs xl:text-sm font-medium transition focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-300/60 ${
                isActive ? 'bg-ink-800 text-blue-200 shadow-card' : 'text-slate-300 hover:bg-ink-800/80'
              }`}
            >
              <span className="text-base xl:text-lg">{item.icon}</span>
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-ink-700 px-1.5 xl:px-2 py-0.5 text-xs text-slate-200 flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </Component>
          );
        })}
      </nav>
      <div className="px-4 xl:px-6 py-3 xl:py-4 text-xs text-slate-500 hidden xl:block">Press `Tab` to focus links</div>
    </aside>
  );
}
