import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const Subjects = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, code: 'CS101', name: 'Data Structures', faculty: 'Dr. Smith', semester: '3rd', credits: 4 },
    { id: 2, code: 'CS102', name: 'Database Management', faculty: 'Prof. Johnson', semester: '4th', credits: 4 },
    { id: 3, code: 'CS103', name: 'Web Development', faculty: 'Dr. Williams', semester: '4th', credits: 3 },
    { id: 4, code: 'CS104', name: 'Operating Systems', faculty: 'Dr. Brown', semester: '5th', credits: 4 },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    faculty: '',
    semester: '',
    credits: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    if (formData.code && formData.name) {
      const newSubject = {
        id: subjects.length + 1,
        ...formData,
        credits: parseInt(formData.credits),
      };
      setSubjects([...subjects, newSubject]);
      setFormData({ code: '', name: '', faculty: '', semester: '', credits: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setFormData(subject);
  };

  const handleUpdate = () => {
    setSubjects(subjects.map(subject =>
      subject.id === editingId ? { ...subject, ...formData } : subject
    ));
    setEditingId(null);
    setFormData({ code: '', name: '', faculty: '', semester: '', credits: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2"> Manage Subjects</h1>
          <p className="text-gray-600">Add and manage academic subjects</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <PlusIcon className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Subject' : 'Add New Subject'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="code"
              placeholder="Subject Code (e.g., CS101)"
              value={formData.code}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="name"
              placeholder="Subject Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="faculty"
              placeholder="Faculty Name"
              value={formData.faculty}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="semester"
              placeholder="Semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              name="credits"
              placeholder="Credits"
              value={formData.credits}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ code: '', name: '', faculty: '', semester: '', credits: '' });
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-6 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Faculty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Semester</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Credits</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-indigo-600">{subject.code}</td>
                <td className="px-6 py-4 text-gray-900">{subject.name}</td>
                <td className="px-6 py-4 text-gray-600">{subject.faculty}</td>
                <td className="px-6 py-4 text-gray-600">{subject.semester}</td>
                <td className="px-6 py-4 text-gray-600">{subject.credits}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(subject)}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {subjects.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No subjects found. Add one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Subjects;
