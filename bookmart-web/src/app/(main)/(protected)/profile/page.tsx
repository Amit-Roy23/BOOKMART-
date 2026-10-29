'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoBagHandleOutline,
  IoBarChartOutline,
  IoChatbubbleEllipsesOutline,
  IoChatbubblesOutline,
  IoChevronForward,
  IoClipboardOutline,
  IoDocumentTextOutline,
  IoEllipsisVertical,
  IoEyeOutline,
  IoFlagOutline,
  IoHeartOutline,
  IoHelpBuoyOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoLocationOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoRocketOutline,
  IoShareSocialOutline,
  IoShieldCheckmark,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { Avatar } from '@/components/ui/primitives';
import { useNotifications } from '@/hooks/use-api';
import { cn, formatCompact, timeAgo } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

// Layout follows the app's Profile.screen.tsx.

const QUICK_ACTIONS = [
  {
    href: '/contacts',
    label: 'Contacts',
    icon: IoChatbubbleEllipsesOutline,
    color: '#1877F2',
    bg: '#001aff23',
  },
  {
    href: '/dashboard/sold',
    label: 'Sold Books',
    icon: IoBagHandleOutline,
    color: '#10B981',
    bg: '#10b9811a',
  },
  {
    href: '/favourites',
    label: 'My Interests',
    icon: IoHeartOutline,
    color: '#EF4545',
    bg: '#ef44441a',
  },
  {
    href: '/requests?tab=mine',
    label: 'Requests',
    icon: IoClipboardOutline,
    color: '#D9A400',
    bg: '#f59e0b1a',
  },
];

function MenuTile({
  href,
  icon: Icon,
  title,
  subtitle,
  color = '#333333',
  bg = '#F2F4F4',
  badge,
  danger,
  onClick,
}: {
  href?: string;
  icon: IconType;
  title: string;
  subtitle?: string;
  color?: string;
  bg?: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{
          background: danger ? 'rgba(239,68,68,0.1)' : bg,
          color: danger ? '#EF4545' : color,
        }}
      >
        <Icon size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'font-heading block text-sm font-semibold',
            danger ? 'text-app-red' : 'text-ink'
          )}
        >
          {title}
        </span>
        {subtitle && <span className="block truncate text-xs text-muted">{subtitle}</span>}
      </span>
      {badge ? (
        <span className="font-heading rounded-full bg-app-yellow px-2 py-0.5 text-[10px] font-bold text-ink">
          {badge}
        </span>
      ) : (
        <IoChevronForward size={20} className={danger ? 'text-app-red' : 'text-muted'} />
      )}
    </>
  );
  const className =
    'flex w-full items-center gap-4 rounded-2xl bg-white px-4 py-4 text-left shadow-card transition hover:-translate-y-0.5';
  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }
  return (
    <Link href={href!} className={className}>
      {content}
    </Link>
  );
}

export default function ProfilePage() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { data: notifications = [] } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!profile) return null;

  const share = async (path: string, title: string) => {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  const logout = async () => {
    if (!confirm('Are you sure you want to log out?')) return;
    await signOut();
    router.replace('/login');
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-primary to-app-bg px-6 pb-6 pt-5 md:rounded-b-[32px]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">My Profile</h1>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More options"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 bg-white/10 text-white"
            >
              <IoEllipsisVertical size={20} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl bg-white py-1 shadow-float">
                <button
                  onClick={() =>
                    share(`/sellers/${profile.user_id}`, `${profile.full_name} on Bookmart`)
                  }
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text hover:bg-app-bg"
                >
                  <IoShareSocialOutline size={18} /> Share Profile
                </button>
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-text hover:bg-app-bg"
                >
                  <IoPersonOutline size={18} /> Edit Profile
                </Link>
                <Link
                  href={`/sellers/${profile.user_id}`}
                  className="flex items-center gap-3 border-t border-gray-light px-4 py-3 text-sm text-text hover:bg-app-bg"
                >
                  <IoEyeOutline size={18} /> View Public Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Avatar
            src={profile.image}
            name={profile.full_name}
            size={80}
            className="border-[3px] border-white/40 bg-white/20 text-2xl"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-heading truncate text-xl font-bold text-ink">
                {profile.full_name}
              </p>
              <span className="font-heading inline-flex items-center gap-0.5 rounded-full bg-app-yellow px-1.5 py-0.5 text-[10px] font-bold text-ink">
                <IoShieldCheckmark size={11} /> Top Seller
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-text">
              <IoLocationOutline size={13} />{' '}
              {profile.city_location || profile.college?.name || 'N/A'}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x divide-white/25 rounded-2xl bg-[#3f5252]/85 py-4 text-center text-white backdrop-blur">
          {[
            { label: 'Total Views', value: profile.profile_views },
            { label: 'WhatsApp Contacts', value: profile.whatsapp_contacts },
            { label: 'Active Listings', value: profile.active_listings_count },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-heading text-lg font-bold">{formatCompact(value)}</p>
              <p className="text-[10px] text-white/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-6 px-6">
        <section>
          <h2 className="mb-3 text-base font-bold text-ink">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-2.5">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon, color, bg }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white px-1 py-3 shadow-card transition hover:-translate-y-0.5"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: bg, color }}
                >
                  <Icon size={20} />
                </span>
                <span className="text-center text-[11px] font-semibold text-ink">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-ink">Seller Tools</h2>
            <MenuTile
              href="/dashboard/listings"
              icon={IoListOutline}
              title="Manage Listings"
              subtitle="Edit, delete or update your active books"
              color="#008080"
              bg="#00968814"
            />
            <MenuTile
              href="/dashboard/boost"
              icon={IoRocketOutline}
              title="Boost Listing"
              subtitle="Increase visibility and get more buyers"
              color="#F97316"
              bg="#FFF1E6"
              badge="PRO"
            />
            <MenuTile
              href="/dashboard/analytics"
              icon={IoBarChartOutline}
              title="Analytics"
              subtitle="Views and interest on your books"
              color="#AA5AF8"
              bg="#F4EAFE"
            />
          </section>
          <section className="space-y-3">
            <h2 className="text-base font-bold text-ink">Account Settings</h2>
            <MenuTile
              href="/profile/edit"
              icon={IoPersonOutline}
              title="Edit Profile"
              subtitle="Update your personal details"
              color="#1877F2"
              bg="#001aff14"
            />
            <MenuTile
              href="/profile/addresses"
              icon={IoLocationOutline}
              title="Saved Addresses"
              subtitle="Manage your delivery addresses"
              color="#10B981"
              bg="#10b9811a"
            />
            <MenuTile
              href="/notifications"
              icon={IoNotificationsOutline}
              title="Notifications"
              subtitle="Customize your alert preferences"
              color="#008080"
              bg="#00968814"
            />
            <MenuTile
              href="/report?tab=mine"
              icon={IoFlagOutline}
              title="My Reports"
              subtitle="Reports you have submitted"
              color="#EF4545"
              bg="#ef44441a"
            />
          </section>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-ink">General</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <MenuTile href="/help" icon={IoHelpBuoyOutline} title="Help & Support" />
            <MenuTile href="/faqs" icon={IoChatbubblesOutline} title="FAQs" />
            <MenuTile href="/privacy" icon={IoShieldCheckmarkOutline} title="Privacy Policy" />
            <MenuTile href="/terms" icon={IoDocumentTextOutline} title="Terms & Conditions" />
            <MenuTile href="/about" icon={IoInformationCircleOutline} title="About" />
            <MenuTile
              icon={IoShareSocialOutline}
              title="Share App"
              onClick={() => share('/', 'Bookmart – Your Campus Library Companion')}
            />
          </div>
        </section>

        <MenuTile icon={IoLogOutOutline} title="Logout" danger onClick={logout} />

        {notifications.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-ink">Recent Activities</h2>
            {notifications.slice(0, 3).map((n) => (
              <Link
                key={n.id}
                href="/notifications"
                className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  {n.notification_type === 'BUYER_INTEREST' ? (
                    <IoChatbubbleEllipsesOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="font-heading block truncate text-sm font-semibold text-ink">
                    {n.title}
                  </span>
                  <span className="text-xs text-muted">{timeAgo(n.created_at)}</span>
                </span>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
