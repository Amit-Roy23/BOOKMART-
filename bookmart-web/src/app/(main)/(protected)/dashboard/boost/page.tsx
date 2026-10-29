'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Rocket,
  Smartphone,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  BookCover,
  Button,
  Card,
  EmptyState,
  PageHeader,
  PageLoader,
  Spinner,
} from '@/components/ui/primitives';
import { useBoostPlans, useMyListings } from '@/hooks/use-api';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn, formatDate, formatPrice, listingCover } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { BoostConfirmResponse, BoostInitiateResponse, BoostPlan, Listing } from '@/types/api';

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'CARD', label: 'Card', icon: CreditCard },
  { id: 'WALLET', label: 'Wallet', icon: Wallet },
];

const BENEFITS = [
  { icon: TrendingUp, text: 'Shown in the Featured row on everyone’s home feed' },
  { icon: Zap, text: 'Highlighted with a Featured badge in search and on the map' },
  { icon: BadgeCheck, text: 'Reach more buyers and sell faster' },
];

type Step = 'select' | 'processing' | 'success';

function BoostView() {
  const params = useSearchParams();
  const toast = useToast();
  const qc = useQueryClient();
  const { data: listings = [], isLoading: loadingListings } = useMyListings();
  const { data: plans = [], isLoading: loadingPlans } = useBoostPlans();
  const [listingId, setListingId] = useState<number | null>(null);
  const [planId, setPlanId] = useState<number | null>(null);
  const [method, setMethod] = useState('UPI');
  const [step, setStep] = useState<Step>('select');
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<{
    confirm: BoostConfirmResponse;
    listing: Listing;
    plan: BoostPlan;
  } | null>(null);

  const eligible = useMemo(
    () => listings.filter((l) => l.status === 'AVAILABLE' && !l.is_boosted),
    [listings]
  );
  const boosted = useMemo(() => listings.filter((l) => l.is_boosted), [listings]);

  useEffect(() => {
    const requested = Number(params.get('listing'));
    /* eslint-disable react-hooks/set-state-in-effect -- pick sensible defaults once data loads */
    if (!listingId && eligible.length) {
      setListingId(eligible.find((l) => l.id === requested)?.id ?? eligible[0].id);
    }
    if (!planId && plans.length) setPlanId(plans[Math.min(1, plans.length - 1)].id);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [eligible, plans, params, listingId, planId]);

  const listing = eligible.find((l) => l.id === listingId);
  const plan = plans.find((p) => p.id === planId);

  const pay = async () => {
    if (!listing || !plan) return;
    setStep('processing');
    setStatusText('Initiating secure order…');
    try {
      const { data: order } = await api.post<BoostInitiateResponse>(
        ENDPOINTS.MARKETPLACE.BOOST_INITIATE(listing.id),
        { plan_id: plan.id, payment_method: method }
      );
      setStatusText('Verifying payment with gateway…');
      const { data: confirmed } = await api.post<BoostConfirmResponse>(
        ENDPOINTS.MARKETPLACE.BOOST_CONFIRM(order.order_id),
        { gateway_transaction_id: order.payment_session?.gateway_order_id ?? '' }
      );
      for (const key of ['seller-listings', 'listings', 'listing', 'home-feed']) {
        qc.invalidateQueries({ queryKey: [key] });
      }
      setResult({ confirm: confirmed, listing, plan });
      setStep('success');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Payment failed. You have not been charged.'));
      setStep('select');
    }
  };

  if (loadingListings || loadingPlans) return <PageLoader />;

  if (step === 'processing') {
    return (
      <Card className="mx-auto max-w-md py-14 text-center">
        <Spinner className="mx-auto h-10 w-10" />
        <p className="mt-4 font-semibold text-slate-700">{statusText}</p>
        <p className="mt-1 text-xs text-slate-400">Please don’t close this page.</p>
      </Card>
    );
  }

  if (step === 'success' && result) {
    const { listing: boostedListing, plan: boostedPlan, confirm } = result;
    return (
      <Card className="mx-auto max-w-md py-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Listing boosted!</h1>
        <p className="mt-2 text-sm text-slate-500">
          <b>{boostedListing.book.title}</b> is featured with the {boostedPlan.name} plan
          {confirm.boost_expires_at ? ` until ${formatDate(confirm.boost_expires_at)}` : ''}.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Paid {formatPrice(boostedPlan.price)} via {method}.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href={`/listings/${boostedListing.id}`}>
            <Button>View listing</Button>
          </Link>
          <Link href="/dashboard/listings">
            <Button variant="outline">My listings</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Boost a listing" description="Put your book in front of more buyers." />

      <div className="grid gap-3 sm:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4"
          >
            <Icon className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-slate-700">{text}</p>
          </div>
        ))}
      </div>

      {eligible.length === 0 ? (
        <EmptyState
          icon={Rocket}
          title={
            listings.length
              ? 'All your active listings are already boosted'
              : 'No listings to boost'
          }
          description="Only available listings that aren’t currently boosted can be boosted."
          action={
            <Link href="/sell">
              <Button>Sell a book</Button>
            </Link>
          }
        />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={Rocket}
          title="No boost plans available"
          description="Please check back later."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <Card>
              <h2 className="mb-3 font-bold text-slate-900">1. Choose a listing</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {eligible.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setListingId(l.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-2 text-left transition',
                      listingId === l.id
                        ? 'border-brand-primary bg-brand-light'
                        : 'border-slate-200 hover:border-brand-primary'
                    )}
                  >
                    <span className="h-14 w-10 shrink-0 overflow-hidden rounded bg-slate-100">
                      <BookCover src={listingCover(l)} alt="" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {l.book.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatPrice(l.price)} · {l.views_count} views
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-3 font-bold text-slate-900">2. Pick a plan</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    className={cn(
                      'rounded-2xl border-2 p-4 text-left transition',
                      planId === p.id
                        ? 'border-brand-primary bg-brand-light'
                        : 'border-slate-200 hover:border-brand-primary'
                    )}
                  >
                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                    <p className="mt-1 text-2xl font-extrabold text-brand-dark">
                      {formatPrice(p.price)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {p.duration_days} day{p.duration_days > 1 ? 's' : ''} ·{' '}
                      {formatPrice(parseFloat(p.price) / p.duration_days)}/day
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-3 font-bold text-slate-900">3. Payment method</h2>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition',
                      method === id
                        ? 'border-brand-primary bg-brand-light text-brand-dark'
                        : 'border-slate-200 text-slate-600'
                    )}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <Card className="space-y-4 self-start lg:sticky lg:top-24">
            <h2 className="font-bold text-slate-900">Order summary</h2>
            {listing && (
              <div className="flex items-center gap-3">
                <span className="h-16 w-12 shrink-0 overflow-hidden rounded bg-slate-100">
                  <BookCover src={listingCover(listing)} alt="" />
                </span>
                <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                  {listing.book.title}
                </p>
              </div>
            )}
            {plan && (
              <dl className="space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Plan</dt>
                  <dd className="font-semibold">{plan.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Duration</dt>
                  <dd className="font-semibold">{plan.duration_days} days</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Payment</dt>
                  <dd className="font-semibold">{method}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-extrabold text-brand-dark">{formatPrice(plan.price)}</dd>
                </div>
              </dl>
            )}
            <Button className="w-full" size="lg" disabled={!listing || !plan} onClick={pay}>
              <Rocket className="h-4 w-4" /> Pay &amp; boost
            </Button>
          </Card>
        </div>
      )}

      {boosted.length > 0 && (
        <Card>
          <h2 className="mb-3 font-bold text-slate-900">Currently boosted</h2>
          <ul className="divide-y divide-slate-100">
            {boosted.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <Link href={`/listings/${l.id}`} className="font-semibold hover:text-brand-primary">
                  {l.book.title}
                </Link>
                <span className="text-xs text-slate-500">
                  {l.boost_expires_at ? `Until ${formatDate(l.boost_expires_at)}` : 'Active'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

export default function BoostPage() {
  return (
    <Suspense>
      <BoostView />
    </Suspense>
  );
}
