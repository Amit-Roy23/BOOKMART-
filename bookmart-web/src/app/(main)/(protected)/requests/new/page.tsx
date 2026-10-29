'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoBookOutline,
  IoPaperPlaneOutline,
  IoPencil,
  IoPricetagOutline,
  IoSearch,
  IoStarOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { Button } from '@/components/ui/primitives';
import { useCreateRequirement } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { cn, conditionLabel } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { RequirementCondition } from '@/types/api';

// The app's RequestPostScreen (“Post a Requirement”), wired to POST /requirements/.

const CONDITIONS: RequirementCondition[] = ['NEW', 'LIKE_NEW', 'GOOD', 'ACCEPTABLE'];

function FormCard({
  icon: Icon,
  color,
  bg,
  title,
  hint,
  children,
}: {
  icon: IconType;
  color: string;
  bg: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: bg, color }}
        >
          <Icon size={18} />
        </span>
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      </div>
      {hint && <p className="mb-3 text-xs italic text-muted">{hint}</p>}
      {children}
    </section>
  );
}

export default function PostRequirementPage() {
  const router = useRouter();
  const toast = useToast();
  const create = useCreateRequirement();
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState<RequirementCondition>('NEW');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('');
  const [notes, setNotes] = useState('');

  const post = () => {
    if (!title.trim()) return toast.error('Please enter the book you are looking for.');
    if (maxPrice && Number(maxPrice) < Number(minPrice || 0)) {
      return toast.error('Maximum budget must be at least the minimum.');
    }
    const send = (coords?: GeolocationCoordinates) =>
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
            toast.success('Request posted successfully');
            router.push('/requests?tab=mine');
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        }
      );
    // Attach location when available so nearby sellers can see the request.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => send(pos.coords),
        () => send(),
        {
          timeout: 5000,
          maximumAge: 10 * 60 * 1000,
        }
      );
    } else send();
  };

  return (
    <div className="mx-auto max-w-2xl pb-32">
      <ScreenHeader title="Post a Requirement" fallback="/requests" />
      <div className="space-y-5 px-6">
        <div>
          <h2 className="text-xl font-bold text-ink">Tell us what you need</h2>
          <p className="mt-1 text-xs italic text-muted">
            Fill in the details below and we&apos;ll help you find the right match.
          </p>
        </div>

        <FormCard icon={IoBookOutline} color="#6366F1" bg="#EEF2FF" title="Book Details">
          <label
            htmlFor="book-title"
            className="font-heading mb-2 block text-xs font-bold text-ink"
          >
            Book Title / Name
          </label>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-gray-heavy px-4 focus-within:border-primary">
            <IoSearch size={18} className="text-primary" />
            <input
              id="book-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              placeholder="e.g. The Great Gatsby"
              className="h-full flex-1 bg-transparent text-base focus:outline-none"
            />
          </div>
        </FormCard>

        <FormCard
          icon={IoStarOutline}
          color="#F5C518"
          bg="#FEF9E6"
          title="Condition"
          hint="What condition are you looking for?"
        >
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(c)}
                className={cn(
                  'font-heading rounded-full px-4 py-2.5 text-xs font-semibold transition',
                  condition === c ? 'bg-primary text-white' : 'bg-app-bg text-ink'
                )}
              >
                {conditionLabel(c)}
              </button>
            ))}
          </div>
        </FormCard>

        <FormCard
          icon={IoPricetagOutline}
          color="#10B981"
          bg="#10b9811a"
          title="Price Range"
          hint="Set your maximum budget"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Min(₹)', value: minPrice, set: setMinPrice },
              { label: 'Max(₹)', value: maxPrice, set: setMaxPrice },
            ].map(({ label, value, set }) => (
              <label
                key={label}
                className="rounded-2xl border border-gray-heavy px-3 py-2 focus-within:border-primary"
              >
                <span className="block text-[10px] font-semibold text-muted">{label}</span>
                <input
                  type="number"
                  min={0}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  aria-label={label}
                  className="font-heading w-full bg-transparent text-base font-bold text-ink focus:outline-none"
                />
              </label>
            ))}
          </div>
        </FormCard>

        <FormCard icon={IoPencil} color="#D52DC2" bg="#FCE7F3" title="Additional Notes">
          <textarea
            aria-label="Additional notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific edition, author, or notes..."
            className="min-h-[100px] w-full rounded-2xl border border-gray-heavy px-4 py-3 text-base focus:border-primary focus:outline-none"
          />
        </FormCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-4 shadow-float">
          <Button className="w-full" onClick={post} loading={create.isPending}>
            <IoPaperPlaneOutline size={20} /> Post Requirement
          </Button>
        </div>
      </div>
    </div>
  );
}
