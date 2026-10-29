'use client';

import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CollegePicker } from '@/components/profile/college-picker';
import { Avatar, Button, Card, Input, PageHeader, Textarea } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { prepareImage } from '@/lib/image';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { College } from '@/types/api';

const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

export default function EditProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone_number ?? '');
  const [dob, setDob] = useState(profile?.date_of_birth ?? '');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState(profile?.city_location ?? '');
  const [college, setCollege] = useState<College | null>(profile?.college ?? null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error('Full name is required.');
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (cleanPhone && !PHONE_RE.test(cleanPhone)) {
      return toast.error('Enter a valid phone number, e.g. +919876543210.');
    }
    const form = new FormData();
    form.append('full_name', fullName.trim());
    form.append('phone_number', cleanPhone);
    if (dob) form.append('date_of_birth', dob);
    if (bio.trim()) form.append('bio', bio.trim());
    if (city.trim()) form.append('city_location', city.trim());
    if (college) form.append('college', String(college.id));
    if (image) form.append('image', image);

    setSaving(true);
    try {
      await api.patch(ENDPOINTS.CORE.PROFILE_ME, form);
      await refreshProfile();
      toast.success('Profile updated');
      router.push('/profile');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit profile" description="Buyers see your name, photo and college." />
      <form onSubmit={save} className="space-y-5">
        <Card className="flex items-center gap-5">
          <div className="relative">
            <Avatar src={preview ?? profile?.image} name={fullName} size={88} />
            <label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand-primary text-white shadow">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label="Upload profile photo"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const prepared = await prepareImage(file);
                    setImage(prepared);
                    setPreview(URL.createObjectURL(prepared));
                  } catch (err) {
                    toast.error(getErrorMessage(err));
                  }
                }}
              />
            </label>
          </div>
          <div>
            <p className="font-bold text-slate-900">Profile photo</p>
            <p className="text-xs text-slate-500">JPG or PNG, up to 5 MB.</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <Input
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email"
            value={profile?.email ?? ''}
            disabled
            hint="Email can’t be changed."
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="+919876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            hint="Buyers contact you on WhatsApp at this number."
          />
          <Input
            label="Date of birth"
            type="date"
            value={dob ?? ''}
            onChange={(e) => setDob(e.target.value)}
          />
          <Input
            label="City / area"
            placeholder="e.g. Salt Lake, Kolkata"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Textarea
            label="Bio"
            placeholder="Tell others a little about yourself"
            maxLength={500}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            hint="Leave empty to keep your current bio."
          />
        </Card>

        <Card className="space-y-3">
          <div>
            <p className="font-bold text-slate-900">College</p>
            <p className="text-xs text-slate-500">
              {college
                ? `Selected: ${college.name}`
                : 'Helps students from your college find your books.'}
            </p>
          </div>
          <CollegePicker value={college} onChange={setCollege} />
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
