'use client';

import { IoMailOpenOutline, IoTimeOutline } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { AuthCard, AuthHero } from '@/components/auth/auth-hero';
import { OtpInput } from '@/components/auth/otp-input';
import { Button, Input } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { Tokens } from '@/types/api';

const RESEND_COOLDOWN = 300; // OTPs expire after 5 minutes

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

  const mins = Math.floor(cooldown / 60);
  const secs = String(cooldown % 60).padStart(2, '0');

  return (
    <>
      <AuthHero
        icon={IoMailOpenOutline}
        title="Verify your Email"
        backHref="/register"
        subtitle={
          <>
            We sent a 4-digit verification code to
            <br />
            <b className="text-ink">{email || 'your email'}</b>
          </>
        }
      />
      <AuthCard>
        <form onSubmit={verify} className="space-y-6">
          {!params.get('email') && (
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <OtpInput value={otp} onChange={setOtp} />
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted">
            <IoTimeOutline size={16} />
            {cooldown > 0 ? (
              <span>
                Resend code in {mins}:{secs}
              </span>
            ) : (
              <button
                type="button"
                onClick={resend}
                className="font-heading font-bold text-primary hover:underline"
                disabled={!email}
              >
                Resend code
              </button>
            )}
          </p>
          <Button type="submit" className="w-full" loading={submitting}>
            Verify Code
          </Button>
        </form>
      </AuthCard>
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
