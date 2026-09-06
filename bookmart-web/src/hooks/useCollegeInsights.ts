"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCollegeInsights } from "@/services/college";
import type { CollegeInsights } from "@/types/college";

interface UseCollegeInsightsResult {
  data: CollegeInsights | null;
  loading: boolean;
  error: string | null;
  reload: (collegeId?: string) => void;
}

export function useCollegeInsights(collegeId?: string): UseCollegeInsightsResult {
  const [data, setData] = useState<CollegeInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | undefined>(collegeId);

  const load = useCallback(async (id?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCollegeInsights(id);
      setData(result);
    } catch {
      setError("We couldn't load college insights. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Mount/data fetch: state updates happen inside the async function, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(activeId);
  }, [activeId, load]);

  const reload = useCallback((id?: string) => {
    if (id !== undefined) setActiveId(id);
    else load(activeId);
  }, [activeId, load]);

  return { data, loading, error, reload };
}
