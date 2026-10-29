'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { IoBookSharp } from 'react-icons/io5';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { AuthCard, AuthHero } from '@/components/auth/auth-hero';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { safeNext } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { LoginResponse } from '@/types/api';

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn, status } = useAuth();
  const toast = useToast();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const next = safeNext(params.get('next'));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (status === 'authenticated') router.replace(next);
  }, [status, router, next]);

  const onSubmit = async (values: FormValues) => {
    setUnverifiedEmail(null);
    try {
      const { data } = await api.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, values);
      signIn(data.tokens);
      toast.success(`Welcome back, ${data.user.full_name.split(' ')[0]}!`);
      router.replace(next);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setUnverifiedEmail(values.email);
        return;
      }
      toast.error(getErrorMessage(err));
    }
  };

  const resendAndVerify = async () => {
    if (!unverifiedEmail) return;
    try {
      await api.post(ENDPOINTS.AUTH.RESEND_OTP, { email: unverifiedEmail });
      toast.success('A new verification code has been sent to your email.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    router.push(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`);
  };

  return (
    <>
      <AuthHero
        icon={IoBookSharp}
        title="Welcome back"
        subtitle="Sign in to access your pre-owned book market"
      />

      {unverifiedEmail && (
        <div className="mb-4 rounded-2xl border border-app-yellow bg-app-yellow-light p-4 text-sm text-text">
          Please verify your email address before logging in.{' '}
          <button onClick={resendAndVerify} className="font-bold text-primary underline">
            Send code &amp; verify
          </button>
        </div>
      )}

      <AuthCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="name@domain.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="font-heading text-sm font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign In
          </Button>
        </form>
      </AuthCard>

      <p className="mt-8 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-heading font-bold text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
