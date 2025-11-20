import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import ActivityTable from '../components/ActivityTable';

const UserDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Fetch user stats and recent activity
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await fetch('/api/user/stats');
        const activityResponse = await fetch('/api/user/activity');

        setStats(await statsResponse.json());
        setRecentActivity(await activityResponse.json());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Posts" value={stats.posts || 0} />
        <StatsCard title="Comments" value={stats.comments || 0} />
        <StatsCard title="Likes" value={stats.likes || 0} />
      </div>

      {/* Recent Activity Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ActivityTable data={recentActivity} />
      </div>

      {/* Navigation Links */}
      <div className="mt-6">
        <Link to="/posts" className="btn btn-primary">View My Posts</Link>
        <Link to="/settings" className="btn btn-secondary ml-4">Account Settings</Link>
      </div>
    </div>
  );
};

export default UserDashboard;