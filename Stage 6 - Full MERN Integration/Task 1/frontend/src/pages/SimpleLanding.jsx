import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import SiteLayout from '../components/SiteLayout';
import Button from '../components/ui/Button';

const shimmer =
  'bg-[radial-gradient(900px_600px_at_15%_15%,rgba(63,133,244,0.25),transparent),radial-gradient(900px_600px_at_85%_25%,rgba(30,40,83,0.9),transparent)]';

const PostCard = ({ post, badge }) => {
  const description =
    post.introduction ||
    (post.content?.length > 160 ? `${post.content.slice(0, 160)}…` : post.content);

  return (
    <Link
      to={`/post/${post._id}`}
      className="flex flex-col rounded-2xl sm:rounded-3xl border border-ink-800 bg-ink-900/60 p-4 xs:p-5 sm:p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transform-none"
    >
      {badge && (
        <span className="mb-2 xs:mb-3 inline-flex self-start rounded-full bg-ink-800 px-2.5 xs:px-3 py-1 text-xs uppercase tracking-wide text-blue-200">
          {badge}
        </span>
      )}
      <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-slate-100 line-clamp-2">{post.title || post.heading}</h3>
      <p className="mt-1.5 xs:mt-2 text-xs xs:text-sm text-slate-400 line-clamp-2">{description || 'No description provided.'}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 xs:gap-2 pt-3 xs:pt-4 text-xs text-slate-500">
        <span className="truncate">By {post.author?.name || 'Anonymous'}</span>
        <span className="flex-shrink-0">•</span>
        <span className="flex-shrink-0">{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
};

const SimpleLanding = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts');
        setPosts(response.data.posts || response.data || []);
      } catch (err) {
        console.error('Error fetching posts', err);
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const allTags = useMemo(() => {
    const s = new Set();
    posts.forEach((p) => (p.tags || []).forEach((t) => t && s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const byQuery = q
        ? (p.title || '').toLowerCase().includes(q) ||
          (p.content || '').toLowerCase().includes(q) ||
          (p.introduction || '').toLowerCase().includes(q)
        : true;
      const byTag = selectedTag ? (p.tags || []).includes(selectedTag) : true;
      return byQuery && byTag;
    });
  }, [posts, query, selectedTag]);

  const featured = useMemo(
    () => [...filteredPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3),
    [filteredPosts],
  );

  const featuredIds = useMemo(() => new Set(featured.map((f) => f._id)), [featured]);
  const recent = filteredPosts.filter((p) => !featuredIds.has(p._id));

  return (
    <SiteLayout>
      <section className="space-y-12 sm:space-y-16">
        <div className={`rounded-2xl sm:rounded-3xl lg:rounded-[32px] border border-ink-800 ${shimmer} px-4 xs:px-6 sm:px-8 lg:px-12 py-12 sm:py-14 lg:py-16 text-center`}>
          <p className="text-xs uppercase tracking-[0.3em] xs:tracking-[0.4em] text-slate-400">Editorial platform</p>
          <h1 className="mt-3 sm:mt-4 text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight px-2">
            Write bold stories with a premium dark canvas.
          </h1>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm xs:text-base text-slate-300 px-2 leading-relaxed">
            BlogSpace pairs glassmorphism with deep blues so your writing feels modern, legible, and immersive—on desktop or
            mobile.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row flex-wrap items-center justify-center gap-3 xs:gap-4">
            <Button as={Link} to={isAuthenticated ? '/create-post' : '/register'} className="w-full xs:w-auto">
              {isAuthenticated ? 'Start Writing' : 'Get Started'}
            </Button>
            {!isAuthenticated && (
              <Button as={Link} to="/login" variant="ghost" className="w-full xs:w-auto">
                Sign in
              </Button>
            )}
          </div>
          <div className="mt-8 sm:mt-10 flex flex-col xs:flex-row flex-wrap justify-center gap-4 xs:gap-6 text-left text-xs xs:text-sm text-slate-300">
            {['Frictionless editor', 'Glassmorphic layouts', 'Community readership'].map((item) => (
              <span key={item} className="flex items-center gap-2 justify-center xs:justify-start">
                <span className="h-2 w-2 rounded-full bg-blue-300 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr,3fr] xl:grid-cols-[280px,1fr]">
          <aside className="rounded-2xl sm:rounded-3xl border border-ink-800 bg-ink-900/70 p-4 xs:p-5 sm:p-6 shadow-card lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.25em] xs:tracking-[0.3em] text-slate-400">Filters</h2>
            <div className="mt-3 sm:mt-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Search</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl sm:rounded-2xl border border-ink-700 bg-ink-900/60 px-3">
                <span className="text-slate-500 text-sm">🔍</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find inspiring reads..."
                  className="flex-1 bg-transparent py-2.5 sm:py-3 text-xs xs:text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
            {allTags.length > 0 && (
              <div className="mt-5 sm:mt-6">
                <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Tags</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTag('')}
                    className={`rounded-full px-2.5 xs:px-3 py-1 text-xs transition-colors ${
                      selectedTag === '' ? 'bg-blue-400 text-ink-900' : 'bg-ink-800 text-slate-300 hover:bg-ink-700'
                    }`}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`rounded-full px-2.5 xs:px-3 py-1 text-xs transition-colors ${
                        selectedTag === tag ? 'bg-blue-400 text-ink-900' : 'bg-ink-800 text-slate-300 hover:text-blue-200 hover:bg-ink-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div id="blog-posts-section" className="space-y-6 sm:space-y-8 min-w-0">
            <div>
              <div className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] xs:tracking-[0.3em] text-slate-500">Featured</p>
                  <h2 className="text-xl xs:text-2xl font-semibold text-white mt-1">Top reads of the week</h2>
                </div>
                <Button variant="ghost" className="text-xs xs:text-sm w-full xs:w-auto justify-center">
                  View all
                </Button>
              </div>
              {error && (
                <div className="mt-4 rounded-xl sm:rounded-2xl border border-red-500/40 bg-red-500/10 p-3 xs:p-4 text-xs xs:text-sm text-red-200">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="h-40 xs:h-44 rounded-2xl sm:rounded-3xl border border-ink-800 bg-ink-900/40 animate-pulse" />
                  ))}
                </div>
              ) : featured.length === 0 ? (
                <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border border-dashed border-ink-700 p-6 xs:p-8 text-center text-sm xs:text-base text-slate-400">
                  No stories match that filter yet. {isAuthenticated ? 'Start the first one!' : 'Join to publish your first post.'}
                </div>
              ) : (
                <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                  {featured.map((post) => (
                    <PostCard key={post._id} post={post} badge="Editor's pick" />
                  ))}
                </div>
              )}
            </div>

            {recent.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                  <h3 className="text-base xs:text-lg font-semibold text-white">Latest drops</h3>
                  <span className="text-xs text-slate-500">{recent.length} articles</span>
                </div>
                <div className="grid gap-3 xs:gap-4 grid-cols-1 md:grid-cols-2">
                  {recent.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default SimpleLanding;
