'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  IoBookOutline,
  IoEyeOutline,
  IoInformationCircleOutline,
  IoPeople,
  IoSchool,
  IoSchoolOutline,
  IoShareSocial,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { HeartButton } from '@/components/book/heart-button';
import { BookCover, Button, EmptyState, Modal, Skeleton } from '@/components/ui/primitives';
import { useCollegeListingCounts, useCollegeListings, useColleges } from '@/hooks/use-api';
import { toBookView } from '@/lib/book-view';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { College } from '@/types/api';

const place = (c: College) => (c.district ? `${c.district}, ${c.state}` : c.state || 'Campus');

/** The app's CollegeInsightsScreen, backed by listings filtered by the seller's college. */
export default function CollegeInsightsPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const [infoOpen, setInfoOpen] = useState(false);
  const college = profile?.college ?? null;
  const { data: listings = [], isLoading } = useCollegeListings(college?.id);
  const { data: colleges = [] } = useColleges('');
  const top = colleges.slice(0, 5);
  const counts = useCollegeListingCounts(top.map((c) => c.id));

  const books = listings.filter((l) => l.status === 'AVAILABLE').map(toBookView);
  const totalViews = listings.reduce((sum, l) => sum + (l.views_count || 0), 0);

  const invite = async () => {
    const url = `${window.location.origin}/register`;
    const text = `Join me on BookMart to buy and sell second-hand books${college ? ` at ${college.name}` : ''}!`;
    try {
      if (navigator.share) await navigator.share({ title: 'BookMart', text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast.success('Invite link copied');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <ScreenHeader
        title="College Insights"
        right={
          <button
            onClick={() => setInfoOpen(true)}
            aria-label="About college insights"
            className="text-primary"
          >
            <IoInformationCircleOutline size={24} />
          </button>
        }
      />

      <div className="space-y-8 pt-2">
        {college ? (
          <section className="px-6">
            <h2 className="text-base font-bold text-text">Your College Activity</h2>
            <p className="mt-1 text-xs text-muted">
              See how many students from your college are using BookMart.
            </p>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <IoSchoolOutline size={20} />
              </span>
              <div className="min-w-0">
                <p className="font-heading truncate text-sm font-bold text-ink">{college.name}</p>
                <p className="truncate text-xs text-muted">{place(college)}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                {
                  icon: IoBookOutline,
                  value: listings.length,
                  title: 'Books Listed',
                  desc: 'By your college',
                },
                {
                  icon: IoEyeOutline,
                  value: totalViews,
                  title: 'Total Views',
                  desc: 'On college books',
                },
              ].map(({ icon: Icon, value, title, desc }) => (
                <div key={title} className="rounded-2xl bg-white p-4 shadow-card">
                  <Icon size={20} className="mb-2 text-primary" />
                  {isLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="font-heading text-2xl font-bold text-ink">{value}</p>
                  )}
                  <p className="font-heading text-sm font-semibold text-text">{title}</p>
                  <p className="text-[11px] text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="px-6">
            <EmptyState
              icon={IoSchoolOutline}
              title="Add your college"
              description="Set your college in your profile to see activity from your campus."
              action={
                <Link href="/profile/edit">
                  <Button size="md">Edit Profile</Button>
                </Link>
              }
            />
          </div>
        )}

        {books.length > 0 && (
          <section>
            <h2 className="mb-3 px-6 text-[15px] font-bold text-text">Books from Your College</h2>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto px-6 pb-2">
              {books.map((b) => (
                <Link key={b.id} href={`/listings/${b.id}`} className="w-36 shrink-0">
                  <div className="relative h-48 overflow-hidden rounded-2xl bg-white shadow-card">
                    <BookCover src={b.cover} alt={b.title} />
                    <HeartButton
                      listingId={b.id}
                      sellerId={b.sellerId}
                      className="absolute right-2 top-2"
                    />
                  </div>
                  <p className="font-heading mt-2 truncate text-sm font-bold text-ink">{b.title}</p>
                  <p className="truncate text-xs text-muted">{b.author}</p>
                  <p className="font-heading text-sm font-bold text-primary">₹{b.price}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                    <IoEyeOutline size={12} /> {b.views}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {top.length > 0 && (
          <section className="px-6">
            <h2 className="text-[15px] font-bold text-text">Participating Colleges</h2>
            <p className="text-xs text-muted">Colleges active on BookMart</p>
            <ul className="mt-3 overflow-hidden rounded-2xl bg-white shadow-card">
              {top.map((c, i) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 border-b border-gray-light px-4 py-3 last:border-0"
                >
                  <span className="font-heading w-4 text-sm font-bold text-muted">{i + 1}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <IoSchool size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading truncate text-sm font-semibold text-ink">{c.name}</p>
                    <p className="truncate text-xs text-muted">{place(c)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-sm font-bold text-primary">
                      {counts[i]?.data ?? '–'}
                    </p>
                    <p className="text-[10px] text-muted">Listed</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mx-6 flex items-center gap-3 rounded-2xl bg-secondary p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-primary">
            <IoPeople size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-sm font-bold text-ink">Invite More Students</p>
            <p className="text-xs text-muted">
              Help more students from your college discover and buy &amp; sell books.
            </p>
          </div>
          <Button size="sm" onClick={invite}>
            <IoShareSocial size={12} /> Invite
          </Button>
        </section>
      </div>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} title="College Insights">
        <p className="text-sm text-text">
          These numbers count listings from sellers who have set the same college in their profile.
          Invite classmates to grow your campus marketplace.
        </p>
      </Modal>
    </div>
  );
}
