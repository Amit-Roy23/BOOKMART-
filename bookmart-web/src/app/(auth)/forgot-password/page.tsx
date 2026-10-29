'use client';

import { IoLockOpenOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthCard, AuthHero } from '@/components/auth/auth-hero';
import { OtpInput } from '@/components/auth/otp-input';
import { Button, Input } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { Tokens } from '@/types/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useAuth();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const requestCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      toast.success('We sent a 4-digit reset code to your email.');
      setStep('reset');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) return toast.error('Enter the 4-digit code from your email.');
    if (password.length < 8) return toast.error('Password must be at least 8 characters.');
    if (password !== confirm) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      const { data } = await api.post<{ tokens: Tokens }>(ENDPOINTS.AUTH.VERIFY_RESET_OTP, {
        email,
        otp,
        new_password: password,
      });
      signIn(data.tokens);
      toast.success('Password updated. You are now logged in.');
      router.replace('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHero
        icon={IoLockOpenOutline}
        backHref="/login"
        title={step === 'email' ? 'Forgot Password' : 'Reset Password'}
        subtitle={
          step === 'email'
            ? 'Enter your email to receive a password reset OTP code'
            : `Enter the code sent to ${email} and choose a new password`
        }
      />
      <AuthCard>
        {step === 'email' ? (
          <form onSubmit={requestCode} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Send Reset OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-5">
            <OtpInput value={otp} onChange={setOtp} />
            <Input
              label="New Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Reset Password
            </Button>
            <button
              type="button"
              onClick={() => requestCode()}
              className="font-heading w-full text-center text-sm font-semibold text-primary hover:underline"
            >
              Resend code
            </button>
          </form>
        )}
      </AuthCard>
    </>
  );
}
