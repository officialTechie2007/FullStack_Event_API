import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './routes/ProtectedRoute';
import PageTransition from './components/animation/PageTransition';
import { PageLoader } from './components/ui/Spinner';

const UserLayout = lazy(() => import('./layouts/UserLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const VerifyOTPPage = lazy(() => import('./pages/auth/VerifyOTPPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

const DashboardPage = lazy(() => import('./pages/user/DashboardPage'));
const EventsPage = lazy(() => import('./pages/user/EventsPage'));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminRegistrationsPage = lazy(() => import('./pages/admin/AdminRegistrationsPage'));
const AdminAttendancePage = lazy(() => import('./pages/admin/AdminAttendancePage'));
const AdminExportPage = lazy(() => import('./pages/admin/AdminExportPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));

const route = (element) => <PageTransition>{element}</PageTransition>;

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<GuestRoute>{route(<LoginPage />)}</GuestRoute>} />
          <Route path="/signup" element={<GuestRoute>{route(<SignupPage />)}</GuestRoute>} />
          <Route path="/verify-otp" element={route(<VerifyOTPPage />)} />
          <Route path="/forgot-password" element={route(<ForgotPasswordPage />)} />

          <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={route(<DashboardPage />)} />
            <Route path="/events" element={route(<EventsPage />)} />
            <Route path="/profile" element={route(<ProfilePage />)} />
          </Route>

          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin" element={route(<AdminDashboard />)} />
            <Route path="/admin/events" element={route(<AdminEventsPage />)} />
            <Route path="/admin/users" element={route(<AdminUsersPage />)} />
            <Route path="/admin/registrations" element={route(<AdminRegistrationsPage />)} />
            <Route path="/admin/attendance" element={route(<AdminAttendancePage />)} />
            <Route path="/admin/export" element={route(<AdminExportPage />)} />
            <Route path="/admin/analytics" element={route(<AdminAnalyticsPage />)} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--surface-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                fontSize: '14px',
                boxShadow: 'var(--shadow-card)',
              },
            }}
          />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
