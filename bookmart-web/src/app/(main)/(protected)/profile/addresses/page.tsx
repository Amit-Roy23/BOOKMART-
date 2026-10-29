'use client';

import { useState } from 'react';
import {
  IoArrowBack,
  IoHomeOutline,
  IoLocate,
  IoLocationOutline,
  IoPencil,
  IoTrashOutline,
} from 'react-icons/io5';
import { useBack } from '@/components/app/screen-header';
import { Button, EmptyState, Input } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { reverseGeocode } from '@/lib/geocode';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

/** The app's SavedAddressesScreen: the profile's primary address, editable in place. */
export default function SavedAddressesPage() {
  const goBack = useBack('/profile');
  const toast = useToast();
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState(profile?.city_location ?? '');
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);

  const detect = () => {
    if (!navigator.geolocation) return toast.error('Location is not supported in this browser.');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setAddress(await reverseGeocode(pos.coords.latitude, pos.coords.longitude));
        setLocating(false);
      },
      () => {
        setLocating(false);
        toast.error('Location permission denied.');
      },
      { timeout: 10000 }
    );
  };

  const save = async (value: string) => {
    if (!value.trim()) return toast.error('Enter an address or use your current location.');
    setSaving(true);
    try {
      await api.patch(ENDPOINTS.CORE.PROFILE_ME, { city_location: value.trim() });
      await refreshProfile();
      toast.success('Address saved');
      setEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-gray-light bg-white px-6 py-4">
        <button onClick={goBack} aria-label="Go back" className="text-ink">
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-xl font-bold text-ink">Saved Addresses</h1>
      </header>

      <div className="space-y-4 px-6 py-6">
        {!editing && profile?.city_location ? (
          <>
            <p className="font-heading text-xs font-bold tracking-[0.1em] text-muted">
              PRIMARY ADDRESS
            </p>
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className="font-heading inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                  <IoHomeOutline size={13} /> Primary
                </span>
                <span className="flex gap-1">
                  <button
                    onClick={() => {
                      setAddress(profile.city_location ?? '');
                      setEditing(true);
                    }}
                    aria-label="Edit address"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-secondary"
                  >
                    <IoPencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setAddress('');
                      setEditing(true);
                    }}
                    aria-label="Replace address"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-app-red hover:bg-app-red-light"
                  >
                    <IoTrashOutline size={16} />
                  </button>
                </span>
              </div>
              <p className="mt-3 text-base text-ink">{profile.city_location}</p>
            </div>
          </>
        ) : (
          <>
            {!editing && !profile?.city_location && (
              <EmptyState
                icon={IoLocationOutline}
                title="No saved address"
                description="Add your pickup area so buyers know where you are."
              />
            )}
            <div className="space-y-4 rounded-2xl bg-white p-5 shadow-card">
              <Input
                label="Address / Area"
                icon={<IoLocationOutline size={18} />}
                placeholder="e.g. Hostel 4, Jadavpur University, Kolkata"
                value={address}
                maxLength={150}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={detect}
                  loading={locating}
                >
                  <IoLocate size={16} /> Use Current Location
                </Button>
                <Button size="md" className="flex-1" onClick={() => save(address)} loading={saving}>
                  Save Address
                </Button>
              </div>
              {editing && (
                <button
                  onClick={() => setEditing(false)}
                  className="font-heading w-full text-center text-sm font-semibold text-muted"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
