import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import { HiUser, HiMail, HiShieldCheck } from 'react-icons/hi';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="text-center">
        <div className="w-24 h-24 mx-auto gradient-bg rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-indigo-500/30 mb-6">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{user?.name}</h1>
        <p className="text-[var(--text-muted)] mb-4">{user?.email}</p>
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${
          user?.role === 'admin'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
        }`}>
          {user?.role === 'admin' ? '👑' : '👤'} {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </span>
      </Card>

      {/* Details */}
      <Card>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Account Details</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <HiUser size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Full Name</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <HiMail size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Email Address</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <HiShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Role</p>
              <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <span className="text-lg">🆔</span>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">User ID</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">#{user?.id}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
