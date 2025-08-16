import { useState, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

interface UseApiOptions extends AxiosRequestConfig {
  manual?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (config?: AxiosRequestConfig) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(
  url?: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: !options.manual,
    error: null,
  });

  const { manual = false, onSuccess, onError, ...axiosConfig } = options;

  const execute = useCallback(
    async (executeOptions?: AxiosRequestConfig): Promise<T> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const finalConfig = {
          ...axiosConfig,
          ...executeOptions,
          url: executeOptions?.url || url,
        };

        const response = await axios(finalConfig);
        const data = response.data;

        setState({
          data,
          loading: false,
          error: null,
        });

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorObj = new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "An error occurred"
        );

        setState({
          data: null,
          loading: false,
          error: errorObj,
        });

        if (onError) {
          onError(errorObj);
        }

        throw errorObj;
      }
    },
    [url, axiosConfig, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (!manual && url) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
