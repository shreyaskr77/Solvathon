import React, { useState } from 'react';
import { DocumentArrowUpIcon, LinkIcon, BeakerIcon } from '@heroicons/react/24/outline';

const UploadNotes = () => {
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('Notes');

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-apple-lg bg-system-blue/10 mb-4">
          <DocumentArrowUpIcon className="w-8 h-8 text-system-blue" />
        </div>
        <h2 className="text-3xl font-bold text-apple-text mb-2">Upload New Resource</h2>
        <p className="text-apple-gray text-sm max-w-lg mx-auto">
          Share your notes, assignments, or question papers securely with the student repository.
        </p>
      </div>

      <div className="card-apple !p-8 shadow-apple-lg border-white/50 bg-white/60 backdrop-blur-xl">
        <form className="space-y-6">

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-apple-text mb-2">Resource Title</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Unit 1 Notes: Data Structures"
                className="w-full pl-4 pr-4 py-3 bg-white/50 border border-gray-200 rounded-apple-lg focus:bg-white focus:ring-2 focus:ring-system-blue focus:border-transparent outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-2">Category</label>
              <select
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-apple-lg focus:bg-white focus:ring-2 focus:ring-system-blue outline-none transition-all appearance-none cursor-pointer"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              >
                <option value="Notes">📚 Class Notes</option>
                <option value="Assignment">📋 Assignment</option>
                <option value="PYQ">📝 Question Paper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-2">Visibility</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-apple-lg text-apple-gray cursor-not-allowed">
                Faculty Only (Auto-Approved)
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-apple-text mb-2">Attachment</label>
            <div className="relative border-2 border-dashed border-system-blue/30 bg-system-blue/5 rounded-apple-lg hover:bg-system-blue/10 hover:border-system-blue/50 transition-colors group cursor-pointer">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 mb-3 rounded-full bg-white shadow-apple-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-6 h-6 text-system-blue" />
                </div>
                <h4 className="text-apple-text font-semibold mb-1">Click to browse or drag file here</h4>
                <p className="text-xs text-apple-gray">Supports PDF, DOCX, PPTX (Max 20MB)</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              className="btn-apple w-full py-4 text-base shadow-apple-md hover:shadow-apple-lg hover:-translate-y-0.5"
            >
              Upload Resource to Repository
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadNotes;