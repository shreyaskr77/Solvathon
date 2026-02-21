import React, { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { fileAPI } from '../../services/api';

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewFile, setViewFile] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await fileAPI.getPendingFiles();
      setApprovals(res.data.files || []);
    } catch (err) {
      console.error('Failed to load pending files', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await fileAPI.approveFile(id);
      setApprovals((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error('Approve failed', err);
      alert('Approve failed');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return; // cancelled
    try {
      await fileAPI.rejectFile(id, { reason });
      setApprovals((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error('Reject failed', err);
      alert('Reject failed');
    }
  };

  if (loading) return <div className="p-6">Loading pending files...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900  mb-2">📋 Pending Uploads</h1>
        <p className="text-gray-600 ">Review student uploads and approve or reject them</p>
      </div>

      <div className="bg-white  rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100  border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 ">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 ">Uploaded By</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 ">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 ">Uploaded At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((file) => (
              <tr key={file._id} className="border-b hover:bg-gray-50  transition">
                <td className="px-6 py-4 text-gray-900  font-medium">{file.title}</td>
                <td className="px-6 py-4 text-gray-600 ">{file.uploadedBy?.userName}</td>
                <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{file.fileType}</span></td>
                <td className="px-6 py-4 text-gray-600  text-sm">{new Date(file.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewFile(file)}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                      title="View file"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleApprove(file._id)}
                      className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition"
                      title="Approve"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(file._id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                      title="Reject"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {approvals.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-600 ">No pending files</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white  rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-900  mb-4">{viewFile.title}</h2>
            <div className="space-y-2 mb-6">
              <p><span className="font-semibold">Uploaded By:</span> {viewFile.uploadedBy?.userName}</p>
              <p><span className="font-semibold">Type:</span> {viewFile.fileType}</p>
              <p><span className="font-semibold">Description:</span> {viewFile.description}</p>
              <p><span className="font-semibold">Uploaded At:</span> {new Date(viewFile.createdAt).toLocaleString()}</p>
              {viewFile.versions && viewFile.versions[viewFile.currentVersion - 1] && (
                <div className="mt-4">
                  <a href={`http://localhost:5000/${viewFile.versions[viewFile.currentVersion - 1].filePath.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold">Open File</a>
                </div>
              )}
            </div>
            <button
              onClick={() => setViewFile(null)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900  font-semibold py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
