import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminLayout from '../components/ui/AdminLayout';
import Button from '../components/ui/Button';

const SIDEBAR = [
  { id: 'overview', label: 'Overview', icon: '🏠', path: '/admin/dashboard' },
  { id: 'posts', label: 'Posts', icon: '📝', path: '/admin/posts' },
  { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
];

export default function AdminUsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data?.users ?? []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          (user._id ?? user.id) === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Unable to update role', error);
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm('Remove this user and their posts?');
    if (!confirmed) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((user) => (user._id ?? user.id) !== userId));
    } catch (error) {
      console.error('Unable to delete user', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    regularUsers: users.filter((u) => u.role === 'user').length,
  };

  return (
    <AdminLayout sidebarItems={SIDEBAR} current="users">
      <section className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-50">User Management</h1>
          <p className="text-sm text-slate-200 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-6 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6">
          <p className="text-sm text-slate-200">Total Users</p>
          <p className="text-3xl font-semibold text-slate-50 mt-2">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6">
          <p className="text-sm text-slate-200">Administrators</p>
          <p className="text-3xl font-semibold text-slate-50 mt-2">{stats.admins}</p>
        </div>
        <div className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6">
          <p className="text-sm text-slate-200">Regular Users</p>
          <p className="text-3xl font-semibold text-slate-50 mt-2">{stats.regularUsers}</p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-ink-600 bg-ink-900/60 text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 rounded-lg border border-ink-600 bg-ink-900/60 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>
      </section>

      {/* Users Table */}
      <section className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6">
        {loading ? (
          <div className="text-center text-slate-200 py-10">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-700 p-6 text-center text-slate-300">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-50">
              <thead>
                <tr className="text-slate-200 border-b border-ink-700">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const id = user._id ?? user.id;
                  return (
                    <tr key={id} className="border-t border-ink-700/60 hover:bg-ink-700/40">
                      <td className="py-3 px-4 text-slate-50">{user.name}</td>
                      <td className="py-3 px-4 text-slate-200">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(id, e.target.value)}
                          className="rounded-full border border-ink-600 bg-ink-900/60 px-3 py-1 text-xs capitalize text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          className="px-3 py-1 text-xs border border-danger/60 text-danger hover:bg-danger/10"
                          onClick={() => deleteUser(id)}
                        >
                          Remove
                        </Button>
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
