'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoAlertCircleOutline,
  IoBookOutline,
  IoCameraOutline,
  IoCheckmark,
  IoCheckmarkCircle,
  IoChevronDown,
  IoClose,
  IoCreateOutline,
  IoDocumentTextOutline,
  IoHandLeftOutline,
  IoInformationCircleOutline,
  IoLocate,
  IoLocation,
  IoLogoWhatsapp,
  IoReaderOutline,
  IoRibbonOutline,
  IoStarOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import {
  BookCover,
  Button,
  Input,
  Modal,
  PageLoader,
  Skeleton,
  Spinner,
} from '@/components/ui/primitives';
import { useListing, useSaveListing } from '@/hooks/use-api';
import { getErrorMessage } from '@/lib/api';
import { CATEGORIES, matchesCategory } from '@/lib/categories';
import { reverseGeocode } from '@/lib/geocode';
import { prepareImage } from '@/lib/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { Condition, ImageLabel } from '@/types/api';

// Mirrors the app's Create.screen.tsx (3 steps: Book Info → Price & Condition → Location).

const LocationPickerMap = dynamic(() => import('@/components/sell/location-picker-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-none" />,
});

const DEFAULT_COORDS = { lat: 22.8943, lng: 88.4239 };
const STEPS = ['Book Info', 'Price & Condition', 'Location'];

const SLOTS: {
  label: ImageLabel;
  field: string;
  title: string;
  required: boolean;
  icon: IconType;
}[] = [
  {
    label: 'FRONT_COVER',
    field: 'front_cover',
    title: 'Front Cover',
    required: true,
    icon: IoReaderOutline,
  },
  {
    label: 'BACK_COVER',
    field: 'back_cover',
    title: 'Back Cover',
    required: true,
    icon: IoBookOutline,
  },
  { label: 'SPINE', field: 'spine', title: 'Spine', required: true, icon: IoRibbonOutline },
  {
    label: 'MIDDLE_PAGE',
    field: 'middle_page',
    title: 'Middle Page',
    required: true,
    icon: IoDocumentTextOutline,
  },
  {
    label: 'DAMAGE_1',
    field: 'damage_1',
    title: 'Damage 1',
    required: false,
    icon: IoAlertCircleOutline,
  },
  {
    label: 'DAMAGE_2',
    field: 'damage_2',
    title: 'Damage 2',
    required: false,
    icon: IoAlertCircleOutline,
  },
];

const CONDITIONS: { value: Condition; label: string; icon: IconType; color: string }[] = [
  { value: 'LIKE_NEW', label: 'Like New', icon: IoRibbonOutline, color: '#10B981' },
  { value: 'GOOD', label: 'Good', icon: IoBookOutline, color: '#008080' },
  { value: 'FAIR', label: 'Fair', icon: IoDocumentTextOutline, color: '#F5C518' },
  { value: 'POOR', label: 'Poor', icon: IoAlertCircleOutline, color: '#EF4545' },
];

interface Slot {
  file?: File;
  preview: string | null;
  existingId?: number;
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-start rounded-2xl bg-white px-4 py-4 shadow-card">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={label} className="flex flex-1 items-start last:flex-none">
            <div className="flex w-20 flex-col items-center text-center">
              <span
                className={cn(
                  'font-heading flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold',
                  done && 'border-primary bg-primary text-white',
                  active && 'border-primary bg-primary text-white',
                  !done && !active && 'border-gray-heavy bg-white text-muted'
                )}
              >
                {done ? <IoCheckmark size={14} /> : n}
              </span>
              <span
                className={cn(
                  'mt-1.5 text-[10px] font-semibold',
                  active || done ? 'text-primary' : 'text-muted'
                )}
              >
                {label}
              </span>
            </div>
            {n < STEPS.length && (
              <span
                className={cn(
                  'mt-3.5 h-0.5 flex-1 rounded',
                  done ? 'bg-primary' : 'bg-gray-heavy/60'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: IconType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-ink">
        <Icon size={18} className="text-primary" /> {title}
      </h2>
      {children}
    </section>
  );
}

function SellForm() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { profile, refreshProfile } = useAuth();
  const editId = params.get('edit') ?? undefined;
  const { data: editListing, isLoading: loadingEdit } = useListing(editId);
  const save = useSaveListing(editId);

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>(() => SLOTS.map(() => ({ preview: null })));
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [condition, setCondition] = useState<Condition>('GOOD');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(
    null
  );
  const [locating, setLocating] = useState(false);
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
    const authors = editListing.book.authors.map((a) => a.name).join(', ');
    const cat = CATEGORIES.find(
      (c) => matchesCategory(c, editListing.book.genres) && c.slug !== 'others'
    );
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from the fetched listing */
    setTitle(editListing.book.title);
    setAuthor(authors);
    if (editListing.book.genres.length && cat) setCategory(cat.label);
    setCondition(editListing.condition === 'NEW' ? 'LIKE_NEW' : editListing.condition);
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
      setLocation({ lat, lng, address: profile?.city_location || 'Saved Listing Location' });
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [editListing, profile, router, toast]);

  // Release object URLs for local previews on unmount.
  const slotsRef = useRef(slots);
  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);
  useEffect(
    () => () =>
      slotsRef.current.forEach((s) => s.file && s.preview && URL.revokeObjectURL(s.preview)),
    []
  );

  const selectedCategory = useMemo(() => CATEGORIES.find((c) => c.label === category), [category]);

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
    setLocation((prev) => ({ lat, lng, address: prev?.address ?? '' }));
    const address = await reverseGeocode(lat, lng);
    setLocation({ lat, lng, address });
  };

  const detectLocation = (manual = false) => {
    if (!navigator.geolocation) {
      setLocation(
        (prev) =>
          prev ?? {
            ...DEFAULT_COORDS,
            address: profile?.city_location || 'Campus Area Pickup Point',
          }
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setPoint(pos.coords.latitude, pos.coords.longitude);
        if (manual) toast.success('Location updated successfully');
      },
      () => {
        setLocating(false);
        if (manual) toast.info('Location permission denied. Using campus default.');
        setLocation(
          (prev) =>
            prev ?? {
              ...DEFAULT_COORDS,
              address: profile?.city_location || 'Campus Area Pickup Point',
            }
        );
      },
      { timeout: 8000 }
    );
  };

  // ── Steps ──
  const next = () => {
    if (step === 1) {
      if (!title.trim()) return toast.error('Please enter the book title');
      if (!author.trim()) return toast.error('Please enter the author name');
      if (SLOTS.some((s, i) => s.required && !slots[i].preview)) {
        return toast.error(
          'Please upload all 4 required photos (Front Cover, Back Cover, Spine, Middle Page).'
        );
      }
    }
    if (step === 2) {
      if (!price.trim() || Number.isNaN(Number(price)) || Number(price) <= 0) {
        return toast.error('Please enter a valid price');
      }
      if (!profile?.phone_number && phone.replace(/\D/g, '').length < 10) {
        return toast.error('Please enter a valid 10-digit WhatsApp phone number');
      }
      if (!location) detectLocation();
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0 });
  };

  const submit = () => {
    const form = new FormData();
    form.append('price', price);
    form.append('condition', condition);
    form.append('condition_notes', notes || description || '');
    const point = location ?? { ...DEFAULT_COORDS, address: '' };
    form.append('latitude', point.lat.toFixed(6));
    form.append('longitude', point.lng.toFixed(6));
    const bookUnchanged =
      editListing &&
      editListing.book.title === title.trim() &&
      editListing.book.authors.map((a) => a.name).join(', ') === author.trim();
    if (bookUnchanged) {
      form.append('book_id', String(editListing.book.id));
    } else {
      form.append('title', title.trim());
      form.append('author', author.trim());
    }
    if (category) {
      form.append('genre', category);
      form.append('category', category);
    }
    if (!editId && !profile?.phone_number && phone) {
      form.append(
        'phone_number',
        '+91' +
          phone
            .replace(/\D/g, '')
            .replace(/^(0|91)/, '')
            .slice(-10)
      );
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
      onSuccess: (listing) => {
        refreshProfile();
        setDone(listing.id);
      },
      onError: (err) =>
        toast.error(
          getErrorMessage(err, editId ? 'Failed to update book.' : 'Failed to list book.')
        ),
    });
  };

  if (editId && loadingEdit) return <PageLoader />;

  if (done) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-app-green-light">
          <IoCheckmarkCircle size={64} className="text-app-green" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-ink">
          {editId ? 'Listing Updated!' : 'Book Listed!'}
        </h1>
        <p className="mt-2 max-w-xs text-sm text-muted">
          {editId
            ? 'Your changes are live for buyers.'
            : 'Your book is now live. Buyers nearby can contact you on WhatsApp.'}
        </p>
        <div className="mt-8 w-full max-w-xs space-y-3">
          <Link href={`/listings/${done}`} className="block">
            <Button className="w-full">View Listing</Button>
          </Link>
          {editId ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/dashboard/listings')}
            >
              Back to My Listings
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.assign('/sell')}
            >
              List Another Book
            </Button>
          )}
        </div>
      </div>
    );
  }

  const actionRow = (primaryLabel: string, onPrimary: () => void, loading = false) => (
    <div className="flex gap-2">
      {step > 1 && (
        <Button
          variant="outline"
          className="flex-1 rounded-[14px]"
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </Button>
      )}
      <Button className="flex-[1.5] rounded-[14px]" onClick={onPrimary} loading={loading}>
        {primaryLabel}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <ScreenHeader
        title={editId ? 'Edit Listing' : 'List a Book'}
        back={!!editId}
        fallback="/dashboard/listings"
      />
      <div className="space-y-4 px-6">
        <StepIndicator step={step} />

        {step === 1 && (
          <>
            <SectionCard icon={IoCameraOutline} title="Book Photos">
              <div className="grid grid-cols-3 gap-2.5">
                {SLOTS.map((slot, i) => {
                  const current = slots[i];
                  const Icon = slot.icon;
                  return (
                    <div
                      key={slot.label}
                      className={cn(
                        'relative aspect-[3/4] overflow-hidden rounded-xl border-[1.5px] border-dashed',
                        slot.required
                          ? 'border-primary/70 bg-secondary/40'
                          : 'border-gray-heavy bg-gray-light'
                      )}
                    >
                      {current.preview ? (
                        <>
                          <BookCover src={current.preview} alt={slot.title} />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            aria-label={`Remove ${slot.title}`}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                          >
                            <IoClose size={14} />
                          </button>
                          <span className="absolute inset-x-0 bottom-0 bg-black/50 py-0.5 text-center text-[9px] font-semibold text-white">
                            {slot.title}
                          </span>
                        </>
                      ) : (
                        <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-1 px-1 text-center">
                          <Icon
                            size={22}
                            className={slot.required ? 'text-primary' : 'text-muted'}
                          />
                          <span
                            className={cn(
                              'text-[11px] font-semibold',
                              slot.required ? 'text-primary' : 'text-muted'
                            )}
                          >
                            {slot.title}
                          </span>
                          <span className="text-[9px] text-muted">
                            {slot.required ? 'Required' : 'If Any'}
                          </span>
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
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard icon={IoInformationCircleOutline} title="Book Details">
              <div className="space-y-4">
                <Input
                  label="Book Title"
                  required
                  placeholder="e.g. The Great Gatsby"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  label="Author"
                  required
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <div>
                  <p className="font-heading mb-1 text-sm font-semibold text-muted">Category</p>
                  <button
                    type="button"
                    onClick={() => setCategoryOpen(true)}
                    className="flex h-14 w-full items-center gap-3 rounded-2xl border border-gray-heavy bg-white px-4 text-left"
                  >
                    {selectedCategory ? (
                      <>
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg border"
                          style={{
                            background: selectedCategory.background,
                            borderColor: selectedCategory.border,
                          }}
                        >
                          <selectedCategory.icon size={16} color={selectedCategory.iconColor} />
                        </span>
                        <span className="flex-1 font-medium text-ink">
                          {selectedCategory.label}
                        </span>
                      </>
                    ) : (
                      <span className="flex-1 text-muted">Select Category</span>
                    )}
                    <IoChevronDown size={18} className="text-muted" />
                  </button>
                </div>
              </div>
            </SectionCard>
            {actionRow('Continue', next)}
          </>
        )}

        {step === 2 && (
          <>
            <SectionCard icon={IoStarOutline} title="Book Condition">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {CONDITIONS.map(({ value, label, icon: Icon, color }) => {
                  const active = condition === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCondition(value)}
                      className="flex flex-col items-center gap-2 rounded-2xl border-[1.5px] px-2 py-4 transition"
                      style={
                        active
                          ? { borderColor: color, background: `${color}12` }
                          : { borderColor: '#eef2f2' }
                      }
                    >
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full"
                        style={{
                          background: active ? color : '#F4F9F9',
                          color: active ? '#fff' : '#8a8a8a',
                        }}
                      >
                        <Icon size={22} />
                      </span>
                      <span
                        className={cn('text-sm', active ? 'font-bold' : 'font-medium text-muted')}
                        style={active ? { color } : undefined}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard icon={IoDocumentTextOutline} title="Notes & Price">
              <div className="space-y-4">
                <Input
                  label="Condition Notes (Optional)"
                  placeholder="e.g. Minor highlighting on pages 12–15"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Input
                  label="Price"
                  required
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="Enter your price"
                  aria-label="Price in rupees"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  icon={
                    <span className="font-heading flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-primary">
                      ₹
                    </span>
                  }
                />
                {profile?.phone_number ? (
                  <div className="flex items-center justify-between rounded-2xl border border-app-green/20 bg-app-green-light px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-app-green text-white">
                        <IoLogoWhatsapp size={16} />
                      </span>
                      <span>
                        <span className="block text-[11px] text-muted">
                          WhatsApp Contact (Saved)
                        </span>
                        <span className="font-heading block text-sm font-bold text-ink">
                          {profile.phone_number}
                        </span>
                      </span>
                    </div>
                    <IoCheckmarkCircle size={20} className="text-app-green" />
                  </div>
                ) : (
                  <Input
                    label="WhatsApp Number"
                    required
                    type="tel"
                    maxLength={13}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    hint="Required on first listing. Saved to your profile so buyers can connect with you instantly."
                    icon={
                      <span className="flex items-center gap-1 text-sm font-semibold text-text">
                        <IoLogoWhatsapp size={16} className="text-app-green" /> +91
                      </span>
                    }
                  />
                )}
              </div>
            </SectionCard>
            {actionRow('Continue', next, locating)}
          </>
        )}

        {step === 3 && (
          <>
            <SectionCard icon={IoCreateOutline} title="Description">
              <textarea
                aria-label="Description"
                placeholder="Add a detailed description of the book…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] w-full rounded-2xl border border-gray-heavy bg-white px-4 py-3 text-base font-medium text-ink placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </SectionCard>

            <section className="rounded-2xl bg-white p-4 shadow-card">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                  <IoLocation size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[15px] font-bold text-ink">Pickup Location</p>
                  <p className="text-xs text-muted">
                    {locating
                      ? 'Detecting your location…'
                      : 'Buyers will see this general pickup area'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => detectLocation(true)}
                  aria-label="Use my current location"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary"
                >
                  {locating ? <Spinner className="h-4 w-4 border-2" /> : <IoLocate size={18} />}
                </button>
              </div>
              <div className="relative h-56 overflow-hidden rounded-2xl bg-app-bg">
                <LocationPickerMap
                  lat={location?.lat ?? DEFAULT_COORDS.lat}
                  lng={location?.lng ?? DEFAULT_COORDS.lng}
                  onPick={setPoint}
                />
                <span className="pointer-events-none absolute bottom-2 left-1/2 z-[400] inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white">
                  <IoHandLeftOutline size={13} /> Tap map or drag pin to adjust
                </span>
              </div>
              <div className="mt-4">
                <Input
                  label="Pickup Address / Landmark"
                  placeholder="e.g. Central Library Gate, Hostel 3, Main Campus"
                  value={location?.address ?? ''}
                  onChange={(e) =>
                    setLocation((prev) => ({
                      ...(prev ?? DEFAULT_COORDS),
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            </section>
            {actionRow(editId ? 'Update Listing' : 'List Book', submit, save.isPending)}
          </>
        )}
      </div>

      <Modal open={categoryOpen} onClose={() => setCategoryOpen(false)} title="Select Category">
        <p className="-mt-3 mb-4 text-sm text-muted">Choose a category matching your book</p>
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map(({ slug, label, icon: Icon, background, border, iconColor }) => (
            <button
              key={slug}
              type="button"
              onClick={() => {
                setCategory(label);
                setCategoryOpen(false);
              }}
              className={cn(
                'flex items-center gap-2.5 rounded-2xl border p-3 text-left',
                category === label ? 'border-primary bg-secondary' : 'border-[#eef2f2]'
              )}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl border"
                style={{ background, borderColor: border }}
              >
                <Icon size={18} color={iconColor} />
              </span>
              <span className="text-sm font-semibold text-ink">{label}</span>
            </button>
          ))}
        </div>
      </Modal>
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
