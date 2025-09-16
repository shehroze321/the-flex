/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://the-flex-backend-pearl.vercel.app',
  endpoints: {
    health: '/health',
    reviews: '/api/reviews',
    reviewsStats: '/api/reviews/stats',
    reviewsHostaway: '/api/reviews/hostaway',
    reviewsGoogle: '/api/reviews/google',
    properties: '/api/properties',
    dashboard: '/api/dashboard',
  },
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const

export const getApiUrl = (endpoint: string): string => {
  return `${apiConfig.baseUrl}${endpoint}`
}

export const getReviewsUrl = (filters?: Record<string, any>): string => {
  const baseUrl = getApiUrl(apiConfig.endpoints.reviews)
  if (!filters || Object.keys(filters).length === 0) {
    return baseUrl
  }
  
  const queryParams = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value))
    }
  })
  
  return `${baseUrl}?${queryParams.toString()}`
}

export const getReviewUrl = (id: string): string => {
  return getApiUrl(`${apiConfig.endpoints.reviews}/${id}`)
}

export const getReviewApprovalUrl = (id: string): string => {
  return getApiUrl(`${apiConfig.endpoints.reviews}/${id}/approval`)
}

export const getReviewResponseUrl = (id: string): string => {
  return getApiUrl(`${apiConfig.endpoints.reviews}/${id}/response`)
}

export const getBulkApprovalUrl = (): string => {
  return getApiUrl(`${apiConfig.endpoints.reviews}/bulk-approval`)
}

export const getPropertyUrl = (id: string): string => {
  return getApiUrl(`${apiConfig.endpoints.properties}/${id}`)
}

export const getStatsUrl = (propertyId?: string): string => {
  const baseUrl = getApiUrl(apiConfig.endpoints.reviewsStats)
  return propertyId ? `${baseUrl}?propertyId=${propertyId}` : baseUrl
}

export const getHostawayUrl = (): string => {
  return getApiUrl(apiConfig.endpoints.reviewsHostaway)
}

export const getGoogleReviewsUrl = (propertyName?: string): string => {
  const baseUrl = getApiUrl(apiConfig.endpoints.reviewsGoogle)
  return propertyName ? `${baseUrl}?propertyName=${encodeURIComponent(propertyName)}` : baseUrl
}

export const getDashboardUrl = (): string => {
  return getApiUrl(apiConfig.endpoints.dashboard)
}
