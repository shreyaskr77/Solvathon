import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { UserGroupIcon, DocumentIcon, ArrowDownTrayIcon, StarIcon } from '@heroicons/react/24/outline';

const Analytics = () => {
  const uploadData = [
    { date: 'Jan 1', uploads: 4 },
    { date: 'Jan 8', uploads: 3 },
    { date: 'Jan 15', uploads: 5 },
    { date: 'Jan 22', uploads: 4 },
    { date: 'Jan 29', uploads: 6 },
  ];

  const downloadData = [
    { date: 'Jan 1', downloads: 240 },
    { date: 'Jan 8', downloads: 221 },
    { date: 'Jan 15', downloads: 229 },
    { date: 'Jan 22', downloads: 200 },
    { date: 'Jan 29', downloads: 290 },
  ];

  const stats = [
    { label: 'Total Users', value: '342', icon: UserGroupIcon, color: 'bg-blue-500' },
    { label: 'Total Files', value: '189', icon: DocumentIcon, color: 'bg-purple-500' },
    { label: 'Total Downloads', value: '1,234', icon: ArrowDownTrayIcon, color: 'bg-green-500' },
    { label: 'Avg Rating', value: '4.6', icon: StarIcon, color: 'bg-yellow-500' },
  ];

  const mostDownloaded = [
    { title: 'DBMS Complete Notes', downloads: 342 },
    { title: 'Data Structures Assignment', downloads: 289 },
    { title: 'Previous Year QP 2022', downloads: 276 },
    { title: 'Operating Systems Guide', downloads: 234 },
    { title: 'Web Dev Resources', downloads: 198 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900  mb-2"> Analytics Dashboard</h1>
        <p className="text-gray-600 ">Portal activity and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white  rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600  text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900  mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white  rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900  mb-4">Weekly Uploads</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={uploadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uploads" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white  rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900  mb-4">Weekly Downloads</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={downloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="downloads" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white  rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900  mb-4">Most Downloaded Files</h2>
        <div className="space-y-3">
          {mostDownloaded.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50  rounded-lg hover:bg-gray-100  transition">
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-indigo-600">#{index + 1}</span>
                <span className="font-medium text-gray-900 ">{file.title}</span>
              </div>
              <span className="font-semibold text-gray-900 ">{file.downloads} downloads</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white  rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">Users by Role</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Admins</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex justify-between">
              <span>Faculty</span>
              <span className="font-semibold">34</span>
            </div>
            <div className="flex justify-between">
              <span>Students</span>
              <span className="font-semibold">303</span>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">Files by Type</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Notes</span>
              <span className="font-semibold">78</span>
            </div>
            <div className="flex justify-between">
              <span>Assignments</span>
              <span className="font-semibold">56</span>
            </div>
            <div className="flex justify-between">
              <span>PYQs</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between">
              <span>Circulars</span>
              <span className="font-semibold">10</span>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">Top Content</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Avg Rating</span>
              <span className="font-semibold">4.6</span>
            </div>
            <div className="flex justify-between">
              <span>Approval Rate</span>
              <span className="font-semibold">92%</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users</span>
              <span className="font-semibold">248</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
