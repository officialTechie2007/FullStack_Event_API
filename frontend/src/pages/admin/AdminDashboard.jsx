/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, ClipboardList, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, userAPI } from '../../services/api';
import StatsCard from '../../components/ui/StatsCard';
import { PageLoader } from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [eventCount, setEventCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes, usersRes] = await Promise.all([
        adminAPI.getEventStats(),
        userAPI.getEvents(),
        adminAPI.getUsers(),
      ]);
      setStats(statsRes.data);
      setEventCount(eventsRes.data.data?.length || 0);
      setUserCount(usersRes.data?.length || 0);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const chartData = [
    { label: 'Events', value: eventCount },
    { label: 'Users', value: userCount },
    { label: 'Registered', value: stats?.total || 0 },
    { label: 'Present', value: stats?.attended || 0 },
  ];

  return (
    <div className="space-y-8">
      <motion.div className="premium-hero relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl shadow-cyan-950/20 md:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Admin Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
            <p className="text-white/80 text-lg">Here's an overview of your event management system.</p>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden rounded-3xl border border-white/15 bg-white/10 p-5 text-sm font-semibold backdrop-blur md:block"
          >
            Live insights
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard icon={<CalendarDays className="h-6 w-6" />} label="Total Events" value={eventCount} color="indigo" />
        <StatsCard icon={<Users className="h-6 w-6" />} label="Total Users" value={userCount} color="emerald" />
        <StatsCard icon={<ClipboardList className="h-6 w-6" />} label="Registrations" value={stats?.total || 0} color="amber" />
        <StatsCard icon={<CheckCircle2 className="h-6 w-6" />} label="Attendance Rate" value={`${(stats?.percentage || 0).toFixed(1)}%`} color="violet" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] p-6 shadow-[var(--shadow-card)] backdrop-blur-2xl">
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">System Pulse</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -18, right: 6, top: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminPulse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.42} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fill="url(#adminPulse)" animationDuration={550} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] p-6 shadow-[var(--shadow-card)] backdrop-blur-2xl">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Attendance Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-secondary)]">Attended</span>
                <span className="font-medium text-[var(--text-primary)]">{stats?.attended || 0} / {stats?.total || 0}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.percentage || 0}%` }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-orange-400"
                />
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                <span className="text-sm text-[var(--text-muted)]">Attended</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--bg-tertiary)]" />
                <span className="text-sm text-[var(--text-muted)]">Not Attended</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] p-6 shadow-[var(--shadow-card)] backdrop-blur-2xl md:col-span-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <a href="/admin/events" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors text-center group">
              <span className="text-3xl group-hover:scale-110 transition-transform">📅</span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Manage Events</span>
            </a>
            <a href="/admin/users" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors text-center group">
              <span className="text-3xl group-hover:scale-110 transition-transform">👥</span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">View Users</span>
            </a>
            <a href="/admin/registrations" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors text-center group">
              <span className="text-3xl group-hover:scale-110 transition-transform">📋</span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Registrations</span>
            </a>
            <a href="/admin/attendance" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors text-center group">
              <span className="text-3xl group-hover:scale-110 transition-transform">✅</span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Attendance</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
