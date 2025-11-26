import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { adminAPI } from '../api/axios';
import AdminLayout from '../components/ui/AdminLayout';
import StatsCard from '../components/ui/StatsCard';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const SIDEBAR = [
  { id: 'overview', label: 'Overview', icon: '🏠', path: '/admin/dashboard' },
  { id: 'posts', label: 'Posts', icon: '📝', path: '/admin/posts' },
  { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
];

const FALLBACK_STATS = [
  { id: 'reads', label: 'Weekly Reads', value: '32.4K', delta: '+6%', icon: '📈' },
  { id: 'subs', label: 'Subscribers', value: '12.7K', delta: '+2%', icon: '🛰️' },
  { id: 'posts', label: 'Published Posts', value: '482', delta: '+18', icon: '📝' },
  { id: 'writers', label: 'Active Writers', value: '42', delta: '+3', icon: '✍️' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function fetchDashboard() {
      try {
        const [{ data: statData }, { data: postData }, { data: userData }] = await Promise.all([
          api.get('/admin/stats/dashboard'),
          api.get('/admin/posts'),
          api.get('/admin/users'),
        ]);

        if (!mounted) return;

        setStats(
          (statData?.items ?? FALLBACK_STATS).map((item) => ({
            id: item.id ?? item.label,
            label: item.label,
            value: item.value,
            delta: item.delta,
            icon: item.icon ?? '📊',
          })),
        );
        setPosts(postData?.posts ?? []);
        setUsers(userData?.users ?? []);
      } catch (error) {
        console.warn('Falling back to mock dashboard data', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);


  return (
    <AdminLayout sidebarItems={SIDEBAR} current="overview">
      {loading ? (
        <div className="rounded-xl sm:rounded-2xl border border-ink-700 bg-ink-800/60 p-8 sm:p-10 text-center text-slate-200">
          Loading dashboard...
        </div>
      ) : (
        <>
          <section className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] xs:tracking-[0.4em] text-slate-200">Admin control</p>
              <h1 className="text-2xl xs:text-3xl font-semibold text-slate-50 mt-1">BlogSpace command center</h1>
              <p className="text-xs xs:text-sm text-slate-200 mt-1">
                Manage posts, roles, and overall publishing health.
              </p>
            </div>
            <div className="flex gap-2 xs:gap-3 w-full sm:w-auto">
              <Button as={Link} to="/" variant="ghost" className="flex-1 sm:flex-none justify-center text-xs xs:text-sm">
                View Blog
              </Button>
              <Button variant="secondary" onClick={logout} className="flex-1 sm:flex-none justify-center text-xs xs:text-sm">
                Logout
              </Button>
            </div>
          </section>

          {/* UPLOADED POSTS SECTION - SHOWN FIRST */}
          <section className="mt-6 xs:mt-7 sm:mt-8 rounded-xl sm:rounded-2xl border border-ink-700 bg-ink-800/60 p-4 xs:p-5 sm:p-6">
            <h2 className="text-lg xs:text-xl font-semibold text-slate-50 mb-3 xs:mb-4">📝 Uploaded Posts</h2>
            <p className="text-xs xs:text-sm text-slate-200 mb-3 xs:mb-4">Recent blog posts from your platform</p>
            {posts.length === 0 ? (
              <div className="rounded-xl sm:rounded-2xl border border-dashed border-ink-700 p-5 xs:p-6 text-center text-sm xs:text-base text-slate-300">
                No posts yet — create your first post to see it here.
              </div>
            ) : (
              <div className="grid gap-3 xs:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, 6).map((post) => {
                  const id = post._id ?? post.id;
                  return (
                    <div
                      key={id}
                      className="rounded-lg xs:rounded-xl border border-ink-700 bg-ink-900/60 p-3 xs:p-4 hover:border-blue-500/50 transition-all"
                    >
                      <h3 className="font-semibold text-sm xs:text-base text-slate-50 mb-2 line-clamp-2">{post.title}</h3>
                      <div className="flex items-center justify-between text-xs text-slate-300 mb-3 gap-2">
                        <span className="rounded-full bg-ink-800 px-2 xs:px-3 py-1 capitalize truncate">
                          {post.status ?? 'draft'}
                        </span>
                        <span className="flex-shrink-0">{post.views ?? 0} views</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          as={Link}
                          to={`/post/${id}`}
                          variant="ghost"
                          className="px-2 xs:px-3 py-1 text-xs flex-1 justify-center"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* STATS CARDS */}
          <section className="mt-6 xs:mt-7 sm:mt-8 grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard key={stat.id} {...stat} />
            ))}
          </section>

        </>
      )}
    </AdminLayout>
  );
}
