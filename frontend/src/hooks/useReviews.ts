import { useState, useEffect, useCallback } from 'react';
import { Review, ReviewFilters, ReviewStats } from '@/types';
import { useApi } from './useApi';

interface UseReviewsOptions {
  filters?: ReviewFilters;
  autoFetch?: boolean;
  propertyId?: string;
}

export function useReviews(options: UseReviewsOptions = {}) {
  const { filters = {}, autoFetch = true, propertyId } = options;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const api = useApi<{ reviews: Review[]; pagination: any }>();
  const statsApi = useApi<ReviewStats>();

  const fetchReviews = useCallback(async (newFilters?: ReviewFilters) => {
    const queryParams = new URLSearchParams();
    const currentFilters = { ...filters, ...newFilters };
    
    // Add propertyId to filters if provided
    if (propertyId) {
      currentFilters.propertyId = propertyId;
    }

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    try {
      const response = await api.get(`/api/reviews?${queryParams.toString()}`);
      if (response.success) {
        setReviews(response.data || []);
        setPagination(response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  }, [filters, propertyId, api]);

  const fetchStats = useCallback(async (propertyId?: string) => {
    const url = propertyId ? `/api/reviews/stats?propertyId=${propertyId}` : '/api/reviews/stats';
    try {
      const response = await statsApi.get(url);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [statsApi]);

  const updateReviewApproval = useCallback(async (reviewId: string, isApproved: boolean, isPublic?: boolean) => {
    await api.patch(`/api/reviews/${reviewId}/approval`, { isApproved, isPublic });
    // Refresh reviews after update
    await fetchReviews();
  }, [api, fetchReviews]);

  const bulkUpdateApprovals = useCallback(async (reviewIds: string[], isApproved: boolean, isPublic?: boolean) => {
    await api.patch('/api/reviews/bulk-approval', { reviewIds, isApproved, isPublic });
    // Refresh reviews after update
    await fetchReviews();
  }, [api, fetchReviews]);

  const addReviewResponse = useCallback(async (reviewId: string, response: string) => {
    await api.post(`/api/reviews/${reviewId}/response`, { response });
    // Refresh reviews after update
    await fetchReviews();
  }, [api, fetchReviews]);

  const syncHostawayReviews = useCallback(async () => {
    await api.get('/api/reviews/hostaway');
    // Refresh reviews after sync
    await fetchReviews();
  }, [api, fetchReviews]);

  const syncGoogleReviews = useCallback(async (propertyName?: string) => {
    if (propertyName) {
      await api.get(`/api/reviews/google?propertyName=${encodeURIComponent(propertyName)}`);
    } else {
      await api.post('/api/reviews/google');
    }
    // Refresh reviews after sync
    await fetchReviews();
  }, [api, fetchReviews]);

  const getAverageRating = useCallback(() => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return totalRating / reviews.length;
  }, [reviews]);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchReviews();
      fetchStats();
    }
  }, [autoFetch]);

  return {
    reviews,
    stats,
    pagination,
    loading: api.loading,
    error: api.error,
    statsLoading: statsApi.loading,
    statsError: statsApi.error,
    fetchReviews,
    fetchStats,
    updateReviewApproval,
    bulkUpdateApprovals,
    addReviewResponse,
    syncHostawayReviews,
    syncGoogleReviews,
    getAverageRating,
  };
}