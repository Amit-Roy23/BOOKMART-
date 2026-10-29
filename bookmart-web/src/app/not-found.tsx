import Link from 'next/link';
import { IoBookOutline } from 'react-icons/io5';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-6 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-primary shadow-card">
        <IoBookOutline size={44} />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-muted">
        This page has been checked out. Try the home page instead.
      </p>
      <Link
        href="/"
        className="font-heading mt-8 flex h-14 items-center rounded-full bg-primary px-10 text-base font-bold text-white"
      >
        Back to Home
      </Link>
    </div>
  );
}
