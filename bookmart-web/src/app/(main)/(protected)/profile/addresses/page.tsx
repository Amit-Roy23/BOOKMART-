'use client';

import { LocateFixed, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button, Card, Input, PageHeader } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { reverseGeocode } from '@/lib/geocode';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

export default function SavedAddressPage() {
  const toast = useToast();
  const { profile, refreshProfile } = useAuth();
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

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return toast.error('Enter an address or use your current location.');
    setSaving(true);
    try {
      await api.patch(ENDPOINTS.CORE.PROFILE_ME, { city_location: address.trim() });
      await refreshProfile();
      toast.success('Address saved');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Saved address"
        description="Your default pickup area, shown on your profile and home feed."
      />
      <Card>
        {profile?.city_location && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-brand-light/60 p-4">
            <MapPin className="mt-0.5 h-5 w-5 text-brand-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark/70">
                Current
              </p>
              <p className="text-sm font-semibold text-slate-900">{profile.city_location}</p>
            </div>
          </div>
        )}
        <form onSubmit={save} className="space-y-4">
          <Input
            label="Address / area"
            placeholder="e.g. Hostel 4, Jadavpur University, Kolkata"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength={150}
          />
          <div className="flex flex-wrap justify-between gap-2">
            <Button type="button" variant="outline" onClick={detect} loading={locating}>
              <LocateFixed className="h-4 w-4" /> Use current location
            </Button>
            <Button type="submit" loading={saving}>
              Save address
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
