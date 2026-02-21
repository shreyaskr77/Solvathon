import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Subject APIs
export const subjectAPI = {
  getAllSubjects: (params) => API.get('/subjects', { params }),
  createSubject: (data) => API.post('/subjects', data),
  updateSubject: (id, data) => API.put(`/subjects/${id}`, data),
  deleteSubject: (id) => API.delete(`/subjects/${id}`),
};

// File APIs
export const fileAPI = {
  uploadFile: (formData) => API.post('/files/upload', formData),
  getApprovedFiles: (params) => API.get('/files/approved', { params }),
  getPendingFiles: () => API.get('/files/pending'),
  getUserFiles: () => API.get('/files/my-uploads'),
  getFileById: (id) => API.get(`/files/${id}`),
  approveFile: (id) => API.put(`/files/${id}/approve`),
  rejectFile: (id, data) => API.put(`/files/${id}/reject`, data),
  updateVersion: (id, formData) => API.put(`/files/${id}/update-version`, formData),
  rateFile: (id, data) => API.post(`/files/${id}/rate`, data),
  downloadFile: (id) => API.post(`/files/${id}/download`),
};

// User APIs
export const userAPI = {
  bookmarkFile: (data) => API.post('/notifications/bookmark', data),
  removeBookmark: (fileId) => API.delete(`/notifications/bookmark/${fileId}`),
  getBookmarks: () => API.get('/notifications/bookmarks'),
  getNotifications: () => API.get('/notifications'),
  markNotificationRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/mark-all-read'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUserStatistics: () => API.get('/admin/user-statistics'),
};

// Event APIs (HOD)
export const eventAPI = {
  createEvent: (data) => API.post('/events', data),
  getEvents: () => API.get('/events'),
  deleteEvent: (id) => API.delete(`/events/${id}`),
};

// Notice APIs (HOD)
export const noticeAPI = {
  createNotice: (formData) => API.post('/notices', formData),
  getNotices: () => API.get('/notices'),
  deleteNotice: (id) => API.delete(`/notices/${id}`),
};

export default API;