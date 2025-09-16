// Constants for the Flex Living Reviews Dashboard

export const REVIEW_CATEGORIES = {
  cleanliness: 'Cleanliness',
  communication: 'Communication',
  respect_house_rules: 'House Rules',
  check_in: 'Check-in',
  accuracy: 'Accuracy',
  location: 'Location',
  value: 'Value'
} as const;

export const REVIEW_CHANNELS = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  hostaway: 'Hostaway',
  google: 'Google Reviews',
  direct: 'Direct'
} as const;

export const REVIEW_STATUS = {
  published: 'Published',
  pending: 'Pending',
  rejected: 'Rejected'
} as const;

export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
} as const;

export const SEVERITY_LEVELS = {
  low: { label: 'Low', color: 'green' },
  medium: { label: 'Medium', color: 'yellow' },
  high: { label: 'High', color: 'red' }
} as const;

export const HOSTAWAY_CONFIG = {
  ACCOUNT_ID: '61148',
  API_KEY: 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152',
  BASE_URL: 'https://api.hostaway.com/v1'
} as const;

export const GOOGLE_PLACES_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
  BASE_URL: 'https://maps.googleapis.com/maps/api/place'
} as const;

export const DASHBOARD_COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
} as const;

export const CHART_COLORS = [
  '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
] as const;
