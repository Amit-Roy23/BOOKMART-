'use client';

import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { OtpInput } from '@/components/auth/otp-input';
import { Button, Input } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { Tokens } from '@/types/api';

const RESEND_COOLDOWN = 60;

function VerifyEmailForm() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useAuth();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) return toast.error('Enter the 4-digit code from your email.');
    setSubmitting(true);
    try {
      const { data } = await api.post<{ tokens: Tokens }>(ENDPOINTS.AUTH.VERIFY_REGISTER_OTP, {
        email,
        otp,
      });
      signIn(data.tokens);
      toast.success('Email verified! Let’s personalise Bookmart for you.');
      router.replace('/onboarding');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      await api.post(ENDPOINTS.AUTH.RESEND_OTP, { email });
      toast.success('A new code has been sent.');
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light">
        <MailCheck className="h-7 w-7 text-brand-primary" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">Verify your email</h1>
      <p className="mt-2 text-sm text-slate-500">
        Enter the 4-digit code we sent to{' '}
        {email ? <b className="text-slate-700">{email}</b> : 'your email'}. Codes expire after 5
        minutes.
      </p>

      <form onSubmit={verify} className="mt-8 space-y-6">
        {!params.get('email') && (
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <OtpInput value={otp} onChange={setOtp} />
        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          Verify email
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Didn’t get a code?{' '}
        {cooldown > 0 ? (
          <span>Resend in {cooldown}s</span>
        ) : (
          <button
            onClick={resend}
            className="font-bold text-brand-primary hover:underline"
            disabled={!email}
          >
            Resend code
          </button>
        )}
      </p>
      <p className="mt-2 text-center text-sm">
        <Link href="/login" className="text-slate-500 hover:underline">
          Back to login
        </Link>
      </p>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
