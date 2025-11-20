import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import SiteLayout from "../components/SiteLayout";

const SimpleLanding = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data.posts || response.data || []);
    } catch (error) {
      setError("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const allTags = useMemo(() => {
    const s = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => t && s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(p => {
      const byQuery = q ? ((p.title || "").toLowerCase().includes(q) || (p.content || "").toLowerCase().includes(q) || (p.introduction || "").toLowerCase().includes(q)) : true;
      const byTag = selectedTag ? (p.tags || []).includes(selectedTag) : true;
      return byQuery && byTag;
    });
  }, [posts, query, selectedTag]);

  const featured = useMemo(() => {
    return [...filteredPosts].sort((a,b) => (b.views||0) - (a.views||0)).slice(0,3);
  }, [filteredPosts]);

  const recent = useMemo(() => {
    const ids = new Set(featured.map(f => f._id));
    return filteredPosts.filter(p => !ids.has(p._id));
  }, [filteredPosts, featured]);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ background: 'radial-gradient(1200px 600px at 10% 10%, #3b82f640, transparent), radial-gradient(900px 500px at 90% 20%, #7c3aed40, transparent)' }}></div>
        <div className="container-custom py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Write, Publish, Discover</h1>
            <p className="mt-4 text-gray-600">Create, share, and explore stories from a calm, premium blog platform built for creativity.</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              {isAuthenticated ? (
                <Link to="/create-post" className="btn btn-primary btn-lg">Start Writing</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                  <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
                </>
              )}
            </div>
          </div>
          <div className="mt-10 max-w-xl mx-auto">
            <input
              className="form-input w-full"
              placeholder="Search posts by title, intro or content"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {allTags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                <button className={`btn btn-sm ${selectedTag ? 'btn-secondary' : ''}`} onClick={() => setSelectedTag("")}>All</button>
                {allTags.map(t => (
                  <button key={t} className={`btn btn-sm ${selectedTag === t ? '' : 'btn-secondary'}`} onClick={() => setSelectedTag(t)}>{t}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="blog-posts-section" className="container-custom py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest Stories</h2>
          <p className="text-gray-600">Discover amazing content from our community of writers</p>
        </div>

        {error && (
          <div className="rounded-lg p-4 border border-red-200 bg-red-50 text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="loading mx-auto"></div>
            <p className="mt-2">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center">
            <div className="card">
              <h3 className="text-lg font-semibold">No posts yet</h3>
              <p className="text-gray-600">Be the first to share your story!</p>
              {isAuthenticated ? (
                <Link to="/create-post" className="btn mt-3">Write First Post</Link>
              ) : (
                <Link to="/register" className="btn mt-3">Join Our Community</Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {featured.map((post) => (
                  <Link key={post._id} to={`/post/${post._id}`} className="block">
                    <div className="card hover-lift">
                      <div className="text-xs text-gray-500 mb-2">Featured</div>
                      <h3 className="post-title">{post.title || post.heading}</h3>
                      <p className="post-excerpt">
                        {post.introduction || (post.content?.length > 150 ? `${post.content.substring(0, 150)}...` : post.content)}
                      </p>
                      <div className="post-meta">
                        <span>By {post.author?.name || 'Anonymous'}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recent.map((post) => (
                <Link key={post._id} to={`/post/${post._id}`} className="block">
                  <div className="card hover-soft">
                    <h3 className="post-title">{post.title || post.heading}</h3>
                    <p className="post-excerpt">
                      {post.introduction || (post.content?.length > 150 ? `${post.content.substring(0, 150)}...` : post.content)}
                    </p>
                    <div className="post-meta">
                      <span>By {post.author?.name || 'Anonymous'}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
};

export default SimpleLanding;
