import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';

export function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900">{title}</h1>
      {intro && <p className="mt-2 text-slate-600">{intro}</p>}
      <div className="mt-8 space-y-6">
        {children ?? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <Construction className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-bold text-slate-900">Coming soon</p>
            <p className="mt-1 text-sm text-slate-500">
              We’re working on this page. Please check back later.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6">
      <h2 className="mb-2 text-lg font-bold text-slate-900">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}
