import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI, usersAPI } from '../api/axios';

const StatPanel = ({ label, value, helper }) => (
  <div className="rounded-xl sm:rounded-2xl border border-ink-800 bg-ink-900/70 p-4 sm:p-5 shadow-card">
    <p className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-500">{label}</p>
    <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-white">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{helper}</p>
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          usersAPI.getProfile(),
          postsAPI.getUserPosts({ limit: 5 })
        ]);
        setProfile(profileRes.data.user);
        setPosts(postsRes.data.posts || []);
      } catch (error) {
        setProfile(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <SiteLayout>
      <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
        {/* Header Section - Fully Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <p className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-500">Creator hub</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-1 break-words">
              Welcome{profile?.name ? `, ${profile.name}` : ''}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Track drafts, publish faster, and monitor your output.</p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Button 
              as={Link} 
              to="/" 
              variant="ghost" 
              className="flex-1 sm:flex-none justify-center text-xs sm:text-sm px-4 py-2"
            >
              View Blog
            </Button>
            <Button 
              as={Link} 
              to="/create-post" 
              className="flex-1 sm:flex-none justify-center text-xs sm:text-sm px-4 py-2"
            >
              New Post
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl sm:rounded-3xl border border-ink-800 bg-ink-900/60 p-8 sm:p-10 text-center text-slate-400">
            Fetching your stats…
          </div>
        ) : (
          <>
            {/* Stats Grid - Responsive for all screen sizes */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 min-[375px]:grid-cols-3">
              <StatPanel label="My posts" value={totalPosts} helper="Total stories created" />
              <StatPanel label="Published" value={publishedCount} helper="Live to everyone" />
              <StatPanel label="Drafts" value={draftCount} helper="Ready for editing" />
            </div>

            {/* Recent Posts Section - Fully Responsive */}
            <div className="rounded-2xl sm:rounded-3xl border border-ink-800 bg-ink-900/70 p-4 sm:p-6 shadow-card overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-white">Recent posts</h2>
                <Button 
                  as={Link} 
                  to="/create-post" 
                  variant="ghost" 
                  className="text-xs sm:text-sm w-full sm:w-auto justify-center"
                >
                  Write more
                </Button>
              </div>
              
              {posts.length === 0 ? (
                <div className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-slate-500">
                  No posts yet. Start your first story!
                </div>
              ) : (
                <>
                  {/* Desktop Table View - Hidden on mobile/tablet */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-300">
                      <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        <tr>
                          <th className="py-2 pr-4">Title</th>
                          <th className="py-2 pr-4">Status</th>
                          <th className="py-2 pr-4">Created</th>
                          <th className="py-2">Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((post) => (
                          <tr key={post._id} className="border-t border-ink-800/60">
                            <td className="py-3 pr-4">
                              <Link 
                                to={`/post/${post._id}`} 
                                className="text-blue-300 hover:text-blue-200 line-clamp-1 break-words"
                              >
                                {post.title}
                              </Link>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="rounded-full bg-ink-800 px-3 py-1 text-xs capitalize whitespace-nowrap">
                                {post.status}
                              </span>
                            </td>
                            <td className="py-3 pr-4 whitespace-nowrap">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <Button 
                                  as={Link} 
                                  to={`/post/${post._id}`} 
                                  variant="ghost" 
                                  className="px-4 py-1 text-xs"
                                >
                                  View
                                </Button>
                                <Button 
                                  as={Link} 
                                  to={`/edit-post/${post._id}`} 
                                  variant="secondary" 
                                  className="px-4 py-1 text-xs"
                                >
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View - Fully Responsive Stack Layout */}
                  <div className="lg:hidden space-y-3 sm:space-y-4">
                    {posts.map((post) => (
                      <div 
                        key={post._id} 
                        className="rounded-xl border border-ink-800 bg-ink-900/60 p-3 sm:p-4 space-y-3 overflow-hidden"
                      >
                        {/* Post Title - Responsive text wrapping */}
                        <div>
                          <Link 
                            to={`/post/${post._id}`} 
                            className="text-blue-300 hover:text-blue-200 font-medium text-sm sm:text-base line-clamp-2 break-words"
                          >
                            {post.title}
                          </Link>
                        </div>

                        {/* Status and Date - Responsive layout */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full bg-ink-800 px-2.5 sm:px-3 py-1 capitalize whitespace-nowrap">
                            {post.status}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-400 whitespace-nowrap">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Action Buttons - Full width, fully visible on all mobile sizes */}
                        <div className="flex gap-2 pt-1">
                          <Button 
                            as={Link} 
                            to={`/post/${post._id}`} 
                            variant="ghost" 
                            className="flex-1 justify-center text-xs sm:text-sm py-2 px-3 min-w-0"
                          >
                            View
                          </Button>
                          <Button 
                            as={Link} 
                            to={`/edit-post/${post._id}`} 
                            variant="secondary" 
                            className="flex-1 justify-center text-xs sm:text-sm py-2 px-3 min-w-0"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
};

export default UserDashboard;