import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/layout/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Events', path: '/events', icon: CalendarDays },
  { label: 'Profile', path: '/profile', icon: User },
];

const FloatingNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`;

  return (
    <motion.nav
      initial={{ y: -22, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="sticky top-3 z-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex h-16 items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] px-4 shadow-[var(--shadow-card)] backdrop-blur-2xl">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-cyan-500/10 dark:bg-white dark:text-slate-950">
            EF
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-[var(--text-primary)]">EventFlow</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Workspace</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={linkClass}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="user-nav-pill" className="absolute inset-0 rounded-xl bg-[var(--surface-hover)]" />}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] py-1 pl-1 pr-3 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="max-w-28 truncate text-sm font-medium text-[var(--text-primary)]">{user?.name}</span>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="hidden rounded-xl p-2 text-[var(--text-muted)] hover:bg-rose-500/10 hover:text-rose-500 md:block">
            <LogOut className="h-5 w-5" />
          </motion.button>
          <button onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 md:hidden">
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 360, damping: 34 }} className="absolute bottom-0 right-0 top-0 w-80 max-w-[86vw] border-l border-[var(--border-color)] bg-[var(--surface-raised)] p-4 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-semibold text-[var(--text-primary)]">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 hover:bg-[var(--surface-hover)]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {navLinks.map(({ label, path, icon: Icon }) => (
                  <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-[var(--surface-hover)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </NavLink>
                ))}
                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-500/10">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default FloatingNavbar;
