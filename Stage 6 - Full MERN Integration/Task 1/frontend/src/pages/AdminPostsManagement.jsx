import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AdminLayout from '../components/ui/AdminLayout';
import Button from '../components/ui/Button';

const SIDEBAR = [
  { id: 'overview', label: 'Overview', icon: '🏠', path: '/admin/dashboard' },
  { id: 'posts', label: 'Posts', icon: '📝', path: '/admin/posts' },
  { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
];

export default function AdminPostsManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/admin/posts');
      setPosts(data?.posts ?? []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePostStatus = async (postId, status) => {
    const nextStatus = status === 'published' ? 'draft' : 'published';
    try {
      await api.put(`/admin/posts/${postId}`, { status: nextStatus });
      setPosts((prev) =>
        prev.map((post) =>
          (post._id ?? post.id) === postId ? { ...post, status: nextStatus } : post
        )
      );
    } catch (error) {
      console.error('Unable to update post status', error);
    }
  };

  const deletePost = async (postId) => {
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) return;
    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => (post._id ?? post.id) !== postId));
    } catch (error) {
      console.error('Unable to delete post', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout sidebarItems={SIDEBAR} current="posts">
      <section className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-50">Manage Posts</h1>
          <p className="text-sm text-slate-200 mt-1">
            Create, edit, and manage all blog posts
          </p>
        </div>
        <Button as={Link} to="/create-post">
          New Post
        </Button>
      </section>

      {/* Search and Filter */}
      <section className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-ink-600 bg-ink-900/60 text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-ink-600 bg-ink-900/60 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </section>

      {/* Posts Table */}
      <section className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6">
        {loading ? (
          <div className="text-center text-slate-200 py-10">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-700 p-6 text-center text-slate-300">
            No posts found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-50">
              <thead>
                <tr className="text-slate-200 border-b border-ink-700">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => {
                  const id = post._id ?? post.id;
                  return (
                    <tr key={id} className="border-t border-ink-700/60 hover:bg-ink-700/40">
                      <td className="py-3 px-4 text-slate-50">{post.title}</td>
                      <td className="py-3 px-4">
                        <span className="rounded-full bg-ink-800 px-3 py-1 text-xs capitalize text-slate-200">
                          {post.status ?? 'draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-200">{post.views ?? '—'}</td>
                      <td className="py-3 px-4 text-slate-200">
                        {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : 'n/a'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            as={Link}
                            to={`/post/${id}`}
                            variant="ghost"
                            className="px-3 py-1 text-xs"
                          >
                            View
                          </Button>
                          <Button
                            as={Link}
                            to={`/edit-post/${id}`}
                            variant="secondary"
                            className="px-3 py-1 text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            className="px-3 py-1 text-xs"
                            onClick={() => togglePostStatus(id, post.status)}
                          >
                            {post.status === 'published' ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            variant="ghost"
                            className="px-3 py-1 text-xs border border-danger/60 text-danger hover:bg-danger/10"
                            onClick={() => deletePost(id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
