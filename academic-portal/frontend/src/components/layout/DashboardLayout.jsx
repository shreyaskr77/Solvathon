import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../Sidebar';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-apple-bg relative pb-28">
      {/* Top Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎓</div>
          <h1 className="text-lg font-bold text-apple-text hidden sm:block">Academic Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm text-apple-gray bg-gray-100 px-3 py-1 rounded-full">{user?.role}</span>
          <span className="font-semibold text-sm text-apple-text">{user?.name}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto overflow-x-hidden p-4 sm:p-8">
        {children}
      </main>

      {/* Bottom Floating Navigation */}
      <Sidebar />
    </div>
  );
};

export default DashboardLayout;