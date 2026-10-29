'use client';

import {
  BookHeart,
  Briefcase,
  GraduationCap,
  type LucideIcon,
  Presentation,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RequireAuth } from '@/components/layout/require-auth';
import { CollegePicker } from '@/components/profile/college-picker';
import { Button } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { College } from '@/types/api';

// Choice values match ProfileOnboardingSerializer in bookmart-backend.
const ROLES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'STUDENT', label: 'Student', icon: GraduationCap },
  { id: 'TEACHER', label: 'Teacher', icon: Presentation },
  { id: 'PROFESSIONAL', label: 'Professional', icon: Briefcase },
  { id: 'BOOK_LOVER', label: 'Book Lover', icon: BookHeart },
  { id: 'OTHERS', label: 'Others', icon: Sparkles },
];

const PREFERENCES = [
  { id: 'ACADEMIC', label: 'Academic / Textbooks' },
  { id: 'COMPETETIVE', label: 'Competitive Exams' },
  { id: 'FICTION', label: 'Fiction' },
  { id: 'SELF_HELP', label: 'Self Help' },
  { id: 'BUSINESS', label: 'Business & Finance' },
  { id: 'COMIC', label: 'Comics / Manga' },
  { id: 'NON_FICTION', label: 'Non-Fiction' },
  { id: 'TECHNOLOGY', label: 'Technology' },
  { id: 'OTHER', label: 'Other' },
];

const COLLEGE_ROLES = ['STUDENT', 'TEACHER'];

function Onboarding() {
  const router = useRouter();
  const toast = useToast();
  const { profile, refreshProfile } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [college, setCollege] = useState<College | null>(profile?.college ?? null);
  const [preference, setPreference] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const needsCollege = !!role && COLLEGE_ROLES.includes(role);

  const submit = async () => {
    if (!role) return toast.error('Tell us who you are.');
    if (needsCollege && !college) return toast.error('Select your college.');
    setSaving(true);
    try {
      await api.post(ENDPOINTS.CORE.PROFILE_ONBOARDING, {
        user_role: role,
        book_preferences: preference ?? 'OTHER',
        ...(college ? { college_id: college.id } : {}),
      });
      await refreshProfile();
      toast.success('You’re all set!');
      router.replace('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Let’s personalise <span className="text-brand-primary">Bookmart for you</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This helps us show you the most relevant books and offers.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-900">Who are you?</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ROLES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-semibold transition',
                role === id
                  ? 'border-brand-primary bg-brand-light text-brand-dark'
                  : 'border-slate-200 text-slate-600 hover:border-brand-primary'
              )}
            >
              <Icon className="h-5 w-5" /> {label}
            </button>
          ))}
        </div>
      </section>

      {needsCollege && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-slate-900">Your college</h2>
          <CollegePicker value={college} onChange={setCollege} />
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-900">What do you like to read?</h2>
        <div className="flex flex-wrap gap-2">
          {PREFERENCES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreference(p.id)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition',
                preference === p.id
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'border-slate-200 text-slate-600 hover:border-brand-primary'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={() => router.replace('/')}>
          Skip for now
        </Button>
        <Button className="flex-1" loading={saving} onClick={submit}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <RequireAuth>
      <Onboarding />
    </RequireAuth>
  );
}
