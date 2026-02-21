import React, { useState, useEffect } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { fileAPI, subjectAPI } from '../../services/api';
import toast from 'react-hot-toast';

const StudentUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    subjectIds: [],
    fileType: 'Notes',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fileTypes = ['Notes', 'Assignment', 'PYQ', 'Other'];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getAllSubjects();
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error('Failed to load subjects', err);
      toast.error('Failed to load subjects');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || formData.subjectIds.length === 0 || !file) {
      toast.error('Please fill in all required fields and select at least one subject');
      return;
    }

    try {
      setUploading(true);
      toast.loading('Uploading file...');

      const fd = new FormData();
      fd.append('title', formData.title);
      // Append subjectIds as a JSON string for the backend to parse
      fd.append('subjectIds', JSON.stringify(formData.subjectIds));
      fd.append('fileType', formData.fileType);
      fd.append('description', formData.description);
      fd.append('file', file);

      await fileAPI.uploadFile(fd);

      toast.dismiss();
      toast.success('File uploaded! Waiting for faculty approval.');

      setFormData({ title: '', subjectIds: [], fileType: 'Notes', description: '' });
      setFile(null);
    } catch (err) {
      toast.dismiss();
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Upload failed';
      toast.error(`Upload failed: ${msg}`);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900  mb-2">📚 Upload Notes</h1>
        <p className="text-gray-600 ">Share your study materials with other students</p>
      </div>

      <div className="bg-white  rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Content Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Chapter 1-3 Notes, Assignment Solution"
              className="w-full border border-gray-300  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700  mb-2">
                Subjects (Select one or more) *
              </label>
              <div className="w-full border border-gray-300  rounded-lg p-2 max-h-40 overflow-y-auto space-y-2 bg-white ">
                {subjects.length === 0 ? (
                  <p className="text-sm text-gray-500  p-2">Loading subjects...</p>
                ) : (
                  subjects.map((subj) => (
                    <label key={subj._id} className="flex items-center space-x-2 p-1 hover:bg-gray-50  rounded cursor-pointer">
                      <input
                        type="checkbox"
                        value={subj._id}
                        checked={formData.subjectIds.includes(subj._id)}
                        onChange={(e) => {
                          const id = e.target.value;
                          setFormData(prev => {
                            const newIds = e.target.checked
                              ? [...prev.subjectIds, id]
                              : prev.subjectIds.filter(s => s !== id);
                            return { ...prev, subjectIds: newIds };
                          });
                        }}
                        className="rounded border-gray-300  text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span className="text-gray-700  text-sm">
                        {subj.subjectName || subj.subjectCode}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700  mb-2">
                Content Type
              </label>
              <select
                name="fileType"
                value={formData.fileType}
                onChange={handleInputChange}
                className="w-full border border-gray-300  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {fileTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the content, topics covered, etc."
              rows="4"
              className="w-full border border-gray-300  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Upload File (PDF, DOC, DOCX, images) *
            </label>
            <div className="border-2 border-dashed border-gray-300  rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.pptx,.xlsx,.xls"
              />
              <label htmlFor="fileInput" className="cursor-pointer block">
                <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-900  font-semibold">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-500  text-sm">
                  PDF, DOC, DOCX, PPTX (Max 10MB)
                </p>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {uploading ? 'Uploading...' : 'Upload Content'}
          </button>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Upload Guidelines</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✓ Notes will be reviewed by faculty before appearing to other students</li>
          <li>✓ Ensure content is accurate and properly formatted</li>
          <li>✓ Avoid plagiarism and respect copyright</li>
          <li>✓ Files must be under 10MB</li>
          <li>✓ Use descriptive titles for better searchability</li>
          <li>✓ Faculty can reject low-quality or inappropriate content</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentUpload;
