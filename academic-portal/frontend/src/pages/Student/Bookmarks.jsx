import React, { useState } from 'react';
import { TrashIcon, ArrowDownTrayIcon, StarIcon } from '@heroicons/react/24/outline';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: 'DBMS Complete Notes', subject: 'Database Management', faculty: 'Dr. Smith', downloads: 342, rating: 4.8, type: 'Notes', savedDate: '2024-01-25' },
    { id: 2, title: 'DS Assignment Solutions', subject: 'Data Structures', faculty: 'Prof. Johnson', downloads: 289, rating: 4.6, type: 'Assignment', savedDate: '2024-01-24' },
    { id: 3, title: '2023 OS Final Exam', subject: 'Operating Systems', faculty: 'Dr. Williams', downloads: 276, rating: 4.5, type: 'PYQ', savedDate: '2024-01-23' },
  ]);

  const handleRemove = (id) => {
    if (confirm('Remove this bookmark?')) {
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    }
  };

  const handleDownload = (id) => {
    alert('File download initiated!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2"> My Bookmarks</h1>
        <p className="text-gray-600">Files you've saved for later</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {bookmarks.length} {bookmarks.length === 1 ? 'file' : 'files'} saved
        </h2>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map(bookmark => (
            <div
              key={bookmark.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-red-500"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{bookmark.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">By {bookmark.faculty}</p>
                  <p className="text-xs text-gray-500 mt-2">Saved on {bookmark.savedDate}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{bookmark.subject}</span>
                <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">{bookmark.type}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{bookmark.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(bookmark.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">{bookmark.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(bookmark.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleRemove(bookmark.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">No bookmarks yet!</p>
          <p className="text-gray-500">Browse content and save files you like to view them later</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
