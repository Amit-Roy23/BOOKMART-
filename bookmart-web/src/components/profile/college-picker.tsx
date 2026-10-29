'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { IoAdd, IoCheckmarkCircle, IoLocationOutline, IoSchool, IoSearch } from 'react-icons/io5';
import { Button, Input, Modal, Spinner } from '@/components/ui/primitives';
import { useColleges } from '@/hooks/use-api';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { College } from '@/types/api';

/** College search field with a suggestions dropdown, like the app's Personalization screen. */
export function CollegePicker({
  value,
  onChange,
  error,
}: {
  value: College | null;
  onChange: (college: College) => void;
  error?: string;
}) {
  const toast = useToast();
  const qc = useQueryClient();
  const [query, setQuery] = useState(value?.name ?? '');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', district: '', state: '' });
  const [saving, setSaving] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const { data: colleges = [], isFetching } = useColleges(debounced, open);

  const select = (college: College) => {
    onChange(college);
    setQuery(college.name);
    setOpen(false);
  };

  const addCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post<College>(ENDPOINTS.CORE.COLLEGES, form);
      select(data);
      qc.invalidateQueries({ queryKey: ['colleges'] });
      toast.success('College added');
      setAdding(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={wrapper} className="relative">
      <div
        className={cn(
          'flex h-14 items-center gap-3 rounded-2xl border bg-white px-4',
          open ? 'border-primary' : error ? 'border-app-red' : 'border-gray-heavy'
        )}
      >
        <IoSchool size={18} className="shrink-0 text-primary" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search your college / university"
          aria-label="Search your college or university"
          className="h-full min-w-0 flex-1 bg-transparent text-base font-medium text-ink placeholder:text-muted focus:outline-none"
        />
        {isFetching ? (
          <Spinner className="h-5 w-5 border-2" />
        ) : (
          <IoSearch size={18} className="text-muted" />
        )}
      </div>

      {value && !open && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
          <IoCheckmarkCircle size={14} /> {value.name}, {value.district}
        </p>
      )}
      {error && <p className="mt-1 text-xs text-app-red">{error}</p>}

      {open && (
        <div className="absolute inset-x-0 top-[60px] z-30 max-h-60 overflow-y-auto rounded-2xl border border-gray-light bg-white py-1 shadow-float">
          {colleges.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => select(c)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-app-bg"
            >
              <IoLocationOutline size={14} className="shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-semibold text-text">{c.name}</span>
                <span className="text-muted">
                  {' '}
                  · {c.district}, {c.state}
                </span>
              </span>
            </button>
          ))}
          {!isFetching && colleges.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted">No colleges found.</p>
          )}
          <button
            type="button"
            onClick={() => {
              setForm({ name: query, district: '', state: '' });
              setAdding(true);
              setOpen(false);
            }}
            className="font-heading flex w-full items-center gap-2 border-t border-gray-light px-4 py-3 text-left text-sm font-semibold text-primary hover:bg-secondary"
          >
            <IoAdd size={18} /> Can’t find it? Add your college
          </button>
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add your college">
        <form onSubmit={addCollege} className="space-y-4">
          <Input
            label="College name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="District"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            required
          />
          <Input
            label="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setAdding(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              Add college
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
