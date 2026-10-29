'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoArrowForward,
  IoBarChartOutline,
  IoBook,
  IoBookOutline,
  IoBriefcaseOutline,
  IoChatbubbleEllipsesOutline,
  IoCheckmarkCircle,
  IoDesktopOutline,
  IoEaselOutline,
  IoGridOutline,
  IoInformationCircleOutline,
  IoLeafOutline,
  IoLibraryOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoRadioButtonOff,
  IoSchool,
  IoSchoolOutline,
  IoTrophyOutline,
} from 'react-icons/io5';
import { RequireAuth } from '@/components/layout/require-auth';
import { CollegePicker } from '@/components/profile/college-picker';
import { Button } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { College } from '@/types/api';

// Roles and interests from the app's PersonalizationScreen; `value` is what the backend accepts.
const ROLES: {
  value: string;
  title: string;
  subtitle: string;
  icon: IconType;
  color: string;
  bg: string;
}[] = [
  {
    value: 'STUDENT',
    title: "I'm a Student",
    subtitle: 'Currently studying',
    icon: IoSchoolOutline,
    color: '#008080',
    bg: '#00968814',
  },
  {
    value: 'TEACHER',
    title: "I'm a Teacher",
    subtitle: 'Educator / Faculty',
    icon: IoEaselOutline,
    color: '#D97706',
    bg: '#f59e0b1a',
  },
  {
    value: 'PROFESSIONAL',
    title: 'Working Professional',
    subtitle: 'Not a student',
    icon: IoBriefcaseOutline,
    color: '#1877F2',
    bg: '#001aff23',
  },
  {
    value: 'BOOK_LOVER',
    title: 'Book Lover',
    subtitle: 'Love reading books',
    icon: IoBookOutline,
    color: '#10B981',
    bg: '#10b9811a',
  },
];

const INTERESTS: { value: string; label: string; icon: IconType }[] = [
  { value: 'ACADEMIC', label: 'Academic / Textbooks', icon: IoLibraryOutline },
  { value: 'COMPETETIVE', label: 'Competitive Exams', icon: IoTrophyOutline },
  { value: 'FICTION', label: 'Fiction', icon: IoBookOutline },
  { value: 'SELF_HELP', label: 'Self Help', icon: IoLeafOutline },
  { value: 'BUSINESS', label: 'Business & Finance', icon: IoBarChartOutline },
  { value: 'COMIC', label: 'Comics / Manga', icon: IoChatbubbleEllipsesOutline },
  { value: 'NON_FICTION', label: 'Non-Fiction', icon: IoPersonOutline },
  { value: 'TECHNOLOGY', label: 'Technology', icon: IoDesktopOutline },
  { value: 'OTHER', label: 'Other', icon: IoGridOutline },
];

const COLLEGE_ROLES = ['STUDENT', 'TEACHER'];

function HeroIllustration() {
  return (
    <svg width="130" height="105" viewBox="0 0 180 140" aria-hidden>
      <ellipse cx="90" cy="115" rx="80" ry="22" fill="#EBF6F6" />
      <rect x="88" y="20" width="56" height="85" rx="4" fill="#005B5B" />
      <rect x="88" y="20" width="6" height="85" fill="#004747" />
      <text
        x="118"
        y="72"
        fontSize="32"
        fontWeight="700"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="var(--font-montserrat)"
      >
        B
      </text>
      <rect x="35" y="93" width="90" height="11" rx="2" fill="#008080" />
      <rect x="37" y="95" width="87" height="6" fill="#FFFFF0" />
      <rect x="38" y="83" width="88" height="11" rx="2" fill="#E2E8F0" />
      <rect x="38" y="85" width="86" height="6" fill="#FFFFFF" />
      <rect x="42" y="73" width="82" height="11" rx="2" fill="#F5C518" />
      <rect x="42" y="75" width="80" height="6" fill="#FFFDF0" />
      <polygon points="128,94 138,94 135,108 131,108" fill="#D27D2D" />
      <path d="M133,94 C129,82 124,85 126,76 C128,76 131,82 133,94 Z" fill="#2E7D32" />
      <path d="M133,94 C137,82 142,85 140,76 C138,76 135,82 133,94 Z" fill="#4CAF50" />
      <path d="M133,94 C133,83 135,81 133,72 C131,81 131,83 133,94 Z" fill="#81C784" />
      <rect x="146" y="92" width="20" height="20" rx="3" fill="#F5A623" />
      <path d="M166,96 C170,96 170,108 166,108" stroke="#F5A623" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function CardHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: IconType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon size={20} />
      </span>
      <div>
        <p className="font-heading font-bold text-ink">{title}</p>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function Onboarding() {
  const router = useRouter();
  const toast = useToast();
  const { profile, refreshProfile } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string>();
  const [college, setCollege] = useState<College | null>(profile?.college ?? null);
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const needsCollege = !!role && COLLEGE_ROLES.includes(role);

  const toggleInterest = (value: string) =>
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const submit = async () => {
    if (!role) {
      setRoleError('Please tell us who you are.');
      return;
    }
    setSaving(true);
    try {
      // The backend stores one preference; send the first one picked, as the app does.
      await api.post(ENDPOINTS.CORE.PROFILE_ONBOARDING, {
        user_role: role,
        book_preferences: interests[0] ?? 'OTHER',
        ...(needsCollege && college ? { college_id: college.id } : {}),
      });
      await refreshProfile();
      router.replace('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between gap-2 pt-2">
        <div>
          <h1 className="text-2xl font-bold leading-tight text-ink">Let&apos;s personalize</h1>
          <p className="font-heading text-2xl font-bold leading-tight text-primary">
            Bookmart for you
          </p>
          <p className="mt-1 text-xs text-muted">
            This helps us show you the most relevant books and offers.
          </p>
        </div>
        <HeroIllustration />
      </div>

      <section className="rounded-3xl bg-white p-4 shadow-card">
        <CardHeading
          icon={IoSchool}
          title="Who are you?"
          subtitle="This helps us recommend relevant books and resources."
        />
        {roleError && <p className="mb-2 text-xs text-app-red">{roleError}</p>}
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map(({ value, title, subtitle, icon: Icon, color, bg }) => {
            const selected = role === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setRole(value);
                  setRoleError(undefined);
                }}
                className={cn(
                  'relative rounded-2xl border p-3 text-left transition',
                  selected
                    ? 'border-primary bg-secondary'
                    : 'border-[#eef2f2] bg-white hover:border-primary'
                )}
              >
                {selected && (
                  <IoCheckmarkCircle size={18} className="absolute right-2 top-2 text-primary" />
                )}
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: bg, color }}
                >
                  <Icon size={20} />
                </span>
                <span className="font-heading mt-2 block text-[13px] font-bold text-ink">
                  {title}
                </span>
                <span className="block text-[10px] text-muted">{subtitle}</span>
              </button>
            );
          })}
        </div>

        {needsCollege && (
          <div className="mt-4">
            <p className="font-heading mb-1 text-sm font-semibold text-text">
              College / University <span className="text-app-red">*</span>
            </p>
            <CollegePicker value={college} onChange={setCollege} />
            <p className="mt-1.5 text-[11px] text-muted">
              You can skip this if you&apos;re not a student or teacher.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-card">
        <CardHeading
          icon={IoBook}
          title="What types of books interest you?"
          subtitle="Choose all that apply"
        />
        <div className="grid grid-cols-2 gap-2.5">
          {INTERESTS.map(({ value, label, icon: Icon }) => {
            const selected = interests.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleInterest(value)}
                aria-pressed={selected}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition',
                  selected ? 'border-primary bg-secondary' : 'border-[#eef2f2] bg-white'
                )}
              >
                <Icon size={18} className={selected ? 'text-primary' : 'text-text'} />
                <span className="min-w-0 flex-1 text-[11px] font-semibold leading-tight text-text">
                  {label}
                </span>
                {selected ? (
                  <IoCheckmarkCircle size={18} className="shrink-0 text-primary" />
                ) : (
                  <IoRadioButtonOff size={18} className="shrink-0 text-muted" />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-[#F5D48A] bg-[#FFF8E6] px-3 py-2.5 text-[11px] text-text">
          <IoInformationCircleOutline size={16} className="shrink-0 text-[#D97706]" />
          You can update these preferences anytime in settings.
        </p>
      </section>

      <Button className="w-full" loading={saving} onClick={submit}>
        <IoArrowForward size={18} /> Continue
      </Button>
      <button
        type="button"
        onClick={() => router.replace('/')}
        className="font-heading w-full text-center text-sm font-semibold text-muted hover:text-primary"
      >
        Skip for now
      </button>
      <p className="flex items-center justify-center gap-1 text-[11px] text-muted">
        <IoLockClosedOutline size={12} /> Your information is safe and secure
      </p>
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
