'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Check, GraduationCap, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Input, Modal, Spinner } from '@/components/ui/primitives';
import { useColleges } from '@/hooks/use-api';
import { api, getErrorMessage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';
import type { College } from '@/types/api';

export function CollegePicker({
  value,
  onChange,
}: {
  value: College | null;
  onChange: (college: College) => void;
}) {
  const toast = useToast();
  const qc = useQueryClient();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', district: '', state: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: colleges = [], isFetching } = useColleges(debounced);

  const addCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post<College>(ENDPOINTS.CORE.COLLEGES, form);
      onChange(data);
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
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your college or university"
          aria-label="Search colleges"
          className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-10 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-light"
        />
        {isFetching && <Spinner className="absolute right-3 top-3 h-5 w-5" />}
      </div>

      <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-slate-100 p-1">
        {colleges.length === 0 && !isFetching && (
          <p className="px-3 py-4 text-center text-sm text-slate-500">No colleges found.</p>
        )}
        {colleges.map((college) => {
          const selected = value?.id === college.id;
          return (
            <button
              type="button"
              key={college.id}
              onClick={() => onChange(college)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition',
                selected ? 'bg-brand-light text-brand-dark' : 'hover:bg-slate-50'
              )}
            >
              <GraduationCap className="h-4 w-4 shrink-0 text-brand-primary" />
              <span className="flex-1">
                <span className="block font-semibold">{college.name}</span>
                <span className="block text-xs text-slate-500">
                  {college.district}, {college.state}
                </span>
              </span>
              {selected && <Check className="h-4 w-4 text-brand-primary" />}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          setForm({ name: query, district: '', state: '' });
          setAdding(true);
        }}
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline"
      >
        <Plus className="h-4 w-4" /> Can’t find your college? Add it
      </button>

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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add college
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
