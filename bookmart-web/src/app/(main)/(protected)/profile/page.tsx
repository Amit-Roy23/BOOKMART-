'use client';

import {
  BarChart3,
  Bell,
  ChevronRight,
  ClipboardList,
  Eye,
  FileText,
  Flag,
  GraduationCap,
  Heart,
  HelpCircle,
  Info,
  LayoutList,
  LogOut,
  type LucideIcon,
  MapPin,
  MessageCircle,
  PackageCheck,
  Pencil,
  Rocket,
  Share2,
  Shield,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Card } from '@/components/ui/primitives';
import { formatCompact } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

const QUICK_ACTIONS = [
  {
    href: '/contacts',
    label: 'Contacts',
    icon: MessageCircle,
    className: 'bg-sky-50 text-sky-600',
  },
  {
    href: '/dashboard/sold',
    label: 'Sold books',
    icon: PackageCheck,
    className: 'bg-emerald-50 text-emerald-600',
  },
  {
    href: '/favourites',
    label: 'My interests',
    icon: Heart,
    className: 'bg-rose-50 text-rose-600',
  },
  {
    href: '/requests?tab=mine',
    label: 'Requests',
    icon: ClipboardList,
    className: 'bg-amber-50 text-amber-600',
  },
];

function MenuRow({
  href,
  icon: Icon,
  title,
  subtitle,
  badge,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl px-2 py-3 transition hover:bg-slate-50"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light">
        <Icon className="h-5 w-5 text-brand-primary" />
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          {title}
          {badge && (
            <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-900">
              {badge}
            </span>
          )}
        </span>
        {subtitle && <span className="block text-xs text-slate-500">{subtitle}</span>}
      </span>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </Link>
  );
}

export default function ProfilePage() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();
  if (!profile) return null;

  const share = async () => {
    const url = `${window.location.origin}/sellers/${profile.user_id}`;
    try {
      if (navigator.share)
        await navigator.share({ title: `${profile.full_name} on Bookmart`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success('Profile link copied');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary to-brand-dark p-6 text-white md:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar
            src={profile.image}
            name={profile.full_name}
            size={88}
            className="ring-4 ring-white/30"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">{profile.full_name}</h1>
            <p className="text-sm text-white/80">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/85">
              {profile.college && (
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" /> {profile.college.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {profile.city_location || 'Location not set'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="bg-white/15 text-white hover:bg-white/25"
              onClick={share}
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Link href="/profile/edit">
              <Button className="bg-white text-brand-dark hover:bg-brand-light">
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative z-10 mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Profile views', value: profile.profile_views, icon: Eye },
            { label: 'WhatsApp contacts', value: profile.whatsapp_contacts, icon: MessageCircle },
            { label: 'Active listings', value: profile.active_listings_count, icon: BookOpen },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-white/10 p-3 text-center">
              <Icon className="mx-auto h-4 w-4 text-white/80" />
              <p className="mt-1 text-xl font-extrabold">{formatCompact(value)}</p>
              <p className="text-[11px] text-white/75">{label}</p>
            </div>
          ))}
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map(({ href, label, icon: Icon, className }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full ${className}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            {label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-3">
          <h2 className="px-2 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Seller tools
          </h2>
          <MenuRow
            href="/dashboard/listings"
            icon={LayoutList}
            title="Manage listings"
            subtitle="Edit, delete or update your books"
          />
          <MenuRow
            href="/dashboard/boost"
            icon={Rocket}
            title="Boost listing"
            subtitle="Increase visibility, get more buyers"
            badge="PRO"
          />
          <MenuRow
            href="/dashboard/analytics"
            icon={BarChart3}
            title="Analytics"
            subtitle="Views and interest on your books"
          />
          <MenuRow
            href={`/sellers/${profile.user_id}`}
            icon={Eye}
            title="Public profile"
            subtitle="See what buyers see"
          />
        </Card>
        <Card className="p-3">
          <h2 className="px-2 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Account
          </h2>
          <MenuRow
            href="/profile/edit"
            icon={Pencil}
            title="Edit profile"
            subtitle="Update your personal details"
          />
          <MenuRow
            href="/profile/addresses"
            icon={MapPin}
            title="Saved address"
            subtitle="Your pickup area"
          />
          <MenuRow
            href="/notifications"
            icon={Bell}
            title="Notifications"
            subtitle="Buyer interest and alerts"
          />
          <MenuRow
            href="/report?tab=mine"
            icon={Flag}
            title="My reports"
            subtitle="Reports you’ve submitted"
          />
        </Card>
        <Card className="p-3 md:col-span-2">
          <h2 className="px-2 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            General
          </h2>
          <div className="grid md:grid-cols-2 md:gap-x-4">
            <MenuRow href="/help" icon={HelpCircle} title="Help & support" />
            <MenuRow href="/faqs" icon={Info} title="FAQs" />
            <MenuRow href="/privacy" icon={Shield} title="Privacy policy" />
            <MenuRow href="/terms" icon={FileText} title="Terms & conditions" />
            <MenuRow href="/about" icon={BookOpen} title="About Bookmart" />
          </div>
        </Card>
      </div>

      <Button
        variant="outline"
        className="w-full border-rose-200 text-rose-600 hover:border-rose-400 hover:text-rose-700"
        onClick={async () => {
          if (!confirm('Log out of Bookmart?')) return;
          await signOut();
          router.replace('/login');
        }}
      >
        <LogOut className="h-4 w-4" /> Logout
      </Button>
    </div>
  );
}
