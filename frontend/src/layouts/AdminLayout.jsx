import { Outlet } from 'react-router-dom';
import AnimatedBackground from '../components/animation/AnimatedBackground';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <AnimatedBackground />
      <AdminSidebar />
      <main className="flex-1 p-6 pt-16 transition-[margin] duration-300 lg:ml-64 lg:p-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
