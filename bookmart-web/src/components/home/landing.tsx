import { BookOpen, MapPin, MessageCircle, Rocket, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/primitives';

const STEPS = [
  {
    icon: Tag,
    title: 'List in minutes',
    text: 'Snap four photos, set a price and your book is live for students nearby.',
  },
  {
    icon: MapPin,
    title: 'Find books near you',
    text: 'Browse on a map or filter by distance, genre, condition and price.',
  },
  {
    icon: MessageCircle,
    title: 'Deal on WhatsApp',
    text: 'Contact sellers directly — no middlemen, no platform fees.',
  },
  {
    icon: Rocket,
    title: 'Boost your listing',
    text: 'Feature your book at the top of the feed to sell it faster.',
  },
];

export function Landing() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary to-brand-dark px-6 py-14 text-white md:px-14 md:py-20">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <BookOpen className="h-3.5 w-3.5" /> Your campus library companion
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
            Buy &amp; sell pre-loved books with students near you.
          </h1>
          <p className="mt-4 text-base text-white/85 md:text-lg">
            Textbooks, competitive exam guides, novels and more — at a fraction of the price.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-white text-brand-dark hover:bg-brand-light">
                Get started — it’s free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                <Search className="h-4 w-4" /> Log in to browse
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-white/5" />
      </section>

      <section>
        <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">
          How Bookmart works
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light">
                <Icon className="h-5 w-5 text-brand-primary" />
              </span>
              <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 text-center shadow-xs md:p-12">
        <h2 className="text-2xl font-bold text-slate-900">Have books gathering dust?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          Turn last semester’s books into cash and help another student save.
        </p>
        <Link href="/register" className="mt-6 inline-block">
          <Button size="lg">Start selling</Button>
        </Link>
      </section>
    </div>
  );
}
