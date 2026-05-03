import { useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';

const AdminExportPage = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await adminAPI.exportCSV();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'registrations.csv'; a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully!');
    } catch { toast.error('Export failed'); }
    finally { setExporting(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Export Data</h1>
        <p className="text-[var(--text-muted)] mt-1">Download registration data as CSV</p>
      </div>
      <GlassCard className="p-8 text-center">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20">
          <Download className="h-7 w-7" />
        </motion.div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Export Registrations</h3>
        <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
          Download all registration data as a CSV file. This includes user IDs, event IDs, and attendance status.
        </p>
        {exporting && (
          <div className="mx-auto mb-5 h-2 max-w-md overflow-hidden rounded-full bg-[var(--surface-hover)]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-orange-400" initial={{ width: '8%' }} animate={{ width: '92%' }} transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
          </div>
        )}
        <Button onClick={handleExport} loading={exporting} size="lg" icon={<Download className="h-4 w-4" />}>
          Download CSV
        </Button>
      </GlassCard>
    </div>
  );
};

export default AdminExportPage;
