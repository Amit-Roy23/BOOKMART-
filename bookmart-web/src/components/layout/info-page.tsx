import { IoConstructOutline } from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';

/** Static pages (About, Help, FAQs, Terms, Privacy) in the app's inner-screen style. */
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
    <article className="mx-auto max-w-3xl pb-10">
      <ScreenHeader title={title} fallback="/profile" />
      <div className="px-6">
        {intro && <p className="text-sm text-muted">{intro}</p>}
        <div className="mt-5 space-y-4">
          {children ?? (
            <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center shadow-card">
              <IoConstructOutline size={48} className="text-gray-heavy" />
              <p className="font-heading mt-4 font-bold text-ink">Coming soon</p>
              <p className="mt-1 text-sm text-muted">
                We’re working on this page. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="mb-2 text-base font-bold text-ink">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-text">{children}</div>
    </section>
  );
}
