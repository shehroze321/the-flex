import axios, { AxiosResponse } from 'axios';
import { GooglePlacesResponse, GoogleReview, Review, ReviewCategory } from '@/types';
import { ReviewModel } from '@/models/Review';
import { PropertyModel } from '@/models/Property';
import { logger } from '@/utils/logger';
import Env from '@/config/env';

export class GoogleReviewsService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = Env.GOOGLE_PLACES_BASE_URL;
    this.apiKey = Env.GOOGLE_PLACES_API_KEY;
  }

  /**
   * Search for places by property name
   */
  async searchPlaces(propertyName: string): Promise<Array<{ place_id: string; name: string; rating: number; user_ratings_total: number }>> {
    try {
      if (!this.apiKey) {
        throw new Error('Google Places API key not configured');
      }

      logger.info(`Searching Google Places for: ${propertyName}`);

      const response: AxiosResponse<GooglePlacesResponse> = await axios.get(
        `${this.baseUrl}/textsearch/json`,
        {
          params: {
            query: propertyName,
            key: this.apiKey,
            type: 'lodging'
          }
        }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return response.data.results.map(result => ({
        place_id: result.place_id,
        name: result.name,
        rating: result.rating,
        user_ratings_total: result.user_ratings_total
      }));
    } catch (error) {
      logger.error('Error searching Google Places:', error);
      throw new Error(`Failed to search Google Places: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch reviews for a specific place
   */
  async fetchPlaceReviews(placeId: string): Promise<GoogleReview[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Google Places API key not configured');
      }

      logger.info(`Fetching reviews for place: ${placeId}`);

      const response: AxiosResponse<GooglePlacesResponse> = await axios.get(
        `${this.baseUrl}/details/json`,
        {
          params: {
            place_id: placeId,
            fields: 'name,rating,reviews',
            key: this.apiKey
          }
        }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      const place = response.data.results[0];
      return place?.reviews || [];
    } catch (error) {
      logger.error('Error fetching place reviews:', error);
      throw new Error(`Failed to fetch place reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch reviews for a property by name
   */
  async fetchReviewsForProperty(propertyName: string): Promise<Review[]> {
    try {
      const places = await this.searchPlaces(propertyName);
      
      if (places.length === 0) {
        logger.warn(`No Google Places found for property: ${propertyName}`);
        return [];
      }

      // Use the first (most relevant) place
      const place = places[0];
      if (!place) {
        logger.warn(`No places found for property: ${propertyName}`);
        return [];
      }
      const googleReviews = await this.fetchPlaceReviews(place.place_id);
      
      const normalizedReviews = await this.normalizeGoogleReviews(googleReviews, propertyName, place.name);
      
      logger.info(`Successfully fetched ${normalizedReviews.length} Google reviews for ${propertyName}`);
      return normalizedReviews;
    } catch (error) {
      logger.error(`Error fetching Google reviews for property ${propertyName}:`, error);
      return [];
    }
  }

  /**
   * Normalize Google reviews to our internal format
   */
  private async normalizeGoogleReviews(
    googleReviews: GoogleReview[], 
    propertyName: string, 
    placeName: string
  ): Promise<Review[]> {
    const normalizedReviews: Review[] = [];

    for (const googleReview of googleReviews) {
      try {
        // Find or create property
        const property = await this.findOrCreateProperty(propertyName, placeName);
        
        // Create normalized review
        const normalizedReview: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'guest-to-host',
          status: 'published',
          rating: googleReview.rating,
          publicReview: googleReview.text,
          reviewCategory: this.generateDefaultCategories(googleReview.rating),
          submittedAt: new Date(googleReview.time * 1000).toISOString(),
          guestName: googleReview.author_name,
          listingName: propertyName,
          listingId: property.id,
          channel: 'google',
          isApproved: false, // Default to pending approval
          isPublic: false
        };

        // Check if review already exists
        const existingReview = await ReviewModel.findOne({
          guestName: googleReview.author_name,
          listingName: propertyName,
          submittedAt: normalizedReview.submittedAt,
          channel: 'google'
        });

        if (!existingReview) {
          const savedReview = await ReviewModel.create(normalizedReview);
          normalizedReviews.push(savedReview.toJSON() as Review);
        } else {
          normalizedReviews.push(existingReview.toJSON() as Review);
        }
      } catch (error) {
        logger.error(`Error normalizing Google review:`, error);
        // Continue processing other reviews
      }
    }

    return normalizedReviews;
  }

  /**
   * Find existing property or create new one
   */
  private async findOrCreateProperty(propertyName: string, _placeName: string) {
    // Try to find existing property by name
    let property = await PropertyModel.findOne({
      name: { $regex: new RegExp(propertyName, 'i') }
    });

    if (!property) {
      // Create new property if not found
      const propertyData = {
        name: propertyName,
        address: 'Address to be updated',
        city: 'City to be updated',
        country: 'Country to be updated',
        totalReviews: 0,
        averageRating: 0,
        isActive: true
      };

      property = await PropertyModel.create(propertyData);
      logger.info(`Created new property: ${property.name}`);
    }

    return property;
  }

  /**
   * Generate default review categories based on overall rating
   */
  private generateDefaultCategories(rating: number): ReviewCategory[] {
    const baseRating = Math.max(1, Math.min(5, rating));
    const variation = 0.5; // Allow some variation in category ratings
    
    return [
      { category: 'cleanliness' as const, rating: Math.max(1, Math.min(5, baseRating + (Math.random() - 0.5) * variation)) },
      { category: 'communication' as const, rating: Math.max(1, Math.min(5, baseRating + (Math.random() - 0.5) * variation)) },
      { category: 'location' as const, rating: Math.max(1, Math.min(5, baseRating + (Math.random() - 0.5) * variation)) },
      { category: 'value' as const, rating: Math.max(1, Math.min(5, baseRating + (Math.random() - 0.5) * variation)) }
    ].map(cat => ({
      ...cat,
      rating: Math.round(cat.rating)
    }));
  }

  /**
   * Sync Google reviews for all properties
   */
  async syncAllProperties(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          count: 0,
          message: 'Google Places API key not configured'
        };
      }

      const properties = await PropertyModel.find({ isActive: true });
      let totalReviews = 0;

      for (const property of properties) {
        try {
          const reviews = await this.fetchReviewsForProperty(property.name);
          totalReviews += reviews.length;
        } catch (error) {
          logger.error(`Error syncing Google reviews for property ${property.name}:`, error);
          // Continue with other properties
        }
      }

      return {
        success: true,
        count: totalReviews,
        message: `Successfully synced ${totalReviews} Google reviews for ${properties.length} properties`
      };
    } catch (error) {
      logger.error('Error syncing Google reviews:', error);
      return {
        success: false,
        count: 0,
        message: `Failed to sync Google reviews: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
