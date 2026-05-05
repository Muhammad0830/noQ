"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/lib/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

type UrlType<TVariables> = string | ((variables: TVariables) => string);

type RequestConfigType<TVariables> =
  | AxiosRequestConfig<TVariables>
  | ((variables: TVariables) => AxiosRequestConfig<TVariables>);

export function useApiMutation<TResponse = unknown, TVariables = unknown>(
  url: UrlType<TVariables>,
  method: "post" | "put" | "delete" = "post",
  requestConfig?: RequestConfigType<TVariables>,
): UseMutationResult<TResponse, Error, TVariables> {
  const { t } = useLanguage();
  const mutation = useMutation<TResponse, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      const finalUrl = typeof url === "function" ? url(data) : url;
      const finalConfig =
        typeof requestConfig === "function"
          ? requestConfig(data)
          : requestConfig;

      const promise =
        method === "delete"
          ? api.delete<TResponse>(finalUrl, finalConfig)
          : api[method]<TResponse>(finalUrl, data, finalConfig);

      toast.promise(promise, {
        loading: t("common.loading"),
        success: t("common.success"),
        error: t("common.error"),
      });

      const response = await promise;
      return response.data;
    },
  });

  return mutation;
}
