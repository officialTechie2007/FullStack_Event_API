/* eslint-disable react-hooks/immutability */
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, ClipboardList, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminAPI, userAPI } from '../../services/api';
import StatsCard from '../../components/ui/StatsCard';
import { PageLoader } from '../../components/ui/Spinner';

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [eventCount, setEventCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [s, e, u] = await Promise.all([
        adminAPI.getEventStats(),
        userAPI.getEvents(),
        adminAPI.getUsers(),
      ]);
      setStats(s.data);
      setEventCount(e.data.data?.length || 0);
      setUserCount(u.data?.length || 0);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const notAttended = Math.max((stats?.total || 0) - (stats?.attended || 0), 0);
  const summary = [
    { name: 'Events', value: eventCount, color: '#06b6d4' },
    { name: 'Users', value: userCount, color: '#10b981' },
    { name: 'Registrations', value: stats?.total || 0, color: '#f59e0b' },
    { name: 'Attended', value: stats?.attended || 0, color: '#8b5cf6' },
  ];
  const attendance = [
    { name: 'Present', value: stats?.attended || 0, color: '#10b981' },
    { name: 'Absent', value: notAttended, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
        <p className="mt-1 text-[var(--text-muted)]">Animated insights across events, users, registrations, and attendance.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<CalendarDays className="h-6 w-6" />} label="Total Events" value={eventCount} color="indigo" />
        <StatsCard icon={<Users className="h-6 w-6" />} label="Total Users" value={userCount} color="emerald" />
        <StatsCard icon={<ClipboardList className="h-6 w-6" />} label="Registrations" value={stats?.total || 0} color="amber" />
        <StatsCard icon={<CheckCircle2 className="h-6 w-6" />} label="Attended" value={stats?.attended || 0} color="violet" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] p-6 shadow-[var(--shadow-card)] backdrop-blur-2xl lg:col-span-3">
          <h3 className="mb-5 text-lg font-semibold text-[var(--text-primary)]">Operational Mix</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={900}>
                  {summary.map((item) => <Cell key={item.name} fill={item.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] p-6 shadow-[var(--shadow-card)] backdrop-blur-2xl lg:col-span-2">
          <h3 className="mb-5 text-lg font-semibold text-[var(--text-primary)]">Attendance Split</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attendance} dataKey="value" nameKey="name" innerRadius={72} outerRadius={112} paddingAngle={5} animationDuration={900}>
                  {attendance.map((item) => <Cell key={item.name} fill={item.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {attendance.map((item) => (
              <div key={item.name} className="rounded-xl bg-[var(--surface-hover)] p-3">
                <div className="mb-2 h-2 w-8 rounded-full" style={{ background: item.color }} />
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
