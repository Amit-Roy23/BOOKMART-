import { BookOpen, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const HIGHLIGHTS = [
  { icon: MapPin, text: 'Find second-hand books from students near you' },
  { icon: MessageCircle, text: 'Chat with sellers directly on WhatsApp' },
  { icon: ShieldCheck, text: 'Verified accounts and community reporting' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-primary to-brand-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-2xl font-extrabold">Bookmart</span>
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Your campus
            <br />
            library companion.
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/70">Books. Students. Community.</p>
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 right-12 h-80 w-80 rounded-full bg-white/5" />
      </aside>
      <main className="flex items-center justify-center bg-white px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-xl font-extrabold text-brand-dark">Bookmart</span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
