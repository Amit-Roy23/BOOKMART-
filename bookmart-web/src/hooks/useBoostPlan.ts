"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchBoostData, boostBooks } from "@/services/boost";
import type { BoostData, PlanId } from "@/types/boost";

interface UseBoostPlanResult {
  data: BoostData | null;
  loading: boolean;
  error: string | null;
  reload: () => void;

  selectedPlanId: PlanId;
  setSelectedPlanId: (id: PlanId) => void;

  selectedBookIds: string[];
  toggleBook: (id: string) => void;

  usageToday: number;
  boosting: boolean;
  success: boolean;
  dismissSuccess: () => void;
  submitBoost: () => Promise<void>;

  selectedPlan?: BoostData["plans"][number];
  limit: number;
  remaining: number;
  limitReached: boolean;
  canSubmit: boolean;
}

export function useBoostPlan(): UseBoostPlanResult {
  const [data, setData] = useState<BoostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("pro-plus");
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [boosting, setBoosting] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBoostData();
      setData(result);
      setSelectedPlanId(result.currentSubscription.plan);
    } catch {
      setError("We couldn't load your boost plans. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const toggleBook = useCallback((id: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }, []);

  const selectedPlan = useMemo(
    () => data?.plans.find((p) => p.id === selectedPlanId),
    [data, selectedPlanId]
  );

  const limit = selectedPlan?.boostLimit ?? data?.currentSubscription.boostLimit ?? 1;
  const baseUsage = data?.usageToday ?? 0;
  const pending = selectedBookIds.length;
  const usageToday = Math.min(baseUsage + pending, limit);
  const remaining = Math.max(limit - (baseUsage + pending), 0);
  const limitReached = baseUsage + pending >= limit;
  const canSubmit = selectedBookIds.length > 0 && !boosting;

  const submitBoost = useCallback(async () => {
    if (selectedBookIds.length === 0) return;
    setBoosting(true);
    setSuccess(false);
    try {
      const { boosted } = await boostBooks(selectedBookIds);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          usageToday: Math.min(prev.usageToday + boosted.length, limit),
          books: prev.books.map((b) =>
            boosted.includes(b.id) ? { ...b, boosted: true } : b
          ),
        };
      });
      setSelectedBookIds([]);
      setSuccess(true);
    } catch {
      setError("Something went wrong while boosting. Please try again.");
    } finally {
      setBoosting(false);
    }
  }, [selectedBookIds, limit]);

  const dismissSuccess = useCallback(() => setSuccess(false), []);

  const reload = useCallback(() => {
    setSuccess(false);
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    reload,
    selectedPlanId,
    setSelectedPlanId,
    selectedBookIds,
    toggleBook,
    usageToday,
    boosting,
    success,
    dismissSuccess,
    submitBoost,
    selectedPlan,
    limit,
    remaining,
    limitReached,
    canSubmit,
  };
}
