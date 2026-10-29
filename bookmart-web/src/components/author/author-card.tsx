import { Star } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import type { Author } from '@/types/api';

export function AuthorCard({ author, className }: { author: Author; className?: string }) {
  return (
    <Link
      href={`/authors/${author.id}`}
      className={cn(
        'flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-xs transition hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <Avatar src={author.image_url} name={author.name} size={72} />
      <h3 className="mt-3 line-clamp-1 text-sm font-bold text-slate-900">{author.name}</h3>
      <p className="text-xs text-slate-500">{author.designation || 'Author'}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        {parseFloat(author.rating || '0').toFixed(1)}
      </span>
    </Link>
  );
}
