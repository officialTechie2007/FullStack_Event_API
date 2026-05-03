import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiSun, HiMoon } from 'react-icons/hi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail || 'Login failed';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-4xl mb-8 mx-auto backdrop-blur-sm animate-float">
            🎪
          </div>
          <h1 className="text-4xl font-bold mb-4">EventFlow</h1>
          <p className="text-lg text-white/80 mb-8">
            Manage events, track registrations, and engage your audience — all in one beautiful platform.
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-white/70">Events</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm text-white/70">Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-white/70">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Theme toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
            >
              {isDark ? <HiSun size={20} /> : <HiMoon size={20} />}
            </button>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg shadow-indigo-500/30">
              E
            </div>
            <h2 className="text-2xl font-bold gradient-text">EventFlow</h2>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Welcome back</h2>
            <p className="text-[var(--text-muted)] mb-8">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<HiMail />}
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<HiLockClosed />}
              required
            />

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-8">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
