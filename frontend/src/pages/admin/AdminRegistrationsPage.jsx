/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { adminAPI, userAPI } from '../../services/api';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { SkeletonTable } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { HiFilter, HiDownload } from 'react-icons/hi';

const AdminRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEventId, setFilterEventId] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [regRes, eventsRes] = await Promise.all([
        adminAPI.getRegistrations(), userAPI.getEvents()
      ]);
      setRegistrations(regRes.data || []);
      setEvents(eventsRes.data.data || []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleFilter = async () => {
    if (!filterEventId) { fetchData(); return; }
    setLoading(true);
    try {
      const res = await adminAPI.getRegistrationsByEvent(filterEventId);
      setRegistrations(res.data || []);
    } catch { toast.error('Failed to filter'); }
    finally { setLoading(false); }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await adminAPI.exportCSV();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'registrations.csv'; a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch { toast.error('Export failed'); }
    finally { setExporting(false); }
  };

  const columns = [
    { header: 'Reg. ID', accessor: 'id' },
    { header: 'User ID', accessor: 'user_id' },
    { header: 'Event ID', render: (row) => {
      const ev = events.find(e => e.ID === row.event_id);
      return <span>#{row.event_id}{ev ? ` (${ev.Title})` : ''}</span>;
    }},
    { header: 'Attended', render: (row) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.attended ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400'}`}>
        {row.attended ? '✅ Yes' : '❌ No'}
      </span>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Registrations</h1>
          <p className="text-[var(--text-muted)] mt-1">View and manage event registrations</p>
        </div>
        <Button onClick={handleExport} loading={exporting} variant="secondary" icon={<HiDownload />}>Export CSV</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={filterEventId} onChange={e => setFilterEventId(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm">
          <option value="">All Events</option>
          {events.map(ev => <option key={ev.ID} value={ev.ID}>{ev.Title} (#{ev.ID})</option>)}
        </select>
        <Button onClick={handleFilter} icon={<HiFilter />}>Filter</Button>
      </div>
      {loading ? <SkeletonTable rows={6} /> : registrations.length === 0 ?
        <EmptyState icon="📋" title="No registrations" description="No registrations found" /> :
        <Table columns={columns} data={registrations} />}
    </div>
  );
};

export default AdminRegistrationsPage;
