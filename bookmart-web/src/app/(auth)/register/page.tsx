'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { IoPersonAdd } from 'react-icons/io5';
import { z } from 'zod';
import { AuthCard, AuthHero } from '@/components/auth/auth-hero';
import { Button, Input } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useToast } from '@/providers/toast-provider';

const schema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name'),
  email: z.email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .refine((v) => !/^\d+$/.test(v), 'Password cannot be entirely numeric'),
  agree: z.boolean().refine((v) => v, 'Please accept the Terms of Service and Privacy Policy'),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { agree: false } });

  const onSubmit = async ({ full_name, email, password }: FormValues) => {
    const values = { full_name, email, password };
    try {
      await api.post(ENDPOINTS.AUTH.REGISTER, values);
      toast.success('Account created! We sent a 4-digit code to your email.');
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <AuthHero
        icon={IoPersonAdd}
        title="Create Account"
        subtitle="Join Bookmart to list and buy books nearby"
      />
      <AuthCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            autoComplete="name"
            placeholder="Enter your full name"
            error={errors.full_name?.message}
            {...register('full_name')}
          />
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
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <div>
            <label className="flex items-start gap-3 text-xs text-muted">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 rounded accent-primary"
                {...register('agree')}
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="font-semibold text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-semibold text-primary">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agree && <p className="mt-1 text-xs text-app-red">{errors.agree.message}</p>}
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create Account
          </Button>
        </form>
      </AuthCard>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-heading font-bold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
}
