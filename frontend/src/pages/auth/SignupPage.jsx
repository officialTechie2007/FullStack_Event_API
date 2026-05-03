import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiSun, HiMoon } from 'react-icons/hi';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password, role);
      toast.success('Account created! Please verify your email with the OTP sent.');
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      const detail = err.response?.data?.detail || 'Signup failed';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-4xl mb-8 mx-auto backdrop-blur-sm animate-float">
            🚀
          </div>
          <h1 className="text-4xl font-bold mb-4">Join EventFlow</h1>
          <p className="text-lg text-white/80">
            Create your account and start managing amazing events with ease.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
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
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Create account</h2>
            <p className="text-[var(--text-muted)] mb-8">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="signup-name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<HiUser />}
              required
            />

            <Input
              id="signup-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<HiMail />}
              required
            />

            <Input
              id="signup-password"
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<HiLockClosed />}
              required
            />

            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    role === 'user'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  👤 User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    role === 'admin'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  👑 Admin
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
