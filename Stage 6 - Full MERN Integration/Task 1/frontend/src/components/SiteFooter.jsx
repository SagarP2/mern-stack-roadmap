import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="mt-12 sm:mt-16 border-t border-ink-800 bg-ink-950/80">
      <div className="mx-auto max-w-6xl px-3 xs:px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 xs:gap-3">
              <div className="flex h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-400/20 text-base xs:text-lg sm:text-xl shadow-glow flex-shrink-0">✦</div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] xs:tracking-[0.3em] text-slate-400 truncate">BlogSpace</p>
                <p className="text-sm sm:text-base font-semibold text-slate-100 truncate">Words in the dark</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Build, publish, and discover long-form reading experiences with premium UX and consistent dark surfaces.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] xs:tracking-[0.3em] text-slate-500">Explore</h3>
            <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#blog-posts-section" className="hover:text-blue-200 transition-colors inline-block">
                  Featured
                </a>
              </li>
              <li>
                <a href="#topics" className="hover:text-blue-200 transition-colors inline-block">
                  Topics
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-blue-200 transition-colors inline-block">
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] xs:tracking-[0.3em] text-slate-500">Get started</h3>
            <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
            <Link to="/register" className="hover:text-blue-200 transition-colors inline-block">
                  Create an account
                </Link>
              </li>
              <li>
            <Link to="/login" className="hover:text-blue-200 transition-colors inline-block">
                  Sign in
                </Link>
              </li>
              <li>
            <Link to="/create-post" className="hover:text-blue-200 transition-colors inline-block">
                  Start writing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:gap-4 border-t border-ink-800 pt-5 sm:pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} BlogSpace. Crafted for long-form reading.</p>
          <div className="flex gap-4 sm:gap-6 justify-center sm:justify-end">
            <a href="#" className="hover:text-blue-200 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
