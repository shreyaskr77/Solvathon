import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, HeartIcon as HeartOutline, StarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { fileAPI, subjectAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Browse = () => {
  const [files, setFiles] = useState([
    { id: 1, title: 'DBMS Complete Notes', subject: 'Database Management', faculty: 'Dr. Smith', downloads: 342, rating: 4.8, type: 'Notes', bookmarked: false },
    { id: 2, title: 'DS Assignment Solutions', subject: 'Data Structures', faculty: 'Prof. Johnson', downloads: 289, rating: 4.6, type: 'Assignment', bookmarked: false },
    { id: 3, title: '2023 OS Final Exam', subject: 'Operating Systems', faculty: 'Dr. Williams', downloads: 276, rating: 4.5, type: 'PYQ', bookmarked: false },
    { id: 4, title: 'Web Dev Project Guide', subject: 'Web Development', faculty: 'Dr. Brown', downloads: 234, rating: 4.7, type: 'Notes', bookmarked: false },
    { id: 5, title: 'CN Lecture Handouts', subject: 'Computer Networks', faculty: 'Prof. Davis', downloads: 198, rating: 4.4, type: 'Notes', bookmarked: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [subjectsList, setSubjectsList] = useState([]);
  const [myUploads, setMyUploads] = useState([]);

  const subjects = ['All', 'Data Structures', 'Database Management', 'Web Development', 'Operating Systems', 'Computer Networks'];
  const types = ['All', 'Notes', 'Assignment', 'PYQ'];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || file.type === filterType;
    const matchesSubject = filterSubject === 'All' || file.subject === filterSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const handleBookmark = (id) => {
    setFiles(files.map(file =>
      file.id === id ? { ...file, bookmarked: !file.bookmarked } : file
    ));
  };

  const handleDownload = (id) => {
    alert('File download initiated!');
  };

  const fetchMyUploads = async () => {
    try {
      const res = await fileAPI.getUserFiles();
      setMyUploads(res.data.files || []);
    } catch (err) {
      console.error('Failed to fetch my uploads', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getAllSubjects();
      const list = res.data.subjects || [];
      setSubjectsList(list);
    } catch (err) {
      console.error('Failed to load subjects', err);
    }
  };

  useEffect(() => {
    fetchMyUploads();
    fetchSubjects();
  }, []);

  const handleFileChange = (e) => {
    setUploadFile(e.target.files?.[0] || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
      toast.error('Please provide a title and choose a file.');
      return;
    }
    if (!uploadSubject) {
      toast.error('Please select a subject before uploading.');
      return;
    }
    try {
      setUploading(true);
      toast.loading('Uploading file...');
      const fd = new FormData();
      fd.append('title', uploadTitle);
      fd.append('subjectIds', JSON.stringify([uploadSubject]));
      fd.append('fileType', uploadType);
      fd.append('file', uploadFile);

      console.log('Uploading with:', { title: uploadTitle, subjectIds: [uploadSubject], fileType: uploadType, fileName: uploadFile.name });

      const res = await fileAPI.uploadFile(fd);
      console.log('Upload response:', res);

      toast.dismiss();
      toast.success('Upload successful! Waiting for faculty approval.');
      setUploadTitle('');
      setUploadFile(null);
      setUploadType('Notes');
      fetchMyUploads();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.dismiss();
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Upload failed';
      toast.error(`Upload failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2"> Browse Content</h1>
        <p className="text-gray-600">Explore study materials shared by faculty</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Subject</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All</option>
              {subjectsList.map(s => (
                <option key={s._id} value={s.subjectName || s.subjectCode || s._id}>{s.subjectName || s.subjectCode || s._id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* My Uploads Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-3">My Uploads</h2>
          {myUploads.length === 0 ? (
            <p className="text-sm text-slate-600">You haven't uploaded any files yet. <a href="/student/upload" className="text-indigo-600 hover:underline">Upload your first file</a></p>
          ) : (
            <ul className="space-y-2">
              {myUploads.map(u => (
                <li key={u._id} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{u.title}</p>
                      <p className="text-xs text-gray-600">{u.fileType} • {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${u.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        u.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {(u.status || 'pending').charAt(0).toUpperCase() + (u.status || 'pending').slice(1)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => (
            <div key={file.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{file.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">By {file.faculty}</p>
                </div>
                <button
                  onClick={() => handleBookmark(file.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition"
                >
                  {file.bookmarked ? (
                    <HeartIcon className="w-6 h-6 text-red-600" />
                  ) : (
                    <HeartOutline className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{file.subject}</span>
                <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">{file.type}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{file.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(file.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">{file.rating}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No files found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
