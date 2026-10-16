"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

type UseApiQueryOptions<T> = {
  key: string | readonly (string | number)[];
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | "always";
  refetchOnWindowFocus?: boolean;
  headers?: HeadersInit;

  queryOptions?: Omit<
    UseQueryOptions<T, AxiosError<ApiErrorResponse>, T, readonly unknown[]>,
    "queryKey" | "queryFn"
  >;
};

export default function useApiQuery<T,>(
  url: string | null,
  {
    key,
    enabled = true,
    staleTime = 0,
    refetchOnMount = "always",
    refetchOnWindowFocus = true,
    queryOptions,
  }: UseApiQueryOptions<T>,
) {
  const hasShownError = useRef(false);

  const { data, error, isLoading, refetch, isError } = useQuery<T, AxiosError<ApiErrorResponse>>({
    queryKey: Array.isArray(key) ? key : [key],

    queryFn: async () => {
      if (!url) throw new Error("No URL provided");

      const res = await api.get(url);

      return res.data as T;
    },

    retry: 1,
    enabled: Boolean(enabled && url),
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus,
    ...queryOptions,
  });

  // error handling
  useEffect(() => {
    if (error && !hasShownError.current) {
      if (error.status !== 401) {
        console.error("API Error:", error.response?.data || error.message);
      }
      hasShownError.current = true;
      toast.error('Failed to load data');
    }

    if (data && hasShownError.current) {
      hasShownError.current = false;
    }
  }, [error, data]);

  return { data, error, isLoading, refetch, isError };
};