"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getStoredAuth } from "@/lib/api";

interface ApiError extends Error {
  status?: number;
  data?: any;
}

type UseApiQueryOptions<T> = {
  key: string | readonly (string | number)[];
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | "always";
  refetchOnWindowFocus?: boolean;

  queryOptions?: Omit<
    UseQueryOptions<T, ApiError, T, readonly unknown[]>,
    "queryKey" | "queryFn"
  >;
};

const useApiQuery = <T,>(
  url: string | null,
  {
    key,
    enabled = true,
    staleTime = 0,
    refetchOnMount = "always",
    refetchOnWindowFocus = true,
    queryOptions,
  }: UseApiQueryOptions<T>,
) => {
  const hasShownError = useRef(false);

  const { data, error, isLoading, refetch, isError } = useQuery<T, ApiError>({
    queryKey: Array.isArray(key) ? key : [key],

    queryFn: async () => {
      if (!url) throw new Error("No URL provided");

      const token = getStoredAuth()?.token;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const err: ApiError = new Error("Request failed");
        err.status = res.status;
        err.data = json;
        throw err;
      }

      return json as T;
    },

    retry: 1,
    enabled: Boolean(enabled && url),
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus,
    ...queryOptions,
  });

  // loading toast (optional)
  const loading = useRef(false);

  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(() => {
        if (!loading.current) {
          loading.current = true;
          // showLoadingToast()
        }
      }, 300);

      return () => clearTimeout(t);
    } else {
      loading.current = false;
      // hideLoadingToast()
    }
  }, [isLoading]);

  // error handling
  useEffect(() => {
    if (error && !hasShownError.current) {
      if (error.status !== 401) {
        console.error("API Error:", error.data || error.message);
      }
      hasShownError.current = true;
    }

    if (data && hasShownError.current) {
      hasShownError.current = false;
    }
  }, [error, data]);

  return { data, error, isLoading, refetch, isError };
};

export default useApiQuery;
