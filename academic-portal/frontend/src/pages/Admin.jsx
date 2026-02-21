import React, { useState, useEffect } from 'react';
import { fileAPI, eventAPI, noticeAPI, subjectAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import {
  HomeIcon, DocumentTextIcon, CheckCircleIcon, AcademicCapIcon,
  UsersIcon, BarChartIcon, MagnifyingGlassIcon, XCircleIcon,
  CalendarIcon, DocumentPlusIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // Data states
  const [pendingFiles, setPendingFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedFileId, setSelectedFileId] = useState(null);
  
  // Filter & search states
  const [searchText, setSearchText] = useState('');
  const [filteredPending, setFilteredPending] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    totalFiles: 0,
    pendingApprovals: 0,
    totalSubjects: 0,
    approvedFiles: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  // Apply search filters for pending files
  useEffect(() => {
    let filtered = pendingFiles;
    if (searchText) {
      filtered = filtered.filter(file =>
        file.title.toLowerCase().includes(searchText.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredPending(filtered);
  }, [searchText, pendingFiles]);

  const fetchAllData = async () => {
    try {
      const [filesRes, pendingRes, subjectsRes, eventsRes, noticesRes] = await Promise.all([
        fileAPI.getAllFiles?.() || Promise.resolve({ data: { files: [] } }),
        fileAPI.getPendingFiles?.() || Promise.resolve({ data: { files: [] } }),
        subjectAPI.getAllSubjects({}),
        eventAPI.getEvents(),
        noticeAPI.getNotices()
      ]);

      const allFilesList = filesRes.data?.files || [];
      const pendingList = pendingRes.data?.files || [];
      const subjectsList = subjectsRes.data.subjects || [];
      const eventsList = eventsRes.data.events || [];
      const noticesList = noticesRes.data.notices || [];

      setAllFiles(allFilesList);
      setPendingFiles(pendingList);
      setSubjects(subjectsList);
      setEvents(eventsList.slice(0, 5));
      setNotices(noticesList.slice(0, 5));

      setStats({
        totalFiles: allFilesList.length,
        pendingApprovals: pendingList.length,
        totalSubjects: subjectsList.length,
        approvedFiles: allFilesList.filter(f => f.status === 'Approved').length
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const addSubject = async (e) => {
    e.preventDefault();
    if (!subjectName || !subjectCode) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await subjectAPI.createSubject({ subjectName, subjectCode });
      toast.success('Subject added successfully');
      setSubjectName('');
      setSubjectCode('');
      fetchAllData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add subject');
    }
  };

  const approveFile = async (fileId) => {
    try {
      await fileAPI.approveFile(fileId);
      toast.success('File approved');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to approve file');
    }
  };

  const rejectFile = async (fileId) => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await fileAPI.rejectFile(fileId, { reason: rejectionReason });
      toast.success('File rejected');
      setRejectionReason('');
      setSelectedFileId(null);
      fetchAllData();
    } catch (err) {
      toast.error('Failed to reject file');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'approvals', label: 'Approvals', icon: CheckCircleIcon },
    { id: 'subjects', label: 'Subjects', icon: AcademicCapIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChartIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-violet-100">Manage content, approvals, and system resources</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white  border-b border-slate-200  shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-violet-600 border-violet-600'
                      : 'text-slate-600  border-transparent hover:text-violet-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
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
                { label: 'Total Files', value: stats.totalFiles, icon: '📄', color: 'from-blue-400 to-cyan-500' },
                { label: 'Pending Approvals', value: stats.pendingApprovals, icon: '⏳', color: 'from-yellow-400 to-orange-500' },
                { label: 'Approved Files', value: stats.approvedFiles, icon: '✅', color: 'from-green-400 to-emerald-500' },
                { label: 'Total Subjects', value: stats.totalSubjects, icon: '🎓', color: 'from-purple-400 to-pink-500' },
              ].map((stat, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending Approvals */}
              <div className="bg-white  rounded-xl shadow-md border border-slate-200  p-6 lg:col-span-2">
                <h3 className="text-xl font-bold text-slate-800  mb-6 flex items-center gap-2">
                  <CheckCircleIcon className="w-6 h-6 text-violet-600" />
                  Recent Pending Approvals
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingFiles.slice(0, 6).map(file => (
                    <div key={file._id} className="p-4 border border-slate-100  rounded-lg hover:bg-slate-50  transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 ">{file.title}</h4>
                          <p className="text-sm text-slate-600  mt-1">{file.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 ">
                            <span>👤 {file.uploadedBy?.userName || 'Unknown'}</span>
                            <span>📅 {formatDate(file.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingFiles.length === 0 && (
                    <p className="text-center text-slate-500  py-6">No pending approvals</p>
                  )}
                </div>
              </div>

              {/* Events & Notices */}
              <div className="space-y-6">
                {/* Recent Events */}
                <div className="bg-white  rounded-xl shadow-md border border-slate-200  p-6">
                  <h3 className="text-lg font-bold text-slate-800  mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-violet-600" />
                    Events
                  </h3>
                  <div className="space-y-3">
                    {events.length > 0 ? events.slice(0, 3).map(ev => (
                      <div key={ev._id} className="p-3 border border-slate-100  rounded-lg hover:bg-slate-50 ">
                        <p className="font-semibold text-slate-800  text-sm">{ev.title}</p>
                        <p className="text-xs text-slate-600  mt-1">{formatDate(ev.date)}</p>
                      </div>
                    )) : <p className="text-sm text-slate-500 ">No events</p>}
                  </div>
                </div>

                {/* Recent Notices */}
                <div className="bg-white  rounded-xl shadow-md border border-slate-200  p-6">
                  <h3 className="text-lg font-bold text-slate-800  mb-4 flex items-center gap-2">
                    <DocumentPlusIcon className="w-5 h-5 text-violet-600" />
                    Notices
                  </h3>
                  <div className="space-y-3">
                    {notices.length > 0 ? notices.slice(0, 3).map(n => (
                      <div key={n._id} className="p-3 border border-slate-100  rounded-lg hover:bg-slate-50 ">
                        <p className="font-semibold text-slate-800  text-sm">{n.title}</p>
                        <p className="text-xs text-slate-600  mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    )) : <p className="text-sm text-slate-500 ">No notices</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800  mb-8">Review & Approve Files</h2>
            
            <div className="bg-white  rounded-xl shadow-md border border-slate-200  p-8">
              {/* Search */}
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchText} 
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search files..." 
                      className="w-full pl-10 pr-4 py-3 border border-slate-300  rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition"
                    />
                  </div>
                  <div className="px-6 py-3 bg-violet-100 text-violet-800 rounded-lg font-medium">
                    {filteredPending.length} pending
                  </div>
                </div>
              </div>

              {/* Pending Files */}
              <div className="space-y-6">
                {filteredPending.length > 0 ? (
                  filteredPending.map((file) => (
                    <div key={file._id} className="p-6 border-2 border-slate-200  rounded-lg hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800  text-lg">{file.title}</h4>
                          <p className="text-slate-600  mt-2">{file.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600 ">
                            <span>👤 {file.uploadedBy?.userName || 'Unknown'}</span>
                            <span>📅 {formatDate(file.createdAt)}</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{file.fileType}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Reason Input */}
                      {selectedFileId === file._id && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <label className="block text-sm font-semibold text-slate-700  mb-2">Rejection Reason</label>
                          <textarea 
                            value={rejectionReason} 
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Explain why this file is being rejected..."
                            rows="3"
                            className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (selectedFileId === file._id) {
                              rejectFile(file._id);
                            } else {
                              setSelectedFileId(file._id);
                            }
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
                        >
                          {selectedFileId === file._id ? 'Confirm Rejection' : 'Reject'}
                        </button>
                        <button
                          onClick={() => approveFile(file._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                        >
                          Approve
                        </button>
                        {selectedFileId === file._id && (
                          <button
                            onClick={() => setSelectedFileId(null)}
                            className="px-6 bg-slate-300 hover:bg-slate-400 text-slate-800  font-semibold rounded-lg transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500  text-lg">✅ No pending files to review</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBJECTS TAB */}
        {activeTab === 'subjects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Subject Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800  mb-6">Add New Subject</h2>
              
              <div className="bg-white  rounded-xl shadow-md border border-slate-200  p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-3 rounded-lg">
                    <AcademicCapIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 ">New Subject</h3>
                </div>

                <form onSubmit={addSubject} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700  mb-2">Subject Name</label>
                    <input 
                      type="text" 
                      value={subjectName} 
                      onChange={(e) => setSubjectName(e.target.value)} 
                      required 
                      placeholder="e.g., Data Structures"
                      className="w-full p-3 border border-slate-300  rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700  mb-2">Subject Code</label>
                    <input 
                      type="text" 
                      value={subjectCode} 
                      onChange={(e) => setSubjectCode(e.target.value)} 
                      required 
                      placeholder="e.g., CS201"
                      className="w-full p-3 border border-slate-300  rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                  >
                    Add Subject
                  </button>
                </form>
              </div>
            </div>

            {/* Existing Subjects */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-800  mb-6">Existing Subjects ({subjects.length})</h2>
              
              <div className="bg-white  rounded-xl shadow-md border border-slate-200  p-8">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <div key={subject._id} className="p-4 border-2 border-slate-200  rounded-lg hover:border-violet-300 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 ">{subject.subjectName}</h4>
                            <p className="text-sm text-slate-600  mt-1">Code: {subject.subjectCode}</p>
                          </div>
                          <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
                            Active
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500  py-6">No subjects added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800  mb-8">System Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Content Overview */}
              <div className="bg-white  rounded-xl shadow-md border border-slate-200  p-8">
                <h3 className="text-xl font-bold text-slate-800  mb-6">Content Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="text-slate-800  font-semibold">Total Files Uploaded</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.totalFiles}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="text-slate-800  font-semibold">Approved Files</span>
                    <span className="text-2xl font-bold text-green-600">{stats.approvedFiles}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <span className="text-slate-800  font-semibold">Pending Review</span>
                    <span className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <span className="text-slate-800  font-semibold">Total Subjects</span>
                    <span className="text-2xl font-bold text-purple-600">{stats.totalSubjects}</span>
                  </div>
                </div>
              </div>

              {/* File Distribution */}
              <div className="bg-white  rounded-xl shadow-md border border-slate-200  p-8">
                <h3 className="text-xl font-bold text-slate-800  mb-6">File Types Distribution</h3>
                <div className="space-y-4">
                  {[
                    { type: 'Notes', count: allFiles.filter(f => f.fileType === 'Notes').length, color: 'blue' },
                    { type: 'Assignments', count: allFiles.filter(f => f.fileType === 'Assignment').length, color: 'green' },
                    { type: 'PYQ', count: allFiles.filter(f => f.fileType === 'PYQ').length, color: 'yellow' },
                    { type: 'Circulars', count: allFiles.filter(f => f.fileType === 'Circular').length, color: 'purple' },
                  ].map((item) => (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-700  font-semibold">{item.type}</span>
                        <span className="text-slate-600 ">{item.count} files</span>
                      </div>
                      <div className={`w-full h-3 bg-${item.color}-100 rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full bg-${item.color}-600`}
                          style={{ width: `${stats.totalFiles > 0 ? (item.count / stats.totalFiles) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
