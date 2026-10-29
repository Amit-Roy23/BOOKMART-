import type { IconType } from 'react-icons';
import { IoArrowBack } from 'react-icons/io5';
import Link from 'next/link';

/** Icon circle + title + subtitle heading used on the app's auth screens. */
export function AuthHero({
  icon: Icon,
  title,
  subtitle,
  backHref,
}: {
  icon: IconType;
  title: string;
  subtitle?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="mb-6 pt-8">
      {backHref && (
        <Link href={backHref} aria-label="Go back" className="mb-6 inline-block text-text">
          <IoArrowBack size={24} />
        </Link>
      )}
      <div className="flex flex-col items-center text-center">
        <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-darker-teal text-primary">
          <Icon size={28} />
        </span>
        <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}

export function AuthCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl bg-white p-6 shadow-card">{children}</div>;
}
