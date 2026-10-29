'use client';

import { ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Card, Input, PageHeader, Textarea } from '@/components/ui/primitives';
import { useCreateRequirement } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, conditionLabel } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { RequirementCondition } from '@/types/api';

const CONDITIONS: RequirementCondition[] = ['NEW', 'LIKE_NEW', 'GOOD', 'ACCEPTABLE'];

export default function NewRequestPage() {
  const router = useRouter();
  const toast = useToast();
  const create = useCreateRequirement();
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState<RequirementCondition>('GOOD');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [notes, setNotes] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Enter the book title you’re looking for.');
    if (minPrice && maxPrice && Number(maxPrice) < Number(minPrice)) {
      return toast.error('Maximum budget must be at least the minimum.');
    }
    const post = (coords?: GeolocationCoordinates) =>
      create.mutate(
        {
          book_title: title.trim(),
          preferred_condition: condition,
          ...(minPrice ? { min_price: minPrice } : {}),
          ...(maxPrice ? { max_price: maxPrice } : {}),
          notes: notes.trim(),
          ...(coords
            ? { latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) }
            : {}),
        },
        {
          onSuccess: () => {
            toast.success('Request posted! We’ll notify sellers with matching books.');
            router.push('/requests?tab=mine');
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        }
      );
    // Attach location when available so nearby sellers can see the request.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => post(pos.coords),
        () => post(),
        { timeout: 5000, maximumAge: 10 * 60 * 1000 }
      );
    } else post();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Request a book"
        description="Tell sellers what you’re looking for and your budget."
      />
      <form onSubmit={submit}>
        <Card className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl bg-brand-light/60 p-4 text-sm text-brand-dark">
            <ClipboardList className="h-5 w-5 shrink-0" />
            Your request is visible to everyone, and sellers listing a matching book are notified.
          </div>
          <Input
            label="Book title"
            placeholder="e.g. Concepts of Physics Vol. 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            required
          />
          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-700">Minimum condition</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CONDITIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-sm font-semibold transition',
                    condition === c
                      ? 'border-brand-primary bg-brand-light text-brand-dark'
                      : 'border-slate-200 text-slate-600 hover:border-brand-primary'
                  )}
                >
                  {conditionLabel(c)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min budget (₹)"
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
            />
            <Input
              label="Max budget (₹)"
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="500"
            />
          </div>
          <Textarea
            label="Notes"
            placeholder="Edition, author, any other details…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" loading={create.isPending}>
              Post request
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
