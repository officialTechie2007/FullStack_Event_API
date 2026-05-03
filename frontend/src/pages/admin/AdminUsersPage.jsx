/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Table from '../../components/ui/Table';
import { SkeletonTable } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            {row.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)]">{row.name}</p>
            <p className="text-xs text-[var(--text-muted)]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          row.role === 'admin'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
        }`}>
          {row.role === 'admin' ? '👑' : '👤'} {row.role}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Management</h1>
        <p className="text-[var(--text-muted)] mt-1">View all registered users</p>
      </div>

      {loading ? (
        <SkeletonTable rows={8} />
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="No users found" description="No users have registered yet" />
      ) : (
        <Table columns={columns} data={users} emptyMessage="No users found" />
      )}
    </div>
  );
};

export default AdminUsersPage;
