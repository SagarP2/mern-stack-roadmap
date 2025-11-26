import SiteHeader from './SiteHeader';
import Sidebar from './Sidebar';

export default function AdminLayout({ sidebarItems, current, onNavigate, children }) {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100 flex">
      <Sidebar items={sidebarItems} active={current} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col">
        <SiteHeader user={{ name: 'Admin' }} />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

