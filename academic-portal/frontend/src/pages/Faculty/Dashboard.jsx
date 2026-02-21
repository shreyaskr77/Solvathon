import React, { useState, useEffect } from 'react';
import { fileAPI, eventAPI, noticeAPI, subjectAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  HomeIcon, PlusIcon, BookOpenIcon, ClipboardDocumentListIcon,
  DocumentArrowUpIcon, CalendarIcon, DocumentPlusIcon, MagnifyingGlassIcon,
  CheckCircleIcon, XCircleIcon
} from '@heroicons/react/24/outline';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Upload state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteFile, setNoteFile] = useState(null);
  const [noteFileType, setNoteFileType] = useState('Notes');
  const [noteSubject, setNoteSubject] = useState('');

  // Data states
  const [subjects, setSubjects] = useState([]);
  const [myUploads, setMyUploads] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [approvedFiles, setApprovedFiles] = useState([]);

  // Review state
  const [pendingFiles, setPendingFiles] = useState([]);
  const [filteredPendingFiles, setFilteredPendingFiles] = useState([]);
  const [searchPendingText, setSearchPendingText] = useState('');
  const [rejectingFileId, setRejectingFileId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter & search states
  const [searchText, setSearchText] = useState('');
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [filters, setFilters] = useState({ fileType: '', status: '' });

  // Statistics
  const [stats, setStats] = useState({
    totalUploads: 0,
    approvedUploads: 0,
    pendingApprovals: 0,
    downloadCount: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  // Apply search and filters
  useEffect(() => {
    let filtered = myUploads;

    if (searchText) {
      filtered = filtered.filter(file =>
        file.title.toLowerCase().includes(searchText.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filters.fileType) {
      filtered = filtered.filter(file => file.fileType === filters.fileType);
    }

    if (filters.status) {
      filtered = filtered.filter(file => file.status === filters.status);
    }

    setFilteredUploads(filtered);
  }, [searchText, filters, myUploads]);

  // Apply search filter for pending files
  useEffect(() => {
    let filtered = pendingFiles;

    if (searchPendingText) {
      filtered = filtered.filter(file =>
        file.title.toLowerCase().includes(searchPendingText.toLowerCase()) ||
        file.uploadedBy?.userName?.toLowerCase().includes(searchPendingText.toLowerCase())
      );
    }

    setFilteredPendingFiles(filtered);
  }, [searchPendingText, pendingFiles]);

  const fetchAllData = async () => {
    try {
      const [uploadsRes, eventsRes, noticesRes, subjectsRes, approvedRes, pendingRes] = await Promise.all([
        fileAPI.getUserFiles(),
        eventAPI.getEvents(),
        noticeAPI.getNotices(),
        subjectAPI.getAllSubjects({}),
        fileAPI.getApprovedFiles({ limit: 100 }),
        fileAPI.getPendingFiles()
      ]);

      const uploads = uploadsRes.data.files || [];
      const eventsList = eventsRes.data.events || [];
      const noticesList = noticesRes.data.notices || [];
      const subjectsList = subjectsRes.data.subjects || [];
      const approved = approvedRes.data.files || [];
      const pendingList = pendingRes.data.files || [];

      setMyUploads(uploads);
      setEvents(eventsList.slice(0, 5));
      setNotices(noticesList.slice(0, 5));
      setSubjects(subjectsList);
      setApprovedFiles(approved);
      setPendingFiles(pendingList);

      setStats({
        totalUploads: uploads.length,
        approvedUploads: uploads.filter(f => f.status === 'Approved').length,
        pendingApprovals: pendingList.length,
        downloadCount: uploads.reduce((sum, f) => sum + (f.downloads || 0), 0)
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const uploadNote = async (e) => {
    e.preventDefault();
    if (!noteFile) {
      toast.error('Please select a file to upload');
      return;
    }
    if (!noteSubject) {
      toast.error('Please select a subject');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', noteTitle);
      formData.append('description', noteDescription);
      formData.append('fileType', noteFileType);
      formData.append('subjectIds', JSON.stringify([noteSubject]));
      formData.append('file', noteFile);

      await fileAPI.uploadFile(formData);
      toast.success('Notes uploaded successfully');
      setNoteTitle(''); setNoteDescription(''); setNoteFile(null);
      setNoteSubject(''); setNoteFileType('Notes');
      fetchAllData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload notes');
    }
  };

  const approveFile = async (id) => {
    try {
      await fileAPI.approveFile(id);
      toast.success('File approved successfully');
      fetchAllData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve file');
    }
  };

  const rejectFile = async (id) => {
    if (!rejectionReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await fileAPI.rejectFile(id, { reason: rejectionReason });
      toast.success('File rejected successfully');
      setRejectingFileId(null);
      setRejectionReason('');
      fetchAllData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject file');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ fileType: '', status: '' });
    setSearchText('');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'upload', label: 'Upload Center', icon: PlusIcon },
    { id: 'review', label: 'Review Uploads', icon: ClipboardDocumentListIcon },
    { id: 'repository', label: 'Smart Repository', icon: BookOpenIcon },
  ];

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-apple-text">Faculty Dashboard</h1>
          <p className="text-apple-gray">Manage resources, review uploads, and oversee teaching materials</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 py-6 bg-apple-bg/80 backdrop-blur-md">
        <div className="flex justify-center w-full px-4">
          <div className="inline-flex gap-2 p-2 bg-white/60 border border-gray-200/50 rounded-full shadow-apple-md backdrop-blur-xl overflow-x-auto max-w-full hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap
                    ${isActive
                      ? 'text-system-blue bg-white shadow-apple-sm scale-105'
                      : 'text-apple-gray hover:text-apple-text hover:bg-black/5'}
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Uploads', value: stats.totalUploads, icon: '📤', bgColor: 'bg-system-blue bg-opacity-10' },
                { label: 'Approved', value: stats.approvedUploads, icon: '✅', bgColor: 'bg-green-100' },
                { label: 'Pending', value: stats.pendingApprovals, icon: '⏳', bgColor: 'bg-orange-100' },
                { label: 'Downloads', value: stats.downloadCount, icon: '📥', bgColor: 'bg-purple-100' },
              ].map((stat, idx) => (
                <div key={idx} className={`card-apple ${stat.bgColor}`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-apple-text">{stat.value}</div>
                  <div className="text-sm text-apple-gray">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Uploads & Events/Notices */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Uploads */}
              <div className="card-apple lg:col-span-2">
                <h3 className="text-xl font-bold text-apple-text mb-6 flex items-center gap-2">
                  <DocumentArrowUpIcon className="w-6 h-6 text-system-blue" />
                  Recent Uploads
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {myUploads.slice(0, 6).map(file => (
                    <div key={file._id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{file.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{file.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>📅 {formatDate(file.createdAt)}</span>
                            <span className={`px-2 py-1 rounded font-medium ${getStatusColor(file.status)}`}>{file.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {myUploads.length === 0 && (
                    <p className="text-center text-slate-500 py-6">No uploads yet</p>
                  )}
                </div>
              </div>

              {/* Events & Notices */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                    Events
                  </h3>
                  <div className="space-y-3">
                    {events.length > 0 ? events.slice(0, 3).map(ev => (
                      <div key={ev._id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                        <p className="font-semibold text-slate-800 text-sm">{ev.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{formatDate(ev.date)}</p>
                      </div>
                    )) : <p className="text-sm text-slate-500">No events</p>}
                  </div>
                </div>

                {/* Notices */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DocumentPlusIcon className="w-5 h-5 text-green-600" />
                    Notices
                  </h3>
                  <div className="space-y-3">
                    {notices.length > 0 ? notices.slice(0, 3).map(n => (
                      <div key={n._id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                        <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    )) : <p className="text-sm text-slate-500">No notices</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD CENTER TAB */}
        {activeTab === 'upload' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Upload Study Materials</h2>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
                  <DocumentArrowUpIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Upload Notes</h3>
              </div>

              <form onSubmit={uploadNote} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Note Title</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    required
                    placeholder="e.g., Chapter 5 - Advanced Concepts"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                    placeholder="Describe your study materials..."
                    rows="3"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(subj => (
                      <option key={subj._id} value={subj._id}>{subj.subjectName || subj.subjectCode}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">File Type</label>
                  <select
                    value={noteFileType}
                    onChange={(e) => setNoteFileType(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  >
                    <option value="Notes">Notes</option>
                    <option value="Assignment">Assignment</option>
                    <option value="PYQ">Previous Years</option>
                    <option value="Circular">Circular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Upload File</label>
                  <input
                    type="file"
                    onChange={(e) => setNoteFile(e.target.files[0])}
                    required
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.png"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                  />
                  {noteFile && (
                    <p className="text-sm text-green-600 mt-2">✓ {noteFile.name}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                >
                  Upload Notes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* REVIEW UPLOADS TAB */}
        {activeTab === 'review' && (
          <div>
            <h2 className="text-2xl font-bold text-apple-text mb-8">Review Student Uploads</h2>

            <div className="card-apple">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchPendingText}
                      onChange={(e) => setSearchPendingText(e.target.value)}
                      placeholder="Search by file title or student name..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg font-semibold whitespace-nowrap">
                    {filteredPendingFiles.length} pending
                  </div>
                </div>
              </div>

              {/* Pending Files */}
              <div className="space-y-4">
                {filteredPendingFiles.length > 0 ? (
                  filteredPendingFiles.map((file) => (
                    <div key={file._id} className="p-6 border-2 border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all bg-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-lg">{file.title}</h4>
                          <p className="text-slate-600 mt-2">{file.description}</p>

                          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                            <span className="text-slate-600">👤 <strong>{file.uploadedBy?.name || file.uploadedBy?.userName || 'Unknown'}</strong></span>
                            <span className="text-slate-600">📅 {formatDate(file.createdAt)}</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{file.fileType}</span>
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">{file.status}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-max">
                          <button
                            onClick={() => approveFile(file._id)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                            Approve
                          </button>
                          {rejectingFileId === file._id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Rejection reason..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                              />
                              <button
                                onClick={() => rejectFile(file._id)}
                                disabled={!rejectionReason}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                              >
                                Send
                              </button>
                              <button
                                onClick={() => { setRejectingFileId(null); setRejectionReason(''); }}
                                className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-4 py-2 rounded text-sm font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRejectingFileId(file._id)}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium justify-center"
                            >
                              <XCircleIcon className="w-5 h-5" />
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">
                      {searchPendingText ? '❌ No files match your search' : '✅ No pending files to review'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SMART REPOSITORY TAB */}
        {activeTab === 'repository' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Smart Repository</h2>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search approved materials..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 text-lg">
                  {approvedFiles.length} approved file(s)
                </h3>

                {approvedFiles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto">
                    {approvedFiles.slice(0, 10).map((file) => (
                      <div key={file._id} className="p-6 border-2 border-slate-200 rounded-lg hover:border-green-300 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-lg">{file.title}</h4>
                            <p className="text-slate-600 mt-2 text-sm">{file.description}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                              <span className="text-slate-600">👤 {file.uploadedBy?.userName || 'Unknown'}</span>
                              <span className="text-slate-600">📅 {formatDate(file.createdAt)}</span>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ Approved</span>
                              <span className="text-slate-600">📥 {file.downloads || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">No approved files available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
