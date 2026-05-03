import { motion } from 'framer-motion';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authAPI } from '../../services/api';

const OTP_LENGTH = 6;

const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  const otp = digits.join('');

  const setDigit = (index, value) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((digit, index) => {
      next[index] = digit;
    });
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || otp.length !== OTP_LENGTH) {
      toast.error('Enter your email and 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyOTP(email, otp);
      toast.success('Email verified. You can sign in now.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setResending(true);
    try {
      await authAPI.resendOTP(email);
      toast.success('New OTP sent');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20">
            <MailCheck className="h-9 w-9" />
          </motion.div>
          <h2 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">Verify Email</h2>
          <p className="text-[var(--text-muted)]">Enter the 6-digit code sent to your inbox.</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] p-8 shadow-[var(--shadow-card)] backdrop-blur-2xl">
          <form onSubmit={handleVerify} className="space-y-5">
            <Input
              id="verify-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">OTP Code</label>
              <div className="grid grid-cols-6 gap-2" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(node) => { inputsRef.current[index] = node; }}
                    value={digit}
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(e) => setDigit(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    whileFocus={{ scale: 1.06, y: -2 }}
                    className="h-12 rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] text-center text-lg font-bold text-[var(--text-primary)] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/35"
                  />
                ))}
              </div>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full">
              Verify Email
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Did not receive it?{' '}
              <button
                onClick={handleResend}
                disabled={resending}
                className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          <Link to="/login" className="inline-flex items-center gap-2 font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTPPage;
