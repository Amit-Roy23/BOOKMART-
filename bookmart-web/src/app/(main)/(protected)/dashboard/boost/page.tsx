'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  IoArrowForward,
  IoCard,
  IoCheckmarkCircle,
  IoFlash,
  IoPhonePortraitOutline,
  IoRadioButtonOff,
  IoRadioButtonOn,
  IoRocket,
  IoRocketOutline,
  IoTimeOutline,
  IoWallet,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { BookCover, Button, EmptyState, PageLoader, Spinner } from '@/components/ui/primitives';
import { useBoostPlans, useMyListings } from '@/hooks/use-api';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn, formatDate, formatPrice, listingAuthors, listingCover } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { BoostConfirmResponse, BoostInitiateResponse, BoostPlan, Listing } from '@/types/api';

// Mirrors the app's BoostListingScreen (SELECT → PAYMENT → PROCESSING → SUCCESS).

const FEATURES = [
  'Top Placement in Home & Search',
  'Highlighted "Boosted" Badge',
  'Priority WhatsApp Buyer Leads',
];
const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', sub: 'GPay, PhonePe, Paytm', icon: IoPhonePortraitOutline },
  { id: 'CARD', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: IoCard },
  { id: 'WALLET', label: 'Wallet', sub: 'Paytm, Amazon Pay', icon: IoWallet },
];

type Step = 'SELECT' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS';

function BoostView() {
  const params = useSearchParams();
  const toast = useToast();
  const qc = useQueryClient();
  const { data: listings = [], isLoading: loadingListings } = useMyListings();
  const { data: plans = [], isLoading: loadingPlans } = useBoostPlans();
  const [listingId, setListingId] = useState<number | null>(null);
  const [planId, setPlanId] = useState<number | null>(null);
  const [method, setMethod] = useState('UPI');
  const [step, setStep] = useState<Step>('SELECT');
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<{
    confirm: BoostConfirmResponse;
    listing: Listing;
    plan: BoostPlan;
  } | null>(null);

  const available = useMemo(() => listings.filter((l) => l.status === 'AVAILABLE'), [listings]);
  const eligible = useMemo(() => available.filter((l) => !l.is_boosted), [available]);

  useEffect(() => {
    const requested = Number(params.get('listing'));
    /* eslint-disable react-hooks/set-state-in-effect -- default selections once data loads */
    if (!listingId && eligible.length)
      setListingId(eligible.find((l) => l.id === requested)?.id ?? eligible[0].id);
    if (!planId && plans.length) setPlanId(plans[Math.min(1, plans.length - 1)].id);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [eligible, plans, params, listingId, planId]);

  const listing = eligible.find((l) => l.id === listingId);
  const plan = plans.find((p) => p.id === planId);

  const pay = async () => {
    if (!listing || !plan) return;
    setStep('PROCESSING');
    setStatusText('Initiating secure order...');
    try {
      const { data: order } = await api.post<BoostInitiateResponse>(
        ENDPOINTS.MARKETPLACE.BOOST_INITIATE(listing.id),
        {
          plan_id: plan.id,
          payment_method: method,
        }
      );
      setStatusText('Verifying payment with gateway...');
      const { data: confirm } = await api.post<BoostConfirmResponse>(
        ENDPOINTS.MARKETPLACE.BOOST_CONFIRM(order.order_id),
        {
          gateway_transaction_id: order.payment_session?.gateway_order_id ?? '',
        }
      );
      for (const key of ['seller-listings', 'listings', 'listing', 'home-feed']) {
        qc.invalidateQueries({ queryKey: [key] });
      }
      setResult({ confirm, listing, plan });
      setStep('SUCCESS');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Payment failed. You have not been charged.'));
      setStep('PAYMENT');
    }
  };

  if (loadingListings || loadingPlans) return <PageLoader />;

  if (step === 'PROCESSING') {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <Spinner className="h-12 w-12" />
        <p className="font-heading mt-6 font-semibold text-ink">{statusText}</p>
        <p className="mt-1 text-xs text-muted">Please don&apos;t close this page.</p>
      </div>
    );
  }

  if (step === 'SUCCESS' && result) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-app-green-light">
          <IoCheckmarkCircle size={64} className="text-app-green" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-ink">Listing Boosted!</h1>
        <p className="mt-2 max-w-xs text-sm text-muted">
          <b className="text-ink">{result.listing.book.title}</b> is now featured with the{' '}
          {result.plan.name} plan
          {result.confirm.boost_expires_at
            ? ` until ${formatDate(result.confirm.boost_expires_at)}`
            : ''}
          .
        </p>
        <p className="mt-1 text-sm text-muted">
          Paid {formatPrice(result.plan.price)} via {method}
        </p>
        <div className="mt-8 w-full max-w-xs space-y-3">
          <Link href={`/listings/${result.listing.id}`} className="block">
            <Button className="w-full">View Listing</Button>
          </Link>
          <Link href="/dashboard/listings" className="block">
            <Button variant="outline" className="w-full">
              My Listings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl pb-28">
      <ScreenHeader title={step === 'PAYMENT' ? 'Payment' : 'Boost Listing'} fallback="/profile" />
      <div className="space-y-6 px-6">
        {step === 'SELECT' && (
          <>
            <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-secondary p-4">
              <div className="flex-1">
                <p className="font-heading text-lg font-bold text-ink">Boost Your Listing</p>
                <p className="text-xs text-muted">
                  Get 3x more visibility, reach verified campus buyers, and sell faster.
                </p>
              </div>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-card">
                <IoRocket size={28} />
              </span>
            </div>

            {available.length === 0 ? (
              <EmptyState
                icon={IoRocketOutline}
                title="No listings to boost"
                description="List a book first, then boost it to reach more buyers."
                action={
                  <Link href="/sell">
                    <Button size="md">List a Book</Button>
                  </Link>
                }
              />
            ) : (
              <>
                <section>
                  <h2 className="mb-3 text-base font-bold text-ink">1. Target Book Listing</h2>
                  <div className="space-y-2.5">
                    {available.map((l) => {
                      const boosted = l.is_boosted;
                      const selected = listingId === l.id;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          disabled={boosted}
                          onClick={() => setListingId(l.id)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-2xl border bg-white p-2.5 text-left shadow-card transition',
                            selected ? 'border-primary bg-secondary' : 'border-transparent',
                            boosted && 'cursor-not-allowed opacity-80'
                          )}
                        >
                          <span className="h-[62px] w-12 shrink-0 overflow-hidden rounded-lg bg-app-bg">
                            <BookCover src={listingCover(l)} alt="" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="font-heading block truncate text-sm font-bold text-ink">
                              {l.book.title}
                            </span>
                            <span className="block truncate text-xs text-muted">
                              {listingAuthors(l)}
                            </span>
                            <span className="font-heading text-sm font-bold text-primary">
                              {formatPrice(l.price)}
                            </span>
                          </span>
                          {boosted ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-app-green px-2 py-0.5 text-[10px] font-bold text-white">
                              <IoFlash size={10} /> Boosted
                            </span>
                          ) : selected ? (
                            <IoRadioButtonOn size={24} className="text-primary" />
                          ) : (
                            <IoRadioButtonOff size={24} className="text-muted" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h2 className="mb-3 text-base font-bold text-ink">2. Choose Boost Plan</h2>
                  <div className="space-y-3">
                    {plans.map((p, i) => {
                      const selected = planId === p.id;
                      const badge = i === 1 ? 'MOST POPULAR' : i === 2 ? 'BEST VALUE' : null;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPlanId(p.id)}
                          className={cn(
                            'w-full rounded-2xl border-2 bg-white p-4 text-left shadow-card transition',
                            selected ? 'border-primary bg-secondary/60' : 'border-transparent'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p
                                className={cn(
                                  'font-heading text-lg font-bold',
                                  selected ? 'text-primary' : 'text-ink'
                                )}
                              >
                                {p.name}
                              </p>
                              <p className="flex items-center gap-1 text-xs text-muted">
                                <IoTimeOutline size={13} /> Active for {p.duration_days} days
                              </p>
                            </div>
                            {badge && (
                              <span
                                className={cn(
                                  'font-heading rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wide text-white',
                                  i === 1 ? 'bg-primary' : 'bg-app-purple'
                                )}
                              >
                                {badge}
                              </span>
                            )}
                          </div>
                          <ul className="mt-3 space-y-1.5 border-t border-gray-light pt-3">
                            {FEATURES.map((f) => (
                              <li key={f} className="flex items-center gap-2 text-xs text-text">
                                <IoCheckmarkCircle size={14} className="text-primary" /> {f}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-3">
                            <span className="font-heading text-2xl font-bold text-primary">
                              {formatPrice(p.price)}
                            </span>
                            <span className="text-xs text-muted"> / total</span>
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {step === 'PAYMENT' && listing && plan && (
          <>
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
              <span className="h-[62px] w-12 shrink-0 overflow-hidden rounded-lg bg-app-bg">
                <BookCover src={listingCover(listing)} alt="" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading truncate text-sm font-bold text-ink">
                  {listing.book.title}
                </p>
                <p className="text-xs text-muted">
                  {plan.name} · {plan.duration_days} days
                </p>
              </div>
              <span className="font-heading text-lg font-bold text-primary">
                {formatPrice(plan.price)}
              </span>
            </div>
            <section>
              <h2 className="mb-3 text-base font-bold text-ink">Payment Method</h2>
              <div className="space-y-2.5">
                {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-card',
                      method === id ? 'border-primary bg-secondary' : 'border-transparent'
                    )}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                      <Icon size={20} />
                    </span>
                    <span className="flex-1">
                      <span className="font-heading block text-sm font-bold text-ink">{label}</span>
                      <span className="text-xs text-muted">{sub}</span>
                    </span>
                    {method === id ? (
                      <IoRadioButtonOn size={22} className="text-primary" />
                    ) : (
                      <IoRadioButtonOff size={22} className="text-muted" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {available.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-6 pb-5">
          <div className="mx-auto flex max-w-2xl gap-2">
            {step === 'PAYMENT' && (
              <Button
                variant="outline"
                className="flex-1 rounded-[14px]"
                onClick={() => setStep('SELECT')}
              >
                Back
              </Button>
            )}
            <Button
              className="flex-[2] rounded-[14px] shadow-float"
              disabled={!listing || !plan}
              onClick={() => (step === 'SELECT' ? setStep('PAYMENT') : pay())}
            >
              {step === 'SELECT' ? (
                <>
                  Continue to Pay {plan ? formatPrice(plan.price) : ''} <IoArrowForward size={18} />
                </>
              ) : (
                `Pay ${plan ? formatPrice(plan.price) : ''}`
              )}
            </Button>
          </div>
        </div>
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
