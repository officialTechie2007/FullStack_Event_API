/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { SkeletonTable } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { HiCheck, HiX } from 'react-icons/hi';

const AdminAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);
  const [showFilter, setShowFilter] = useState('all'); // all, attended, not

  useEffect(() => { fetchAttendance(); }, []);

  const fetchAttendance = async () => {
    try {
      const res = await adminAPI.getAttendance();
      setAttendance(res.data || []);
    } catch { toast.error('Failed to load attendance'); }
    finally { setLoading(false); }
  };

  const handleMark = async (regId, attended) => {
    setMarking(regId);
    try {
      await adminAPI.markAttendance(regId, attended);
      toast.success(`Attendance ${attended ? 'marked' : 'unmarked'}`);
      fetchAttendance();
    } catch { toast.error('Failed to update attendance'); }
    finally { setMarking(null); }
  };

  const filtered = showFilter === 'all' ? attendance :
    showFilter === 'attended' ? attendance.filter(a => a.attended) :
    attendance.filter(a => !a.attended);

  const columns = [
    { header: 'Reg. ID', accessor: 'registration_id' },
    { header: 'User ID', accessor: 'user_id' },
    { header: 'Event ID', accessor: 'event_id' },
    { header: 'Status', render: (row) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.attended ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
        {row.attended ? '✅ Present' : '❌ Absent'}
      </span>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Attendance Management</h1>
        <p className="text-[var(--text-muted)] mt-1">Mark and manage event attendance</p>
      </div>

      <div className="flex gap-2">
        {['all', 'attended', 'not'].map(f => (
          <button key={f} onClick={() => setShowFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showFilter === f ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'}`}>
            {f === 'all' ? 'All' : f === 'attended' ? '✅ Present' : '❌ Absent'}
          </button>
        ))}
      </div>

      {loading ? <SkeletonTable rows={6} /> : filtered.length === 0 ?
        <EmptyState icon="✅" title="No records" description="No attendance records found" /> :
        <Table columns={columns} data={filtered}
          actions={(row) => (
            <>
              {!row.attended && (
                <Button size="sm" variant="success" onClick={() => handleMark(row.registration_id, true)}
                  loading={marking === row.registration_id} icon={<HiCheck />}>Present</Button>
              )}
              {row.attended && (
                <Button size="sm" variant="danger" onClick={() => handleMark(row.registration_id, false)}
                  loading={marking === row.registration_id} icon={<HiX />}>Absent</Button>
              )}
            </>
          )}
        />}
    </div>
  );
};

export default AdminAttendancePage;
