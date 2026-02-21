import React, { useState, useEffect } from 'react';
import { fileAPI, eventAPI, noticeAPI, subjectAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  HomeIcon, PlusIcon, BookOpenIcon, ClipboardDocumentListIcon,
  DocumentArrowUpIcon, MagnifyingGlassIcon, CalendarIcon, DocumentPlusIcon,
  CheckCircleIcon, XCircleIcon, HeartIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Upload states - Notes
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteFile, setNoteFile] = useState(null);
  const [noteFileType, setNoteFileType] = useState('Notes');
  const [noteSubject, setNoteSubject] = useState('');
  const [uploadingNote, setUploadingNote] = useState(false);

  // Data states
  const [subjects, setSubjects] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [approvedFiles, setApprovedFiles] = useState([]);

  // Filter & search states
  const [searchText, setSearchText] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
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

  // Apply search and filters for repository section
  useEffect(() => {
    let filtered = approvedFiles;

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

    setFilteredFiles(filtered);
  }, [searchText, filters, approvedFiles]);

  const fetchAllData = async () => {
    try {
      const [notesRes, eventsRes, noticesRes, subjectsRes, approvedRes] = await Promise.all([
        fileAPI.getUserFiles(),
        eventAPI.getEvents(),
        noticeAPI.getNotices(),
        subjectAPI.getAllSubjects({}),
        fileAPI.getApprovedFiles({ limit: 100 })
      ]);

      const notes = notesRes.data.files || [];
      const eventsList = eventsRes.data.events || [];
      const noticesList = noticesRes.data.notices || [];
      const subjectsList = subjectsRes.data.subjects || [];
      const approved = approvedRes.data.files || [];

      setAllNotes(notes);
      setEvents(eventsList.slice(0, 5));
      setNotices(noticesList.slice(0, 5));
      setSubjects(subjectsList);
      setApprovedFiles(approved);

      setStats({
        totalUploads: notes.length,
        approvedUploads: notes.filter(f => f.status === 'Approved').length,
        pendingApprovals: notes.filter(f => f.status === 'Pending').length,
        downloadCount: notes.reduce((sum, f) => sum + (f.downloads || 0), 0)
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
    if (!noteTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setUploadingNote(true);
    try {
      const formData = new FormData();
      formData.append('title', noteTitle.trim());
      formData.append('description', noteDescription.trim());
      formData.append('fileType', noteFileType);
      formData.append('subjectId', noteSubject);
      formData.append('file', noteFile);

      await fileAPI.uploadFile(formData);
      toast.success('Notes uploaded successfully! Waiting for approval.');
      setNoteTitle('');
      setNoteDescription('');
      setNoteFile(null);
      setNoteSubject('');
      setNoteFileType('Notes');
      fetchAllData();
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to upload notes';
      toast.error(errorMsg);
      console.error('Upload error:', err);
    } finally {
      setUploadingNote(false);
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
    { id: 'bookmarks', label: 'Bookmarks', icon: HeartIcon },
    { id: 'repository', label: 'Smart Repository', icon: BookOpenIcon },
  ];

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-apple-text">Student Dashboard</h1>
          <p className="text-apple-gray">Manage resources, review uploads, and oversee learning activities</p>
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
                  {allNotes.slice(0, 6).map(file => (
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
                  {allNotes.length === 0 && (
                    <p className="text-center text-slate-500 py-6">No uploads yet</p>
                  )}
                </div>
              </div>

              {/* Events & Notices */}
              <div className="space-y-6">
                {/* Events */}
                <div className="card-apple">
                  <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-system-blue" />
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
                <div className="card-apple">
                  <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center gap-2">
                    <DocumentPlusIcon className="w-5 h-5 text-system-blue" />
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
            <h2 className="text-2xl font-bold text-apple-text mb-8">Upload Center</h2>

            <div className="max-w-2xl">
              {/* Upload Notes */}
              <div className="card-apple">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-system-blue bg-opacity-10 flex items-center justify-center">
                    <DocumentArrowUpIcon className="w-6 h-6 text-system-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-apple-text">Upload Notes & Materials</h3>
                    <p className="text-sm text-apple-gray">Share educational content with your classmates</p>
                  </div>
                </div>

                <form onSubmit={uploadNote} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Title *</label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      required
                      placeholder="e.g., Chapter 5 Summary"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Description</label>
                    <textarea
                      value={noteDescription}
                      onChange={(e) => setNoteDescription(e.target.value)}
                      placeholder="Brief description of the content..."
                      rows="3"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Subject *</label>
                    <select
                      value={noteSubject}
                      onChange={(e) => setNoteSubject(e.target.value)}
                      required
                      className="w-full"
                    >
                      <option value="">Choose a subject...</option>
                      {subjects.length > 0 ? subjects.map(subj => (
                        <option key={subj._id} value={subj._id}>{subj.subjectName}</option>
                      )) : <option disabled>No subjects available</option>}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-apple-text mb-2">Material Type *</label>
                      <select
                        value={noteFileType}
                        onChange={(e) => setNoteFileType(e.target.value)}
                        className="w-full"
                      >
                        <option value="Notes">📚 Class Notes</option>
                        <option value="Assignment">📋 Assignment</option>
                        <option value="PYQ">📝 Previous Year Question</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-apple-text mb-2">File *</label>
                      <input
                        type="file"
                        onChange={(e) => {
                          setNoteFile(e.target.files[0]);
                          if (e.target.files[0]) {
                            toast.success(`Selected: ${e.target.files[0].name}`);
                          }
                        }}
                        required
                        accept=".pdf,.doc,.docx,.pptx,.xlsx,.jpg,.jpeg,.png"
                        className="w-full"
                      />
                      {noteFile && <p className="text-xs text-apple-gray mt-2">✓ {noteFile.name}</p>}
                    </div>
                  </div>

                  <div className="bg-system-blue bg-opacity-5 border border-system-blue border-opacity-30 p-4 rounded-apple-lg">
                    <p className="text-sm text-apple-text">📌 <strong>Note:</strong> Your upload will be reviewed by HOD/Admin and published once approved.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingNote}
                    className="btn-apple w-full"
                  >
                    {uploadingNote ? '⏳ Uploading...' : '📤 Upload Materials'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* BOOKMARKS TAB */}
        {activeTab === 'bookmarks' && (
          <div>
            <h2 className="text-2xl font-bold text-apple-text mb-8">My Bookmarks</h2>

            <div className="card-apple">
              {approvedFiles && approvedFiles.length > 0 ? (
                <div className="space-y-3">
                  {approvedFiles.map(file => (
                    <div key={file._id} className="p-4 border border-gray-200 rounded-apple-lg hover:shadow-apple-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-apple-text">{file.title}</h4>
                          <p className="text-sm text-apple-gray mt-1">{file.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-apple-gray">
                            <span>📅 {formatDate(file.createdAt)}</span>
                            <span>👁️ {file.views || 0} views</span>
                            <span>⬇️ {file.downloads || 0} downloads</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={file.fileUrl}
                            download
                            className="px-4 py-2 bg-system-blue hover:bg-system-blue-hover text-white text-sm rounded-apple-lg transition"
                          >
                            📥 Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-apple-gray">No bookmarks yet</p>
                  <p className="text-sm text-apple-gray mt-2">Browse files in Smart Repository and bookmark your favorites</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SMART REPOSITORY TAB */}
        {activeTab === 'repository' && (
          <div>
            <h2 className="text-2xl font-bold text-apple-text mb-8">Smart Repository</h2>

            <div className="card-apple">
              {/* Search & Filters */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray" />
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search files..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    />
                  </div>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-apple-bg hover:bg-gray-300 text-apple-text rounded-apple-lg font-medium transition"
                  >
                    Clear All
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-apple-bg rounded-apple-lg border border-gray-200">
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">File Type</label>
                    <select
                      name="fileType"
                      value={filters.fileType}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="Notes">Notes</option>
                      <option value="Assignment">Assignment</option>
                      <option value="PYQ">PYQ</option>
                      <option value="Circular">Circular</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Active Filters</label>
                    <div className="p-3 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700">
                      {Object.values(filters).filter(f => f).length || 0} filter(s) applied
                    </div>
                  </div>
                </div>
              </div>

              {/* Files Grid */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 text-lg">
                  {filteredFiles.length} file(s) found
                </h3>

                {filteredFiles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto">
                    {filteredFiles.map((file) => (
                      <div key={file._id} className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-lg">{file.title}</h4>
                            <p className="text-slate-600 mt-2 text-sm">{file.description}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                              <span className="text-slate-600">👤 {file.uploadedBy?.userName || 'Unknown'}</span>
                              <span className="text-slate-600">📅 {formatDate(file.createdAt)}</span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{file.fileType}</span>
                              <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(file.status)}`}>{file.status}</span>
                              <span className="text-slate-600">📥 {file.downloads || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">
                      {searchText || Object.values(filters).some(f => f) ? '❌ No files match your search' : '📭 No files available'}
                    </p>
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

export default StudentDashboard;