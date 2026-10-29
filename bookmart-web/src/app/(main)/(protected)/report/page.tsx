'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoAlert,
  IoAlertCircleOutline,
  IoBanOutline,
  IoChatbubbleEllipsesOutline,
  IoCheckmarkCircle,
  IoEllipsisHorizontal,
  IoFlagOutline,
  IoHomeOutline,
  IoLayersOutline,
  IoPersonOutline,
  IoPersonRemoveOutline,
  IoRadioButtonOff,
  IoRadioButtonOn,
  IoShieldOutline,
  IoWarningOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { Button, EmptyState, Skeleton } from '@/components/ui/primitives';
import { api, fetchAllPages, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn, formatDate } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { Report, ReportType } from '@/types/api';

// Mirrors the app's ReportScreen; reason codes are the ones apps/reports accepts.

interface Reason {
  id: string;
  title: string;
  subtitle: string;
  icon: IconType;
  color: string;
  bg: string;
}

const LISTING_REASONS: Reason[] = [
  {
    id: 'SCAM',
    title: 'Scam / Fraud',
    subtitle: 'Deceptive or fraudulent activity',
    icon: IoAlert,
    color: '#F5C518',
    bg: '#f59e0b1a',
  },
  {
    id: 'FAKE_LISTING',
    title: 'Fake Listing',
    subtitle: "Listing doesn't exist or is misrepresented",
    icon: IoAlertCircleOutline,
    color: '#1877F2',
    bg: '#001aff23',
  },
  {
    id: 'INAPPROPRIATE',
    title: 'Inappropriate',
    subtitle: 'Offensive or harmful content',
    icon: IoBanOutline,
    color: '#EF4545',
    bg: '#ef44441a',
  },
  {
    id: 'SPAM',
    title: 'Spam',
    subtitle: 'Unsolicited or repetitive content',
    icon: IoChatbubbleEllipsesOutline,
    color: '#AA5AF8',
    bg: '#F4EAFE',
  },
  {
    id: 'WRONG_CATEGORY',
    title: 'Wrong Category',
    subtitle: 'Listed in the incorrect category',
    icon: IoLayersOutline,
    color: '#10B981',
    bg: '#10b9811a',
  },
  {
    id: 'OTHER',
    title: 'Others',
    subtitle: 'Other issues',
    icon: IoEllipsisHorizontal,
    color: '#CECECE',
    bg: '#F9FAFB',
  },
];

const USER_REASONS: Reason[] = [
  {
    id: 'HARASSMENT',
    title: 'Harassment',
    subtitle: 'Threats or unwanted contact',
    icon: IoShieldOutline,
    color: '#EF4545',
    bg: '#ef44441a',
  },
  {
    id: 'FAKE_ACCOUNT',
    title: 'Fake Account',
    subtitle: 'Impersonation or false identity',
    icon: IoPersonRemoveOutline,
    color: '#1877F2',
    bg: '#001aff23',
  },
  {
    id: 'SPAM_ACTIVITY',
    title: 'Spam Activity',
    subtitle: 'Posting excessive messages',
    icon: IoChatbubbleEllipsesOutline,
    color: '#AA5AF8',
    bg: '#F4EAFE',
  },
  {
    id: 'ABUSE',
    title: 'Abuse',
    subtitle: 'Inappropriate profile or posts',
    icon: IoAlertCircleOutline,
    color: '#F5C518',
    bg: '#f59e0b1a',
  },
];

// The app's second-step options; sent as the first line of the report details.
const SUB_REASONS = [
  'Information is inaccurate',
  'Images are misleading',
  'Price is suspiciously low',
  'Seller requested payment outside app',
  'Other',
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-app-yellow-light text-[#c49a00]',
  UNDER_REVIEW: 'bg-app-blue-light text-app-blue',
  RESOLVED: 'bg-app-green-light text-app-green',
  REJECTED: 'bg-gray-light text-muted',
};

function MyReports() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => fetchAllPages<Report>(ENDPOINTS.REPORTS.ME),
  });
  if (isLoading) return <Skeleton className="h-32" />;
  if (reports.length === 0) {
    return (
      <EmptyState
        icon={IoFlagOutline}
        title="No Reports"
        description="Reports you submit will appear here."
      />
    );
  }
  return (
    <ul className="space-y-3">
      {reports.map((r) => (
        <li
          key={r.id}
          className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card"
        >
          <div className="min-w-0">
            <p className="font-heading truncate text-sm font-bold text-ink">
              {r.report_type === 'LISTING'
                ? (r.reported_listing?.book.title ?? 'Removed listing')
                : (r.reported_user?.full_name ?? 'Removed user')}
            </p>
            <p className="text-xs text-muted">
              {r.report_type === 'LISTING' ? 'Listing' : 'User'} ·{' '}
              {r.reason.replace(/_/g, ' ').toLowerCase()} · {formatDate(r.created_at)}
            </p>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize',
              STATUS_STYLES[r.status]
            )}
          >
            {r.status.replace('_', ' ').toLowerCase()}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ReportView() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const listingId = params.get('listing');
  const userId = params.get('user');
  const targetName = params.get('title') ?? params.get('name') ?? '';
  const type: ReportType | null = listingId ? 'LISTING' : userId ? 'USER' : null;
  const [showMine, setShowMine] = useState(params.get('tab') === 'mine' || !type);
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState<string | null>(null);
  const [subReason, setSubReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasons = type === 'USER' ? USER_REASONS : LISTING_REASONS;
  const steps = type === 'USER' ? ['REASON', 'DETAILS'] : ['CATEGORY', 'REASON', 'DETAILS'];
  const lastStep = steps.length;

  const next = async () => {
    if (step === 1 && !reason) return toast.error('Please select a category.');
    if (type === 'LISTING' && step === 2 && !subReason)
      return toast.error('Please select a reason.');
    if (step < lastStep) return setStep((s) => s + 1);
    setSubmitting(true);
    try {
      await api.post(ENDPOINTS.REPORTS.LIST, {
        report_type: type,
        reason,
        details: [subReason, details.trim()].filter(Boolean).join('\n'),
        ...(type === 'LISTING'
          ? { reported_listing: Number(listingId) }
          : { reported_user: Number(userId) }),
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-app-green-light">
          <IoCheckmarkCircle size={64} className="text-app-green" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-ink">Report Submitted</h1>
        <p className="mt-2 max-w-xs text-sm text-muted">
          Thanks for keeping Bookmart safe. Our team will review it shortly.
        </p>
        <div className="mt-8 w-full max-w-xs space-y-3">
          <Button className="w-full" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSubmitted(false);
              setShowMine(true);
            }}
          >
            My Reports
          </Button>
        </div>
      </div>
    );
  }

  if (showMine) {
    return (
      <div className="mx-auto max-w-2xl">
        <ScreenHeader title="My Reports" fallback="/profile" />
        <div className="space-y-4 px-6">
          <MyReports />
          {type && (
            <Button variant="outline" className="w-full" onClick={() => setShowMine(false)}>
              Back to report
            </Button>
          )}
        </div>
      </div>
    );
  }

  const selected = reasons.find((r) => r.id === reason);
  return (
    <div className="mx-auto max-w-2xl pb-28">
      <ScreenHeader
        title="Report"
        right={
          <button onClick={() => setShowMine(true)} aria-label="My reports" className="text-muted">
            <IoFlagOutline size={20} />
          </button>
        }
      />
      <div className="space-y-5 px-6">
        <p className="flex items-start gap-2.5 rounded-2xl border border-app-yellow bg-app-yellow-light px-4 py-3 text-xs leading-relaxed text-[#8a5a00]">
          <IoWarningOutline size={18} className="mt-0.5 shrink-0 text-[#c49a00]" />
          <span>
            <b>False reports</b> violate our Community Guidelines and may result in account
            suspension. Only report genuine violations.
          </span>
        </p>

        <div className="grid grid-cols-2 rounded-2xl bg-gray-heavy/40 p-1">
          {(['LISTING', 'USER'] as const).map((t) => (
            <span
              key={t}
              className={cn(
                'font-heading flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold',
                type === t ? 'bg-primary text-white' : 'text-muted'
              )}
            >
              {t === 'LISTING' ? <IoHomeOutline size={16} /> : <IoPersonOutline size={16} />}
              {t === 'LISTING' ? 'Listing' : 'User'}
            </span>
          ))}
        </div>

        <div className="rounded-2xl bg-white px-4 py-4 shadow-card">
          <p className="text-[11px] text-muted">
            Reporting {type === 'LISTING' ? 'listing' : 'user'}
          </p>
          <p className="font-heading truncate text-[15px] font-bold text-ink">
            {targetName || `#${listingId ?? userId}`}
          </p>
          <span className="font-heading mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
            {type === 'LISTING' ? `LST-${listingId}` : `USR-${userId}`}
          </span>
        </div>

        <ol className="flex items-start justify-around">
          {steps.map((label, i) => {
            const n = i + 1;
            const active = n <= step;
            return (
              <li key={label} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'font-heading flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                    active ? 'bg-primary text-white' : 'bg-white text-muted'
                  )}
                >
                  {n}
                </span>
                <span
                  className={cn(
                    'font-heading text-[10px] font-bold tracking-wider',
                    active ? 'text-primary' : 'text-muted'
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <section>
            <h2 className="font-heading mb-3 text-xs font-bold tracking-wider text-muted">
              1 — SELECT {type === 'USER' ? 'REASON' : 'CATEGORY'}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {reasons.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReason(r.id)}
                  className={cn(
                    'rounded-2xl border-[1.5px] bg-white p-4 text-left shadow-card transition',
                    reason === r.id ? 'border-primary' : 'border-transparent'
                  )}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: r.bg, color: r.color }}
                  >
                    <r.icon size={22} />
                  </span>
                  <span className="font-heading mt-3 block text-sm font-bold text-ink">
                    {r.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted">{r.subtitle}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {type === 'LISTING' && step === 2 && (
          <section>
            <h2 className="font-heading mb-3 text-xs font-bold tracking-wider text-muted">
              2 — SELECT REASON
            </h2>
            <div className="space-y-2.5">
              {SUB_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSubReason(r)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-4 text-left text-sm font-semibold text-ink shadow-card',
                    subReason === r ? 'border-primary' : 'border-transparent'
                  )}
                >
                  {r}
                  {subReason === r ? (
                    <IoRadioButtonOn size={20} className="text-primary" />
                  ) : (
                    <IoRadioButtonOff size={20} className="text-muted" />
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === lastStep && (
          <section>
            <h2 className="font-heading mb-3 text-xs font-bold tracking-wider text-muted">
              {lastStep} — ADD DETAILS
            </h2>
            {selected && (
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-card">
                <selected.icon size={14} style={{ color: selected.color }} /> {selected.title}
                {subReason ? ` · ${subReason}` : ''}
              </p>
            )}
            <textarea
              aria-label="Details"
              placeholder="Tell us more about what happened (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[140px] w-full rounded-2xl border border-gray-heavy bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
        <div className="mx-auto flex max-w-2xl gap-2 rounded-3xl bg-white p-4 shadow-float">
          {step > 1 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button className="flex-[2]" onClick={next} loading={submitting}>
            {step < lastStep ? 'Next' : 'Submit Report'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense>
      <ReportView />
    </Suspense>
  );
}
