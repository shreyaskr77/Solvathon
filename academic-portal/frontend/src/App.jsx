import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthContext } from './context/AuthContext';

// Layout & Protection
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Approvals from './pages/Admin/Approvals';
import HODDashboard from './pages/HOD/Dashboard';
import FacultyDashboard from './pages/Faculty/Dashboard';
import FacultyUpload from './pages/Faculty/Upload';
import FacultyMyUploads from './pages/Faculty/MyUploads';
import StudentDashboard from './pages/Student/Dashboard';
import StudentBrowse from './pages/Student/Browse';
import StudentBookmarks from './pages/Student/Bookmarks';
import StudentUpload from './pages/Student/Upload';
import Events from './pages/Events';
import Notices from './pages/Notices';
import UploadNotes from './pages/UploadNotes';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Academic Portal</h1>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/dashboard" />} 
        />

        {/* Protected Dashboard - Auto-redirect by role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'HOD' ? (
                <Navigate to="/hod" />
              ) : user?.role === 'Admin' ? (
                <Navigate to="/approvals" />
              ) : user?.role === 'Faculty' ? (
                <Navigate to="/faculty/dashboard" />
              ) : (
                <Navigate to="/student/dashboard" />
              )}
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Faculty"]}>
              <DashboardLayout>
                <FacultyDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/upload"
          element={
            <ProtectedRoute allowedRoles={["Faculty"]}>
              <DashboardLayout>
                <FacultyUpload />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/my-uploads"
          element={
            <ProtectedRoute allowedRoles={["Faculty"]}>
              <DashboardLayout>
                <FacultyMyUploads />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/files"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <DashboardLayout>
                <StudentBrowse />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/bookmarks"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <DashboardLayout>
                <StudentBookmarks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/upload"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <DashboardLayout>
                <StudentUpload />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Upload Notes (HOD & Faculty) */}
        <Route
          path="/upload/notes"
          element={
            <ProtectedRoute allowedRoles={["HOD","Faculty"]}>
              <DashboardLayout>
                <UploadNotes />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Events & Notices (all authenticated users) */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Events />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notices"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Notices />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin/HOD Routes */}
        <Route
          path="/approvals"
          element={
            <ProtectedRoute allowedRoles={["Admin","HOD"]}>
              <DashboardLayout>
                <Approvals />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* HOD Dashboard */}
        <Route
          path="/hod"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <DashboardLayout>
                <HODDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback Routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;