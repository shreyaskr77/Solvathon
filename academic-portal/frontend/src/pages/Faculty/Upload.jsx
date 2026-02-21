import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    fileType: 'Notes',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.subject && file) {
      setSuccess(true);
      setFormData({ title: '', subject: '', fileType: 'Notes', description: '' });
      setFile(null);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  const subjects = [
    'Data Structures',
    'Database Management',
    'Web Development',
    'Operating Systems',
    'Computer Networks',
  ];

  const fileTypes = ['Notes', 'Assignment', 'PYQ', 'Other'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900  mb-2"> Upload Content</h1>
        <p className="text-gray-600 ">Share your study materials with students</p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg">
           File uploaded successfully! Pending admin approval.
        </div>
      )}

      <div className="bg-white  rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700  mb-2">
              Content Title
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
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full border border-gray-300  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
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
              Upload File (PDF, DOC, DOCX, images)
            </label>
            <div className="border-2 border-dashed border-gray-300  rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.pptx"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Upload Content
          </button>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ Upload Guidelines</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li> Ensure content is accurate and properly formatted</li>
          <li> Avoid plagiarism and respect copyright</li>
          <li> Files must be under 10MB</li>
          <li> Content must be approved by admin before appearing</li>
          <li> Use descriptive titles for better searchability</li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;
