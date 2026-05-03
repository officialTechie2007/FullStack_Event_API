import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { HiMail, HiKey, HiLockClosed } from 'react-icons/hi';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = reset password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      toast.success('Reset OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(email, token, newPassword);
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-indigo-500/30 animate-float">
            🔐
          </div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="text-[var(--text-muted)]">
            {step === 1
              ? 'Enter your email and we\'ll send you a reset code.'
              : 'Enter the OTP and your new password.'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[var(--color-primary)]' : 'bg-[var(--border-color)]'}`} />
          <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-[var(--color-primary)]' : 'bg-[var(--border-color)]'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[var(--color-primary)]' : 'bg-[var(--border-color)]'}`} />
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-8 shadow-lg">
          {step === 1 ? (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <Input
                id="forgot-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<HiMail />}
                required
              />
              <Button type="submit" loading={loading} size="lg" className="w-full">
                Send Reset Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <Input
                id="reset-token"
                label="Reset OTP"
                type="text"
                placeholder="Enter 6-digit code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                icon={<HiKey />}
                required
              />
              <Input
                id="reset-new-password"
                label="New Password"
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<HiLockClosed />}
                required
              />
              <Button type="submit" loading={loading} size="lg" className="w-full">
                Reset Password
              </Button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              >
                ← Back to email
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
