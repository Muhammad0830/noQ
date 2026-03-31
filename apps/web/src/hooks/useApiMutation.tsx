"use client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

type UrlType<TVariables> = string | ((variables: TVariables) => string);

type HeaderGenerator<TVariables> = (
  variables: TVariables
) => Record<string, string>;

export function useApiMutation<TResponse = unknown, TVariables = unknown>(
  url: UrlType<TVariables>,
  method: "post" | "put" | "delete" = "post",
  headerGenerator?: HeaderGenerator<TVariables>
): UseMutationResult<TResponse, Error, TVariables> {
  // const { showToast } = useCustomToast();

  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      const finalUrl = typeof url === "function" ? url(data) : url;

      const customHeaders = headerGenerator ? headerGenerator(data) : {};

      const config: AxiosRequestConfig = {
        headers: customHeaders,
      };

      const response = await axios[method]<TResponse>(finalUrl, data, config);

      return response.data;
    },
    onError: (error) => {
      // showToast(
      //   "error",
      //   toastT("Failed to perform the action"),
      //   toastT("Internal server error")
      // );
      console.error("fetch error", error);
      throw error;
    },
  });
}
