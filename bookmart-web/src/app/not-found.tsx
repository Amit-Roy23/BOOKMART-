import { BookX } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <BookX className="h-14 w-14 text-brand-primary" />
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        This page has been checked out. Try the home page instead.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Back to home
      </Link>
    </div>
  );
}
