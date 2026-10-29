'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
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
      <h1 className="text-3xl font-extrabold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">
        Log in to buy, sell and discover books near you.
      </p>

      {unverifiedEmail && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Please verify your email address before logging in.
          <button onClick={resendAndVerify} className="ml-1 font-bold underline">
            Send code &amp; verify
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Your password"
            error={errors.password?.message}
            className="pr-11"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-brand-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        New to Bookmart?{' '}
        <Link href="/register" className="font-bold text-brand-primary hover:underline">
          Create an account
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
