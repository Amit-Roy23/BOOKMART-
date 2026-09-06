"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { BOOK_ENDPOINTS, AUTHOR_ENDPOINTS } from "@/services/endpoints";
import type { BooksResponse, AuthorResponse } from "@/types/api";

export function useNearestBooks() {
  return useQuery<BooksResponse>({
    queryKey: ["books", "nearest"],
    queryFn: async () => {
      const { data } = await apiClient.get(BOOK_ENDPOINTS.NEAREST);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollegeFeed() {
  return useQuery<BooksResponse>({
    queryKey: ["books", "college-feed"],
    queryFn: async () => {
      const { data } = await apiClient.get(BOOK_ENDPOINTS.COLLEGE_FEED);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePopularAuthors() {
  return useQuery<AuthorResponse>({
    queryKey: ["authors", "popular"],
    queryFn: async () => {
      const { data } = await apiClient.get(AUTHOR_ENDPOINTS.POPULAR);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchBooks(query: string) {
  return useQuery<BooksResponse>({
    queryKey: ["books", "search", query],
    queryFn: async () => {
      const { data } = await apiClient.get(BOOK_ENDPOINTS.SEARCH, {
        params: { q: query },
      });
      return data;
    },
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}
