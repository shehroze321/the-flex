import { useState, useCallback } from 'react';
import { apiConfig } from '@/config/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T = any>(options?: UseApiOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (
    url: string,
    config: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      // Ensure URL is absolute
      const fullUrl = url.startsWith('http') ? url : `${apiConfig.baseUrl}${url}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        ...config,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      if (options?.onSuccess) {
        options.onSuccess(data);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      if (options?.onError) {
        options.onError(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url: string) => request(url), [request]);
  
  const post = useCallback((url: string, data?: any) => 
    request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }), [request]);
  
  const put = useCallback((url: string, data?: any) => 
    request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }), [request]);
  
  const patch = useCallback((url: string, data?: any) => 
    request(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }), [request]);
  
  const del = useCallback((url: string) => 
    request(url, { method: 'DELETE' }), [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}
