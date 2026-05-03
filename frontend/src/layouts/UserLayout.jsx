import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AnimatedBackground from '../components/animation/AnimatedBackground';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <AnimatedBackground />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
