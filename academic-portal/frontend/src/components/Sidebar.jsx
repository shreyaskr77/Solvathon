import React from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navigationLinks = {
    Admin: [
      { id: "admin-1", label: "Approvals", path: "/approvals", icon: "✓" },
      { id: "admin-2", label: "Subjects", path: "/admin/subjects", icon: "📚" },
      { id: "admin-3", label: "Events", path: "/events", icon: "📅" },
      { id: "admin-4", label: "Notices", path: "/notices", icon: "📢" },
      { id: "admin-5", label: "Analytics", path: "/admin/analytics", icon: "📊" },
    ],
    HOD: [
      { id: "hod-1", label: "Approvals", path: "/approvals", icon: "✓" },
      { id: "hod-2", label: "Dashboard", path: "/hod", icon: "🏠" },
      { id: "hod-3", label: "Upload", path: "/upload/notes", icon: "📝" },
      { id: "hod-4", label: "Events", path: "/events", icon: "📅" },
      { id: "hod-5", label: "Notices", path: "/notices", icon: "📢" },
    ],
    Faculty: [
      { id: "fac-1", label: "Dashboard", path: "/faculty/dashboard", icon: "🏠" },
      { id: "fac-2", label: "Upload", path: "/faculty/upload", icon: "📝" },
      { id: "fac-3", label: "My Hub", path: "/faculty/my-uploads", icon: "👤" },
      { id: "fac-4", label: "Events", path: "/events", icon: "📅" },
      { id: "fac-5", label: "Notices", path: "/notices", icon: "📢" },
    ],
    Student: [
      { id: "stu-1", label: "Dashboard", path: "/student/dashboard", icon: "🏠" },
      { id: "stu-2", label: "Upload", path: "/student/upload", icon: "📝" },
      { id: "stu-3", label: "Browse", path: "/student/files", icon: "🔍" },
      { id: "stu-4", label: "Bookmarks", path: "/student/bookmarks", icon: "❤️" },
      { id: "stu-5", label: "Events", path: "/events", icon: "📅" },
    ],
  };

  const links = user ? navigationLinks[user.role] || navigationLinks.Student : [];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/70 backdrop-blur-xl rounded-full shadow-apple-lg border border-white/50">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.id || link.path}
              onClick={() => navigate(link.path)}
              title={link.label}
              className={`
                flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-system-blue shadow-apple-sm scale-110' : 'hover:bg-black/5 hover:scale-110'}
              `}
            >
              <span className={`text-xl sm:text-2xl ${isActive ? '' : 'grayscale opacity-80'}`}>
                {link.icon}
              </span>
              <span className={`text-[10px] font-medium mt-1 truncate w-full text-center px-1 hidden sm:block ${isActive ? 'text-white' : 'text-apple-gray'}`}>
                {link.label}
              </span>
            </button>
          );
        })}

        <div className="w-px h-8 bg-black/10 mx-1 sm:mx-2"></div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl hover:bg-black/5 hover:scale-110 transition-all duration-300 group"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 group-hover:text-red-600 transition-colors" />
          <span className="text-[10px] font-medium mt-1 text-red-500 hidden sm:block">
            Logout
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
