import React, { useState } from 'react';
import { TrashIcon, EyeIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

const MyUploads = () => {
  const [uploads, setUploads] = useState([
    { id: 1, title: 'DBMS Chapter 1-5 Notes', subject: 'Database Management', type: 'Notes', uploadDate: '2024-01-25', downloads: 156, status: 'Approved' },
    { id: 2, title: 'Assignment 3 Solution', subject: 'Data Structures', type: 'Assignment', uploadDate: '2024-01-24', downloads: 89, status: 'Approved' },
    { id: 3, title: '2023 Final Exam QP', subject: 'Operating Systems', type: 'PYQ', uploadDate: '2024-01-20', downloads: 234, status: 'Pending' },
    { id: 4, title: 'Web Dev Project Guide', subject: 'Web Development', type: 'Notes', uploadDate: '2024-01-18', downloads: 76, status: 'Rejected' },
  ]);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setUploads(uploads.filter(upload => upload.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 flex items-center gap-1"><CheckIcon className="w-4 h-4" /> Approved</span>;
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 flex items-center gap-1"><ClockIcon className="w-4 h-4" /> Pending</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2"> My Uploads</h1>
        <p className="text-gray-600">Manage your uploaded content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Uploads</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{uploads.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Approved</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{uploads.filter(u => u.status === 'Approved').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{uploads.filter(u => u.status === 'Pending').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{upload.title}</td>
                <td className="px-6 py-4 text-gray-600">{upload.subject}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{upload.type}</span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(upload.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(upload.id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {uploads.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No uploads yet. Start sharing your content!</p>
        </div>
      )}
    </div>
  );
};

export default MyUploads;
