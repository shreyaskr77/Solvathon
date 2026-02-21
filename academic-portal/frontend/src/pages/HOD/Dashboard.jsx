import React, { useState, useEffect } from 'react';
import { eventAPI, noticeAPI, fileAPI, subjectAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  DocumentPlusIcon, CalendarIcon, DocumentArrowUpIcon, MagnifyingGlassIcon,
  FunnelIcon, CheckCircleIcon, XCircleIcon, HomeIcon, PlusIcon, BookOpenIcon,
  ChartBarIcon, UserGroupIcon, ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const HODDashboard = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState('home');

  // Event state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploadingNotice, setUploadingNotice] = useState(false);

  // Note Upload state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteFile, setNoteFile] = useState(null);
  const [noteFileType, setNoteFileType] = useState('Notes');
  const [noteSubject, setNoteSubject] = useState('');
  const [uploadingNote, setUploadingNote] = useState(false);

  // Student Uploads state
  const [studentFiles, setStudentFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [subjects, setSubjects] = useState([]);

  // Pending files review state
  const [pendingFiles, setPendingFiles] = useState([]);
  const [filteredPendingFiles, setFilteredPendingFiles] = useState([]);
  const [searchPendingText, setSearchPendingText] = useState('');
  const [rejectingFileId, setRejectingFileId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    fileType: '',
    status: '',
    subject: '',
  });

  // Statistics state
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    noticesUploaded: 0,
    totalUploads: 0,
    approvedUploads: 0,
    pendingApprovals: 0
  });

  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = studentFiles;

    if (searchText) {
      filtered = filtered.filter(file =>
        file.title.toLowerCase().includes(searchText.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        file.uploadedBy?.userName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filters.fileType) {
      filtered = filtered.filter(file => file.fileType === filters.fileType);
    }

    if (filters.status) {
      filtered = filtered.filter(file => file.status === filters.status);
    }

    if (filters.subject) {
      filtered = filtered.filter(file => file.subjectIds && file.subjectIds.includes(filters.subject));
    }

    setFilteredFiles(filtered);
  }, [searchText, filters, studentFiles]);

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
    setLoading(true);
    try {
      const [filesRes, eventsRes, noticesRes, subjectsRes, pendingRes] = await Promise.all([
        fileAPI.getApprovedFiles({ limit: 1000 }),
        eventAPI.getEvents(),
        noticeAPI.getNotices(),
        subjectAPI.getAllSubjects({}),
        fileAPI.getPendingFiles()
      ]);

      const allFiles = filesRes.data.files || [];
      const eventsList = eventsRes.data.events || [];
      const noticesList = noticesRes.data.notices || [];
      const subjectsList = subjectsRes.data.subjects || [];
      const pendingFilesList = pendingRes.data.files || [];

      setStudentFiles(allFiles);
      setPendingFiles(pendingFilesList);
      setEvents(eventsList.slice(0, 5));
      setNotices(noticesList.slice(0, 5));
      setSubjects(subjectsList);

      const upcomingCount = eventsList.filter(e => new Date(e.date) > new Date()).length;

      setStats({
        upcomingEvents: upcomingCount,
        noticesUploaded: noticesList.length,
        totalUploads: allFiles.length,
        approvedUploads: allFiles.filter(f => f.status === 'Approved').length,
        pendingApprovals: pendingFilesList.length
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      if (!eventTitle.trim()) {
        toast.error('Event title is required');
        return;
      }
      if (!eventDate) {
        toast.error('Event date & time is required');
        return;
      }
      const payload = { title: eventTitle.trim(), description: eventDescription.trim(), date: eventDate, location: eventLocation.trim() };
      await eventAPI.createEvent(payload);
      toast.success('✅ Event created successfully');
      setEventTitle(''); setEventDescription(''); setEventDate(''); setEventLocation('');
      fetchAllData();
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to create event';
      toast.error(errorMsg);
      console.error('Create event error:', err?.response?.data || err?.message);
    }
  };

  const createNotice = async (e) => {
    e.preventDefault();
    if (!noticeTitle.trim()) {
      toast.error('Notice title is required');
      return;
    }
    if (!noticeContent.trim()) {
      toast.error('Notice content is required');
      return;
    }

    setUploadingNotice(true);
    try {
      const formData = new FormData();
      formData.append('title', noticeTitle.trim());
      formData.append('content', noticeContent.trim());
      attachments.forEach(file => formData.append('attachments', file));

      await noticeAPI.createNotice(formData);
      toast.success('✅ Notice broadcasted to Faculty & Students');
      setNoticeTitle('');
      setNoticeContent('');
      setAttachments([]);
      fetchAllData();
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to create notice';
      toast.error(errorMsg);
      console.error('Create notice error:', err?.response?.data || err?.message);
    } finally {
      setUploadingNotice(false);
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
      formData.append('subjectIds', JSON.stringify([noteSubject]));
      formData.append('file', noteFile);

      await fileAPI.uploadFile(formData);
      toast.success('✅ Notes uploaded successfully');
      setNoteTitle('');
      setNoteDescription('');
      setNoteFile(null);
      setNoteSubject('');
      setNoteFileType('Notes');
      fetchAllData();
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to upload notes';
      toast.error(errorMsg);
      console.error('Upload error:', err?.response?.data || err?.message);
    } finally {
      setUploadingNote(false);
    }
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ fileType: '', status: '', subject: '' });
    setSearchText('');
  };

  const approveFile = async (fileId) => {
    try {
      await fileAPI.approveFile(fileId);
      toast.success('File approved!');
      fetchAllData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve file');
    }
  };

  const rejectFile = async (fileId) => {
    try {
      await fileAPI.rejectFile(fileId, { rejectionReason });
      toast.success('File rejected!');
      setRejectingFileId(null);
      setRejectionReason('');
      fetchAllData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject file');
    }
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
          <h1 className="text-4xl font-bold mb-2 text-apple-text">HOD Dashboard</h1>
          <p className="text-apple-gray">Manage resources, review uploads, and oversee department activities</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { label: 'Pending Approvals', value: stats.pendingApprovals, icon: '⏳', bgColor: 'bg-orange-100' },
                { label: 'Approved Uploads', value: stats.approvedUploads, icon: '✅', bgColor: 'bg-green-100' },
                { label: 'Total Uploads', value: stats.totalUploads, icon: '📤', bgColor: 'bg-system-blue bg-opacity-10' },
                { label: 'Notices', value: stats.noticesUploaded, icon: '📛', bgColor: 'bg-purple-100' },
                { label: 'Upcoming Events', value: stats.upcomingEvents, icon: '🎉', bgColor: 'bg-pink-100' },
              ].map((stat, idx) => (
                <div key={idx} className={`card-apple ${stat.bgColor}`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-apple-text">{stat.value}</div>
                  <div className="text-sm text-apple-gray">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Notes */}
              <div className="card-apple lg:col-span-2">
                <h3 className="text-xl font-bold text-apple-text mb-6 flex items-center gap-2">
                  <DocumentArrowUpIcon className="w-6 h-6 text-system-blue" />
                  Recent Notes & Materials
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {studentFiles.filter(f => f.fileType === 'Notes').slice(0, 6).map(note => (
                    <div key={note._id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{note.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{note.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>👤 {note.uploadedBy?.userName || 'Unknown'}</span>
                            <span>📅 {formatDate(note.createdAt)}</span>
                            <span className={`px-2 py-1 rounded font-medium ${getStatusColor(note.status)}`}>{note.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {studentFiles.filter(f => f.fileType === 'Notes').length === 0 && (
                    <p className="text-center text-slate-500 py-6">No notes uploaded yet</p>
                  )}
                </div>
              </div>

              {/* Events & Notices */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {events.length > 0 ? events.slice(0, 3).map(ev => (
                      <div key={ev._id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                        <p className="font-semibold text-slate-800 text-sm">{ev.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{formatDate(ev.date)}</p>
                        <p className="text-xs text-slate-500">{ev.location}</p>
                      </div>
                    )) : <p className="text-sm text-slate-500">No upcoming events</p>}
                  </div>
                </div>

                {/* Recent Notices */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DocumentPlusIcon className="w-5 h-5 text-indigo-600" />
                    Recent Notices
                  </h3>
                  <div className="space-y-3">
                    {notices.length > 0 ? notices.slice(0, 3).map(n => (
                      <div key={n._id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                        <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    )) : <p className="text-sm text-slate-500">No notices yet</p>}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Create Event */}
              <div className="card-apple">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-system-blue p-3 rounded-apple-lg">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-apple-text">📅 Create Event</h3>
                </div>

                <form onSubmit={createEvent} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Event Title</label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      required
                      placeholder="e.g., Midterm Exams"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Description</label>
                    <textarea
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Describe the event..."
                      rows="3"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Location</label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="e.g., Main Campus, Auditorium"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-apple w-full"
                  >
                    🎉 Create Event
                  </button>
                </form>
              </div>

              {/* Upload Notice */}
              <div className="card-apple">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-500 p-3 rounded-apple-lg">
                    <DocumentPlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-apple-text">📋 Upload Notice</h3>
                </div>

                <form onSubmit={createNotice} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Notice Title</label>
                    <input
                      type="text"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      required
                      placeholder="e.g., Important Notice"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Content</label>
                    <textarea
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      required
                      placeholder="Notice content..."
                      rows="3"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Attachments</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                    />
                    {attachments.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">✓ {attachments.length} file(s) selected</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={uploadingNotice}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-apple-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingNotice ? '⏳ Broadcasting...' : '📤 Upload & Broadcast'}
                  </button>
                </form>
              </div>

              {/* Upload Notes */}
              <div className="card-apple">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-system-blue p-3 rounded-apple-lg">
                    <DocumentArrowUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-apple-text">📚 Upload Notes</h3>
                </div>

                <form onSubmit={uploadNote} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Note Title</label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      required
                      placeholder="e.g., Unit 1 - Introduction"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Description</label>
                    <textarea
                      value={noteDescription}
                      onChange={(e) => setNoteDescription(e.target.value)}
                      placeholder="Brief description of the notes..."
                      rows="3"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Subject</label>
                    <select
                      value={noteSubject}
                      onChange={(e) => setNoteSubject(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map(subj => (
                        <option key={subj._id} value={subj._id}>{subj.subjectName || subj.subjectCode}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">File Type</label>
                    <select
                      value={noteFileType}
                      onChange={(e) => setNoteFileType(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    >
                      <option value="Notes">📚 Class Notes</option>
                      <option value="Assignment">📋 Assignment</option>
                      <option value="PYQ">📝 Previous Year Questions</option>
                      <option value="Circular">📢 Circular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Upload File</label>
                    <input
                      type="file"
                      onChange={(e) => setNoteFile(e.target.files[0])}
                      required
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.png"
                      className="w-full p-3 border border-gray-200 rounded-apple-lg focus:ring-2 focus:ring-system-blue outline-none transition"
                    />
                    {noteFile && (
                      <p className="text-sm text-system-blue mt-2">✓ {noteFile.name}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={uploadingNote}
                    className="btn-apple w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingNote ? '⏳ Uploading...' : '📤 Upload Notes'}
                  </button>
                </form>
              </div>
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
              {/* Search Bar */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by title, description, or student name..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition"
                  >
                    Clear All
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">File Type</label>
                    <select
                      name="fileType"
                      value={filters.fileType}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="Notes">Notes</option>
                      <option value="Assignment">Assignment</option>
                      <option value="PYQ">Previous Years</option>
                      <option value="Circular">Circular</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={filters.subject}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="">All Subjects</option>
                      {subjects.map(subj => (
                        <option key={subj._id} value={subj._id}>{subj.subjectName || subj.subjectCode}</option>
                      ))}
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

              {/* File List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 text-lg">
                  {filteredFiles.length} file(s) found
                </h3>

                {filteredFiles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto">
                    {filteredFiles.map((file) => (
                      <div key={file._id} className="p-6 border-2 border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-lg">{file.title}</h4>
                            <p className="text-slate-600 mt-2 text-sm">{file.description}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                              <span className="text-slate-600">📤 {file.uploadedBy?.userName}</span>
                              <span className="text-slate-600">📅 {formatDate(file.createdAt)}</span>
                              <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(file.status)}`}>{file.status}</span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{file.fileType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">
                      {searchText || Object.values(filters).some(f => f) ? '❌ No files match your search or filters' : '📭 No files in repository'}
                    </p>
                  </div>
                )}

                {filteredFiles.length > 0 && (
                  <p className="text-sm text-slate-600 text-center mt-6">
                    Showing {filteredFiles.length} of {studentFiles.length} total uploads
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HODDashboard;
