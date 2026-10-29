'use client';

import { KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light">
        <KeyRound className="h-7 w-7 text-brand-primary" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">
        {step === 'email' ? 'Forgot password?' : 'Set a new password'}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {step === 'email'
          ? 'Enter the email you registered with and we’ll send you a reset code.'
          : `Enter the code sent to ${email} and choose a new password.`}
      </p>

      {step === 'email' ? (
        <form onSubmit={requestCode} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Send reset code
          </Button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="mt-8 space-y-5">
          <OtpInput value={otp} onChange={setOtp} />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Reset password
          </Button>
          <button
            type="button"
            onClick={() => requestCode()}
            className="w-full text-center text-sm font-semibold text-brand-primary hover:underline"
          >
            Resend code
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm">
        <Link href="/login" className="text-slate-500 hover:underline">
          Back to login
        </Link>
      </p>
    </>
  );
}
