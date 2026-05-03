/* eslint-disable react-hooks/static-components */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HiViewGrid,
  HiCalendar,
  HiUsers,
  HiClipboardList,
  HiCheckCircle,
  HiDownload,
  HiChartBar,
  HiLogout,
  HiSun,
  HiMoon,
  HiMenuAlt3,
  HiX,
} from 'react-icons/hi';
import { useState } from 'react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <HiViewGrid size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <HiCalendar size={20} />, label: 'Events', path: '/admin/events' },
    { icon: <HiUsers size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <HiClipboardList size={20} />, label: 'Registrations', path: '/admin/registrations' },
    { icon: <HiCheckCircle size={20} />, label: 'Attendance', path: '/admin/attendance' },
    { icon: <HiDownload size={20} />, label: 'Export CSV', path: '/admin/export' },
    { icon: <HiChartBar size={20} />, label: 'Analytics', path: '/admin/analytics' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
            E
          </div>
          {!collapsed && (
            <div>
              <span className="text-lg font-bold gradient-text">EventFlow</span>
              <span className="block text-[10px] text-[var(--text-muted)] -mt-1">Admin Panel</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
        >
          <HiMenuAlt3 size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-indigo-500/25'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border-color)] space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {isDark ? <HiSun size={20} /> : <HiMoon size={20} />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <HiLogout size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg text-[var(--text-primary)]"
      >
        <HiMenuAlt3 size={24} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col animate-slide-left">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
            >
              <HiX size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
