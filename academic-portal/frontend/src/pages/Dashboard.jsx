import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AcademicCapIcon, DocumentIcon, UserGroupIcon, FireIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Downloads', value: '1,234', icon: DocumentIcon, color: 'bg-blue-500' },
    { label: 'Uploads', value: '45', icon: AcademicCapIcon, color: 'bg-purple-500' },
    { label: 'Bookmarks', value: '23', icon: FireIcon, color: 'bg-orange-500' },
    { label: 'Ratings', value: '4.8⭐', icon: UserGroupIcon, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
        <p className="text-indigo-100">Role: <span className="font-semibold">{user?.role}</span> | Department: <span className="font-semibold">{user?.department}</span></p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition">
            📤 Upload Files
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition">
            📑 Browse Resources
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
            ⭐ View Ratings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start gap-4 pb-3 border-b last:border-0">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {item}
              </div>
              <div>
                <p className="font-medium text-gray-900">File approved and published</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
