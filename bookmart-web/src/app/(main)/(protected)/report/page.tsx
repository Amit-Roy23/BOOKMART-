'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Flag, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import {
  Button,
  Card,
  Chip,
  EmptyState,
  PageHeader,
  Skeleton,
  Textarea,
} from '@/components/ui/primitives';
import { api, fetchAllPages, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn, formatDate } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { Report, ReportType } from '@/types/api';

// Reason codes accepted by apps/reports in bookmart-backend.
const REASONS: Record<ReportType, { id: string; title: string; subtitle: string }[]> = {
  LISTING: [
    { id: 'SCAM', title: 'Scam / Fraud', subtitle: 'Deceptive or fraudulent activity' },
    { id: 'FAKE_LISTING', title: 'Fake listing', subtitle: 'Doesn’t exist or is misrepresented' },
    { id: 'INAPPROPRIATE', title: 'Inappropriate', subtitle: 'Offensive or harmful content' },
    { id: 'SPAM', title: 'Spam', subtitle: 'Unsolicited or repetitive content' },
    { id: 'WRONG_CATEGORY', title: 'Wrong category', subtitle: 'Listed in the incorrect category' },
    { id: 'OTHER', title: 'Other', subtitle: 'Something else' },
  ],
  USER: [
    { id: 'HARASSMENT', title: 'Harassment', subtitle: 'Threats or unwanted contact' },
    { id: 'FAKE_ACCOUNT', title: 'Fake account', subtitle: 'Impersonation or false identity' },
    { id: 'SPAM_ACTIVITY', title: 'Spam activity', subtitle: 'Posting excessive messages' },
    { id: 'ABUSE', title: 'Abuse', subtitle: 'Inappropriate profile or posts' },
  ],
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  UNDER_REVIEW: 'bg-sky-50 text-sky-700',
  RESOLVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-slate-100 text-slate-500',
};

function MyReports() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => fetchAllPages<Report>(ENDPOINTS.REPORTS.ME),
  });
  if (isLoading) return <Skeleton className="h-40" />;
  if (reports.length === 0) {
    return (
      <EmptyState
        icon={Flag}
        title="No reports"
        description="Reports you submit will appear here."
      />
    );
  }
  return (
    <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
      {reports.map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 p-4">
          <div>
            <p className="font-semibold text-slate-900">
              {r.report_type === 'LISTING'
                ? (r.reported_listing?.book.title ?? 'Deleted listing')
                : (r.reported_user?.full_name ?? 'Deleted user')}
            </p>
            <p className="text-xs text-slate-500">
              {r.report_type === 'LISTING' ? 'Listing' : 'User'} ·{' '}
              {r.reason.replace(/_/g, ' ').toLowerCase()} · {formatDate(r.created_at)}
            </p>
          </div>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-bold',
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
  const [tab, setTab] = useState<'new' | 'mine'>(
    params.get('tab') === 'mine' || !type ? 'mine' : 'new'
  );
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !reason) return toast.error('Choose a reason.');
    setSubmitting(true);
    try {
      await api.post(ENDPOINTS.REPORTS.LIST, {
        report_type: type,
        reason,
        details: details.trim(),
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
      <Card className="mx-auto max-w-md py-10 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h1 className="mt-4 text-xl font-extrabold text-slate-900">Report submitted</h1>
        <p className="mt-2 text-sm text-slate-500">
          Thanks for keeping Bookmart safe. Our team will review it shortly.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => router.back()}>Go back</Button>
          <Button
            variant="outline"
            onClick={() => {
              setTab('mine');
              setSubmitted(false);
            }}
          >
            My reports
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Report" description="Help us keep the marketplace safe and trustworthy." />

      <div className="flex gap-2">
        {type && (
          <Chip active={tab === 'new'} onClick={() => setTab('new')}>
            New report
          </Chip>
        )}
        <Chip active={tab === 'mine'} onClick={() => setTab('mine')}>
          My reports
        </Chip>
      </div>

      {tab === 'mine' ? (
        <>
          <MyReports />
          {!type && (
            <p className="text-center text-xs text-slate-500">
              To report a listing or user, open it and choose “Report”.{' '}
              <Link href="/search" className="font-semibold text-brand-primary hover:underline">
                Browse books
              </Link>
            </p>
          )}
        </>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <Card className="flex items-center gap-3 bg-rose-50/60">
            <ShieldAlert className="h-6 w-6 shrink-0 text-rose-500" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700/70">
                Reporting {type === 'LISTING' ? 'listing' : 'user'}
              </p>
              <p className="font-bold text-slate-900">{targetName || `#${listingId ?? userId}`}</p>
            </div>
          </Card>
          <Card className="space-y-3">
            <h2 className="font-bold text-slate-900">What’s wrong?</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {REASONS[type!].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReason(r.id)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition',
                    reason === r.id
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-slate-200 hover:border-rose-300'
                  )}
                >
                  <span className="block text-sm font-bold text-slate-900">{r.title}</span>
                  <span className="block text-xs text-slate-500">{r.subtitle}</span>
                </button>
              ))}
            </div>
            <Textarea
              label="Details"
              placeholder="Tell us what happened (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Card>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={submitting} disabled={!reason}>
              <Flag className="h-4 w-4" /> Submit report
            </Button>
          </div>
        </form>
      )}
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
