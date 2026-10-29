'use client';

/* eslint-disable @next/next/no-img-element -- local object URL / backend media */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  IoCalendarOutline,
  IoCallOutline,
  IoCamera,
  IoLocationOutline,
  IoMailOutline,
  IoPerson,
  IoPersonOutline,
} from 'react-icons/io5';
import { ScreenHeader } from '@/components/app/screen-header';
import { CollegePicker } from '@/components/profile/college-picker';
import { Button, Input, Textarea } from '@/components/ui/primitives';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { prepareImage } from '@/lib/image';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';
import type { College } from '@/types/api';

const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

/** The app's EditProfileScreen. */
export default function EditProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone_number ?? '');
  const [dob, setDob] = useState(profile?.date_of_birth ?? '');
  const [city, setCity] = useState(profile?.city_location ?? '');
  const [bio, setBio] = useState('');
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

  const save = async () => {
    if (!fullName.trim()) return toast.error('Full name is required.');
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (cleanPhone && !PHONE_RE.test(cleanPhone)) {
      return toast.error('Enter a valid phone number, e.g. +919876543210.');
    }
    const form = new FormData();
    form.append('full_name', fullName.trim());
    form.append('phone_number', cleanPhone);
    if (dob) form.append('date_of_birth', dob);
    if (city.trim()) form.append('city_location', city.trim());
    if (bio.trim()) form.append('bio', bio.trim());
    if (college) form.append('college', String(college.id));
    if (image) form.append('image', image);

    setSaving(true);
    try {
      await api.patch(ENDPOINTS.CORE.PROFILE_ME, form);
      await refreshProfile();
      toast.success('Profile updated successfully');
      router.push('/profile');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const photo = preview ?? profile?.image;

  return (
    <div className="mx-auto max-w-xl pb-32">
      <ScreenHeader title="Edit Profile" fallback="/profile" />
      <div className="space-y-6 px-6">
        <div className="flex flex-col items-center">
          <label className="relative cursor-pointer">
            <span className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full bg-darker-teal text-primary">
              {photo ? (
                <img src={photo} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <IoPerson size={48} />
              )}
            </span>
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
              <IoCamera size={14} />
            </span>
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
          <span className="font-heading mt-3 text-sm font-semibold text-primary">
            Change Profile Photo
          </span>
        </div>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-card">
          <Input
            label="Full Name"
            icon={<IoPersonOutline size={18} />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Email Address"
            icon={<IoMailOutline size={18} />}
            value={profile?.email ?? ''}
            disabled
          />
          <Input
            label="Phone Number"
            type="tel"
            icon={<IoCallOutline size={18} />}
            placeholder="+919876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Date of Birth"
            type="date"
            icon={<IoCalendarOutline size={18} />}
            value={dob ?? ''}
            onChange={(e) => setDob(e.target.value)}
          />
          <Input
            label="Location"
            icon={<IoLocationOutline size={18} />}
            placeholder="e.g. Salt Lake, Kolkata"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <div>
            <p className="font-heading mb-1 text-sm font-semibold text-muted">
              College / University
            </p>
            <CollegePicker value={college} onChange={setCollege} />
          </div>
          <Textarea
            label="Bio"
            placeholder="Tell others a little about yourself"
            maxLength={500}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            hint="Leave empty to keep your current bio."
          />
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-4 shadow-float">
          <Button className="w-full" onClick={save} loading={saving}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
