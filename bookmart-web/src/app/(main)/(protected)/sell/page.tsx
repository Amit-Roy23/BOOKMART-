'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BookPlus,
  Camera,
  Check,
  CheckCircle2,
  ImagePlus,
  Library,
  LocateFixed,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
  BookCover,
  Button,
  Card,
  Input,
  PageHeader,
  PageLoader,
  Skeleton,
  Spinner,
  Textarea,
} from '@/components/ui/primitives';
import { useGenres, useListing, useSaveListing } from '@/hooks/use-api';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { reverseGeocode } from '@/lib/geocode';
import { prepareImage } from '@/lib/image';
import { cn, conditionLabel, formatPrice, LISTING_CONDITIONS } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { BookCreatedResponse, BookSearchResult, Condition, ImageLabel } from '@/types/api';

const LocationPickerMap = dynamic(() => import('@/components/sell/location-picker-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

const DEFAULT_COORDS = { lat: 22.8943, lng: 88.4239 };
const STEPS = ['Book info', 'Price & condition', 'Location'];

const SLOTS: { label: ImageLabel; field: string; title: string; required: boolean }[] = [
  { label: 'FRONT_COVER', field: 'front_cover', title: 'Front cover', required: true },
  { label: 'BACK_COVER', field: 'back_cover', title: 'Back cover', required: true },
  { label: 'SPINE', field: 'spine', title: 'Spine', required: true },
  { label: 'MIDDLE_PAGE', field: 'middle_page', title: 'Middle page', required: true },
  { label: 'DAMAGE_1', field: 'damage_1', title: 'Damage 1', required: false },
  { label: 'DAMAGE_2', field: 'damage_2', title: 'Damage 2', required: false },
];

const CONDITION_HINTS: Record<Condition, string> = {
  NEW: 'Unused, straight from the shop',
  LIKE_NEW: 'Barely used, no marks',
  GOOD: 'Some wear, all pages intact',
  FAIR: 'Visible wear or highlights',
  POOR: 'Heavy wear, still readable',
};

interface Slot {
  file?: File;
  preview: string | null;
  /** Backend image id when the slot shows an already-uploaded photo. */
  existingId?: number;
}

const emptySlots = (): Slot[] => SLOTS.map(() => ({ preview: null }));

function SellForm() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { profile } = useAuth();
  const editId = params.get('edit') ?? undefined;
  const { data: editListing, isLoading: loadingEdit } = useListing(editId);
  const save = useSaveListing(editId);
  const { data: genres = [] } = useGenres();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [bookId, setBookId] = useState<number | null>(null);
  const [bookCover, setBookCover] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>(emptySlots);
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [condition, setCondition] = useState<Condition>('GOOD');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(
    null
  );
  const [locating, setLocating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedTitle, setDebouncedTitle] = useState('');
  const [done, setDone] = useState<number | null>(null);
  const hydrated = useRef(false);

  // ── Edit mode hydration ──
  useEffect(() => {
    if (!editListing || hydrated.current) return;
    if (profile && editListing.seller.id !== profile.user_id) {
      toast.error('You can only edit your own listings.');
      router.replace('/dashboard/listings');
      return;
    }
    hydrated.current = true;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time form hydration from the fetched listing */
    setTitle(editListing.book.title);
    setAuthor(editListing.book.authors.map((a) => a.name).join(', '));
    setBookId(editListing.book.id);
    setBookCover(editListing.book.cover_url || null);
    setGenre(editListing.book.genres[0] ?? '');
    setCondition(editListing.condition);
    setPrice(String(parseFloat(editListing.price)));
    setNotes(editListing.condition_notes);
    setSlots(
      SLOTS.map((slot) => {
        const img = editListing.listing_images.find((i) => i.label === slot.label);
        return img?.image_url ? { preview: img.image_url, existingId: img.id } : { preview: null };
      })
    );
    if (editListing.latitude && editListing.longitude) {
      const lat = parseFloat(editListing.latitude);
      const lng = parseFloat(editListing.longitude);
      setLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      reverseGeocode(lat, lng).then((address) => setLocation({ lat, lng, address }));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [editListing, profile, router, toast]);

  // Release object URLs created for local previews.
  const slotsRef = useRef(slots);
  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);
  useEffect(
    () => () => {
      slotsRef.current.forEach((s) => s.file && s.preview && URL.revokeObjectURL(s.preview));
    },
    []
  );

  // ── Book search suggestions (local catalog + OpenLibrary fallback) ──
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTitle(title.trim()), 450);
    return () => clearTimeout(t);
  }, [title]);

  const suggestions = useQuery({
    queryKey: ['book-search', debouncedTitle],
    queryFn: async () =>
      (await api.get<BookSearchResult[]>(ENDPOINTS.BOOKS.SEARCH, { params: { q: debouncedTitle } }))
        .data,
    enabled: showSuggestions && debouncedTitle.length >= 2,
  });

  const applyBook = (book: {
    id: number;
    title: string;
    authors: string[];
    genres: string[];
    cover_url?: string | null;
  }) => {
    setBookId(book.id);
    setTitle(book.title);
    setAuthor(book.authors.join(', '));
    setBookCover(book.cover_url ?? null);
    if (book.genres[0]) setGenre(book.genres[0]);
    setShowSuggestions(false);
  };

  const importBook = useMutation({
    mutationFn: async (key: string) =>
      (
        await api.post<BookCreatedResponse>(ENDPOINTS.BOOKS.IMPORT_OPENLIBRARY, {
          openlibrary_key: key,
          genre: genre || null,
        })
      ).data,
    onSuccess: (book) => {
      applyBook({ ...book, id: book.book_id });
      toast.success('Book details imported');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to import book.')),
  });

  const createManual = useMutation({
    mutationFn: async () =>
      (
        await api.post<BookCreatedResponse>(ENDPOINTS.BOOKS.MANUAL_CREATE, {
          title: title.trim(),
          author: author.trim() || 'Unknown',
          ...(genre ? { genre } : {}),
        })
      ).data,
    onSuccess: (book) => {
      applyBook({ ...book, id: book.book_id });
      toast.success('Book added to the catalog');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to create book.')),
  });

  // ── Photos ──
  const pickPhoto = async (index: number, file?: File) => {
    if (!file) return;
    try {
      const prepared = await prepareImage(file);
      setSlots((prev) => {
        const next = [...prev];
        const old = next[index];
        if (old.file && old.preview) URL.revokeObjectURL(old.preview);
        next[index] = {
          file: prepared,
          preview: URL.createObjectURL(prepared),
          existingId: old.existingId,
        };
        return next;
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const removePhoto = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const old = next[index];
      if (old.file && old.preview) URL.revokeObjectURL(old.preview);
      if (old.existingId) setRemovedIds((ids) => [...ids, old.existingId!]);
      next[index] = { preview: null };
      return next;
    });
  };

  // ── Location ──
  const setPoint = async (lat: number, lng: number) => {
    setLocation({ lat, lng, address: 'Finding address…' });
    const address = await reverseGeocode(lat, lng);
    setLocation({ lat, lng, address });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.info('Location is not supported. Pick your spot on the map.');
      setPoint(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setPoint(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        toast.info('Location permission denied. Pick your pickup spot on the map.');
        setLocation(
          (prev) => prev ?? { ...DEFAULT_COORDS, address: profile?.city_location || 'Campus area' }
        );
      },
      { timeout: 10000 }
    );
  };

  // ── Steps ──
  const next = () => {
    if (step === 1) {
      if (!title.trim()) return toast.error('Please enter the book title.');
      if (!author.trim()) return toast.error('Please enter the author name.');
      const missing = SLOTS.filter((s, i) => s.required && !slots[i].preview);
      if (missing.length) {
        return toast.error(
          `Please add all required photos: ${missing.map((m) => m.title).join(', ')}.`
        );
      }
    }
    if (step === 2) {
      if (!price.trim() || Number.isNaN(Number(price)) || Number(price) <= 0) {
        return toast.error('Please enter a valid price.');
      }
      if (!location) detectLocation();
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = () => {
    if (!location) return toast.error('Choose a pickup location.');
    const form = new FormData();
    form.append('price', price);
    form.append('condition', condition);
    form.append('condition_notes', notes);
    form.append('latitude', location.lat.toFixed(6));
    form.append('longitude', location.lng.toFixed(6));
    if (bookId) {
      form.append('book_id', String(bookId));
      if (genre) form.append('genre', genre);
    } else {
      form.append('title', title.trim());
      form.append('author', author.trim());
      if (genre) form.append('genre', genre);
    }
    slots.forEach((slot, i) => {
      if (slot.file) form.append(SLOTS[i].field, slot.file);
    });
    // Replaced photos are swapped by label server side; only send ids of photos that were cleared.
    const replaced = new Set(slots.filter((s) => s.file && s.existingId).map((s) => s.existingId));
    removedIds
      .filter((id) => !replaced.has(id))
      .forEach((id) => form.append('removed_image_ids', String(id)));

    save.mutate(form, {
      onSuccess: (listing) => setDone(listing.id),
      onError: (err) =>
        toast.error(
          getErrorMessage(err, editId ? 'Failed to update listing.' : 'Failed to list book.')
        ),
    });
  };

  if (editId && loadingEdit) return <PageLoader />;

  if (done) {
    return (
      <Card className="mx-auto max-w-lg py-12 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
          {editId ? 'Listing updated!' : 'Your book is live!'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {editId
            ? 'Buyers will see your changes right away.'
            : 'Students nearby can now find and contact you on WhatsApp.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href={`/listings/${done}`}>
            <Button>View listing</Button>
          </Link>
          {!editId && (
            <Link href={`/dashboard/boost?listing=${done}`}>
              <Button variant="secondary">Boost it</Button>
            </Link>
          )}
          <Button
            variant="outline"
            onClick={() => {
              if (editId) router.push('/dashboard/listings');
              else window.location.assign('/sell');
            }}
          >
            {editId ? 'Back to listings' : 'List another book'}
          </Button>
        </div>
      </Card>
    );
  }

  const busyBook = importBook.isPending || createManual.isPending;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={editId ? 'Edit listing' : 'Sell a book'}
        description="It only takes a minute. Clear photos help your book sell faster."
      />

      <ol className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => {
          const n = i + 1;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                  n < step && 'bg-emerald-500 text-white',
                  n === step && 'bg-brand-primary text-white',
                  n > step && 'bg-slate-100 text-slate-500'
                )}
              >
                {n < step ? <Check className="h-4 w-4" /> : n}
              </span>
              <span
                className={cn(
                  'hidden text-sm font-semibold sm:block',
                  n === step ? 'text-slate-900' : 'text-slate-500'
                )}
              >
                {label}
              </span>
              {n < STEPS.length && (
                <span
                  className={cn(
                    'h-0.5 flex-1 rounded',
                    n < step ? 'bg-emerald-500' : 'bg-slate-200'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <div className="space-y-5">
          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <Library className="h-5 w-5 text-brand-primary" /> Book details
            </h2>
            <div className="relative">
              <Input
                label="Title"
                placeholder="Start typing to search the catalog"
                value={title}
                autoComplete="off"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setBookId(null);
                  setBookCover(null);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {bookId && (
                <span className="absolute right-3 top-9 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <Check className="h-3 w-3" /> Linked to catalog
                </span>
              )}
              {showSuggestions && debouncedTitle.length >= 2 && !bookId && (
                <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                  {suggestions.isFetching && (
                    <p className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
                      <Spinner className="h-4 w-4" /> Searching books…
                    </p>
                  )}
                  {suggestions.data?.map((s) => (
                    <button
                      key={s.id ?? s.openlibrary_key ?? s.title}
                      type="button"
                      disabled={busyBook}
                      onClick={() =>
                        s.is_local && s.id
                          ? applyBook({
                              id: s.id,
                              title: s.title,
                              authors: s.authors,
                              genres: s.genres,
                              cover_url: s.cover_url,
                            })
                          : s.openlibrary_key && importBook.mutate(s.openlibrary_key)
                      }
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                    >
                      <span className="h-12 w-9 shrink-0 overflow-hidden rounded bg-slate-100">
                        <BookCover src={s.cover_url} alt="" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900">
                          {s.title}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {s.authors.join(', ') || 'Unknown author'}
                          {s.published_year ? ` · ${s.published_year}` : ''}
                        </span>
                      </span>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">
                        {s.is_local ? 'Catalog' : 'OpenLibrary'}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={busyBook || !title.trim()}
                    onClick={() => createManual.mutate()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-brand-primary hover:bg-brand-light"
                  >
                    {busyBook ? <Spinner className="h-4 w-4" /> : <BookPlus className="h-4 w-4" />}
                    Can’t find it? Add “{title.trim()}” manually
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="w-full px-3 py-1.5 text-right text-xs text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
            <Input
              label="Author"
              placeholder="e.g. Paulo Coelho"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <div className="space-y-1.5">
              <label htmlFor="genre" className="block text-sm font-semibold text-slate-700">
                Genre <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="genre"
                list="genre-options"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Pick or type a genre"
                className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
              <datalist id="genre-options">
                {genres.map((g) => (
                  <option key={g.id} value={g.name} />
                ))}
              </datalist>
            </div>
            {bookCover && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <span className="h-16 w-12 overflow-hidden rounded bg-slate-100">
                  <BookCover src={bookCover} alt="Catalog cover" />
                </span>
                <p className="text-xs text-slate-500">
                  Catalog cover found. Buyers still see your own photos first.
                </p>
              </div>
            )}
          </Card>

          <Card className="space-y-4">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-slate-900">
                <Camera className="h-5 w-5 text-brand-primary" /> Photos
              </h2>
              <p className="text-xs text-slate-500">
                Front cover, back cover, spine and a middle page are required. Add damage photos if
                any.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {SLOTS.map((slot, i) => {
                const current = slots[i];
                return (
                  <div key={slot.label} className="space-y-1">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                      {current.preview ? (
                        <>
                          <BookCover src={current.preview} alt={slot.title} />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white"
                            aria-label={`Remove ${slot.title}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-1 text-slate-400 hover:text-brand-primary">
                          <ImagePlus className="h-6 w-6" />
                          <span className="text-[10px] font-semibold">Add</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            aria-label={`Upload ${slot.title}`}
                            onChange={(e) => {
                              pickPhoto(i, e.target.files?.[0]);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-center text-[11px] font-semibold text-slate-600">
                      {slot.title}
                      {slot.required && <span className="text-rose-500">*</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <Card className="space-y-4">
            <h2 className="font-bold text-slate-900">Condition</h2>
            <div className="grid gap-2 sm:grid-cols-5">
              {LISTING_CONDITIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition',
                    condition === c
                      ? 'border-brand-primary bg-brand-light'
                      : 'border-slate-200 hover:border-brand-primary'
                  )}
                >
                  <span className="block text-sm font-bold text-slate-900">
                    {conditionLabel(c)}
                  </span>
                  <span className="block text-[11px] text-slate-500">{CONDITION_HINTS[c]}</span>
                </button>
              ))}
            </div>
            <Textarea
              label="Notes for buyers"
              placeholder="Highlighting, missing pages, edition details…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>
          <Card className="space-y-2">
            <h2 className="font-bold text-slate-900">Price</h2>
            <div className="relative max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min={1}
                step="1"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                aria-label="Price in rupees"
                placeholder="250"
                className="h-12 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-lg font-bold focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
            </div>
            <p className="text-xs text-slate-500">
              Tip: used books usually sell at 40–60% of the cover price.
            </p>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-bold text-slate-900">
                <MapPin className="h-5 w-5 text-brand-primary" /> Pickup location
              </h2>
              <Button variant="outline" size="sm" onClick={detectLocation} loading={locating}>
                <LocateFixed className="h-4 w-4" /> Use my location
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Click the map or drag the pin to set where buyers can pick up the book. This powers
              “books near you”.
            </p>
            <div className="h-80 overflow-hidden rounded-xl border border-slate-100">
              {location ? (
                <LocationPickerMap lat={location.lat} lng={location.lng} onPick={setPoint} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-50">
                  <MapPin className="h-8 w-8 text-slate-300" />
                  <Button size="sm" onClick={detectLocation} loading={locating}>
                    Detect my location
                  </Button>
                  <button
                    className="text-xs font-semibold text-slate-500 hover:underline"
                    onClick={() => setPoint(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng)}
                  >
                    or pick on the map
                  </button>
                </div>
              )}
            </div>
            {location && <p className="text-sm font-medium text-slate-700">{location.address}</p>}
          </Card>

          <Card>
            <h2 className="mb-3 font-bold text-slate-900">Summary</h2>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-slate-500">Book</dt>
              <dd className="font-semibold text-slate-900">{title}</dd>
              <dt className="text-slate-500">Author</dt>
              <dd className="font-semibold text-slate-900">{author}</dd>
              <dt className="text-slate-500">Condition</dt>
              <dd className="font-semibold text-slate-900">{conditionLabel(condition)}</dd>
              <dt className="text-slate-500">Price</dt>
              <dd className="font-semibold text-brand-dark">{formatPrice(price)}</dd>
            </dl>
          </Card>
        </div>
      )}

      <div className="mt-6 flex justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => (step === 1 ? router.back() : setStep((s) => s - 1))}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        {step < 3 ? (
          <Button onClick={next}>Continue</Button>
        ) : (
          <Button onClick={submit} loading={save.isPending}>
            {editId ? 'Save changes' : 'Publish listing'}
          </Button>
        )}
      </div>

      {step === 1 && (
        <p className="mt-6 flex items-center justify-center gap-1 text-xs text-slate-400">
          <Search className="h-3 w-3" /> Book data from the Bookmart catalog and OpenLibrary
        </p>
      )}
    </div>
  );
}

export default function SellPage() {
  return (
    <Suspense>
      <SellForm />
    </Suspense>
  );
}
