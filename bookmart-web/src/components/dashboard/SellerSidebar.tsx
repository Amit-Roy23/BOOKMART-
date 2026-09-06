"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  FileText,
  MessageSquare,
  Bookmark,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/listings", label: "My Listings", icon: BookOpen },
  { href: "/dashboard/boost-listing", label: "Boost Listing", icon: CreditCard },
  { href: "/requests/post", label: "Post Request", icon: FileText },
  { href: "/notifications", label: "Notifications", icon: MessageSquare },
  { href: "/college-insights", label: "College Insights", icon: HelpCircle },
] as const;

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0">
      <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <nav className="space-y-1" aria-label="Seller dashboard">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-brand-light text-brand-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={16} aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 w-full focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
