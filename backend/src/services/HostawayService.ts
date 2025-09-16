import axios, { AxiosResponse } from 'axios';
import { HostawayApiResponse, HostawayReview, Review, ReviewCategory } from '@/types';
import { ReviewModel } from '@/models/Review';
import { PropertyModel } from '@/models/Property';
import { logger } from '@/utils/logger';
import Env from '@/config/env';

export class HostawayService {
  private readonly baseUrl: string;
  private readonly accountId: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = Env.HOSTAWAY_BASE_URL;
    this.accountId = Env.HOSTAWAY_ACCOUNT_ID;
    this.apiKey = Env.HOSTAWAY_API_KEY;
  }

  /**
   * Fetch reviews from Hostaway API
   */
  async fetchReviews(): Promise<Review[]> {
    try {
      logger.info('Fetching reviews from Hostaway API');
      
      const response: AxiosResponse<HostawayApiResponse> = await axios.get(
        `${this.baseUrl}/reviews`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          params: {
            accountId: this.accountId
          }
        }
      );

      if (response.data.status === 'error') {
        throw new Error(response.data.error || 'Failed to fetch reviews from Hostaway');
      }

      const hostawayReviews = response.data.result || [];
      const normalizedReviews = await this.normalizeReviews(hostawayReviews);
      
      logger.info(`Successfully fetched ${normalizedReviews.length} reviews from Hostaway`);
      return normalizedReviews;
    } catch (error) {
      logger.error('Error fetching reviews from Hostaway:', error);
      throw new Error(`Failed to fetch reviews from Hostaway: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Normalize Hostaway reviews to our internal format
   */
  private async normalizeReviews(hostawayReviews: HostawayReview[]): Promise<Review[]> {
    const normalizedReviews: Review[] = [];

    for (const hostawayReview of hostawayReviews) {
      try {
        // Find or create property
        const property = await this.findOrCreateProperty(hostawayReview.listingName);
        
        // Normalize review categories
        const reviewCategories: ReviewCategory[] = hostawayReview.reviewCategory.map(cat => ({
          category: this.normalizeCategory(cat.category),
          rating: cat.rating
        }));

        // Create normalized review
        const normalizedReview: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> = {
          type: hostawayReview.type,
          status: hostawayReview.status,
          rating: hostawayReview.rating,
          publicReview: hostawayReview.publicReview,
          reviewCategory: reviewCategories,
          submittedAt: hostawayReview.submittedAt,
          guestName: hostawayReview.guestName,
          listingName: hostawayReview.listingName,
          listingId: property.id,
          channel: 'hostaway',
          isApproved: false, // Default to pending approval
          isPublic: false
        };

        // Check if review already exists
        const existingReview = await ReviewModel.findOne({
          guestName: hostawayReview.guestName,
          listingName: hostawayReview.listingName,
          submittedAt: hostawayReview.submittedAt,
          channel: 'hostaway'
        });

        if (!existingReview) {
          const savedReview = await ReviewModel.create(normalizedReview);
          normalizedReviews.push(savedReview.toJSON() as Review);
        } else {
          normalizedReviews.push(existingReview.toJSON() as Review);
        }
      } catch (error) {
        logger.error(`Error normalizing review ${hostawayReview.id}:`, error);
        // Continue processing other reviews
      }
    }

    return normalizedReviews;
  }

  /**
   * Find existing property or create new one
   */
  private async findOrCreateProperty(listingName: string) {
    // Try to find existing property by name
    let property = await PropertyModel.findOne({
      name: { $regex: new RegExp(listingName.split(' - ')[1] || listingName, 'i') }
    });

    if (!property) {
      // Create new property if not found
      const propertyData = {
        name: listingName,
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
   * Normalize category names to our standard format
   */
  private normalizeCategory(category: string): ReviewCategory['category'] {
    const categoryMap: Record<string, ReviewCategory['category']> = {
      'cleanliness': 'cleanliness',
      'communication': 'communication',
      'respect_house_rules': 'respect_house_rules',
      'check_in': 'check_in',
      'accuracy': 'accuracy',
      'location': 'location',
      'value': 'value',
      'clean': 'cleanliness',
      'comm': 'communication',
      'rules': 'respect_house_rules',
      'checkin': 'check_in',
      'acc': 'accuracy',
      'loc': 'location',
      'val': 'value'
    };

    return categoryMap[category.toLowerCase()] || 'cleanliness';
  }

  /**
   * Sync reviews and update property statistics
   */
  async syncReviews(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      const reviews = await this.fetchReviews();
      
      // Update property statistics
      await this.updatePropertyStatistics();
      
      return {
        success: true,
        count: reviews.length,
        message: `Successfully synced ${reviews.length} reviews from Hostaway`
      };
    } catch (error) {
      logger.error('Error syncing reviews:', error);
      return {
        success: false,
        count: 0,
        message: `Failed to sync reviews: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Update property statistics based on reviews
   */
  private async updatePropertyStatistics(): Promise<void> {
    try {
      const properties = await PropertyModel.find({ isActive: true });
      
      for (const property of properties) {
        const reviews = await ReviewModel.find({
          listingId: property._id,
          isApproved: true
        });

        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
          : 0;

        const lastReview = reviews
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];

        await PropertyModel.findByIdAndUpdate(property._id, {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          lastReviewDate: lastReview?.submittedAt
        });
      }

      logger.info('Updated property statistics');
    } catch (error) {
      logger.error('Error updating property statistics:', error);
    }
  }
}
