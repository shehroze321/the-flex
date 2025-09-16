// Core types for the Flex Living Reviews Dashboard

export interface Review {
  id: string;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'pending' | 'rejected';
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  propertyId?: string;
  channel?: 'airbnb' | 'booking' | 'hostaway' | 'google' | 'direct';
  isApproved?: boolean;
  isPublic?: boolean;
  response?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewCategory {
  category: 'cleanliness' | 'communication' | 'respect_house_rules' | 'check_in' | 'accuracy' | 'location' | 'value';
  rating: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  imageUrl?: string;
  images?: string[];
  description?: string;
  propertyType?: string;
  features?: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    guests: number;
  };
  amenities?: string[];
  pricePerNight?: number;
  availability?: string;
  totalReviews: number;
  averageRating: number;
  isActive: boolean;
  lastReviewDate?: string;
}

export interface ReviewFilters {
  propertyId?: string;
  rating?: number;
  category?: string;
  channel?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'published' | 'pending' | 'rejected';
  isApproved?: boolean;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  categoryAverages: Record<string, number>;
  channelBreakdown: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    count: number;
    averageRating: number;
  }>;
}

export interface DashboardData {
  properties: Property[];
  reviews: Review[];
  stats: ReviewStats;
  recentReviews: Review[];
  topPerformingProperties: Property[];
  issuesToAddress: Array<{
    propertyId: string;
    propertyName: string;
    issue: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface HostawayApiResponse {
  status: 'success' | 'error';
  result: Review[];
  error?: string;
}

export interface GoogleReview {
  id: string;
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
  place_id: string;
}

export interface GooglePlacesResponse {
  results: Array<{
    place_id: string;
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
  }>;
  status: string;
}
