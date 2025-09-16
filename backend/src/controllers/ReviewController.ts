import { Request, Response } from 'express';
import { ReviewService } from '@/services/ReviewService';
import { HostawayService } from '@/services/HostawayService';
import { GoogleReviewsService } from '@/services/GoogleReviewsService';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';
import { mockReviews } from '@/data/mockData';

export class ReviewController {
  private reviewService: ReviewService;
  private hostawayService: HostawayService;
  private googleReviewsService: GoogleReviewsService;

  constructor() {
    this.reviewService = new ReviewService();
    this.hostawayService = new HostawayService();
    this.googleReviewsService = new GoogleReviewsService();
  }

  /**
   * GET /api/reviews
   * Get reviews with filtering and pagination
   */
  getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      // Try to get real data from database first
      try {
        const result = await this.reviewService.getReviews(req.query);
        const response: ApiResponse = {
          success: true,
          data: result.reviews,
          pagination: result.pagination
        };
        res.json(response);
        return;
      } catch (dbError) {
        // If database fails, fall back to mock data
        logger.warn('Database query failed, using mock data:', dbError);
      }

      // Fallback to mock data with filtering
      let filteredReviews = [...mockReviews];
      
      // Apply propertyId filter if provided
      if (req.query.propertyId && req.query.propertyId !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.propertyId === req.query.propertyId);
      }
      
      // Apply other filters
      if (req.query.rating && req.query.rating !== 'all') {
        const minRating = parseInt(req.query.rating as string);
        filteredReviews = filteredReviews.filter(review => review.rating && review.rating >= minRating);
      }
      
      if (req.query.channel && req.query.channel !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.channel === req.query.channel);
      }
      
      if (req.query.category && req.query.category !== 'all') {
        filteredReviews = filteredReviews.filter(review => 
          review.reviewCategory && review.reviewCategory.some(cat => cat.category === req.query.category)
        );
      }
      
      if (req.query.status && req.query.status !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.status === req.query.status);
      }
      
      if (req.query.search) {
        const searchTerm = (req.query.search as string).toLowerCase();
        filteredReviews = filteredReviews.filter(review => 
          review.publicReview.toLowerCase().includes(searchTerm) ||
          review.guestName.toLowerCase().includes(searchTerm)
        );
      }

      const response: ApiResponse = {
        success: true,
        data: filteredReviews,
        pagination: {
          page: 1,
          limit: 10,
          total: filteredReviews.length,
          totalPages: 1
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in getReviews controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * GET /api/reviews/:id
   * Get review by ID
   */
  getReviewById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Review ID is required'
        };
        res.status(400).json(response);
        return;
      }

      let review = null;
      
      // Try to get from database first
      try {
        review = await this.reviewService.getReviewById(id);
      } catch (dbError) {
        // If database fails, try to find in mock data
        logger.warn('Database query failed, checking mock data:', dbError);
        review = mockReviews.find(r => r.id === id) || null;
      }

      if (!review) {
        const response: ApiResponse = {
          success: false,
          error: 'Review not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: review
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in getReviewById controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * PATCH /api/reviews/:id/approval
   * Update review approval status
   */
  updateReviewApproval = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Review ID is required'
        };
        res.status(400).json(response);
        return;
      }
      const { isApproved, isPublic } = req.body;

      if (typeof isApproved !== 'boolean') {
        const response: ApiResponse = {
          success: false,
          error: 'isApproved must be a boolean'
        };
        res.status(400).json(response);
        return;
      }

      let review = null;
      
      // Try to update in database first
      try {
        review = await this.reviewService.updateReviewApproval(id, isApproved, isPublic);
      } catch (dbError) {
        // If database fails, update mock data
        logger.warn('Database update failed, updating mock data:', dbError);
        const mockReview = mockReviews.find(r => r.id === id);
        if (mockReview) {
          mockReview.isApproved = isApproved;
          if (isPublic !== undefined) {
            mockReview.isPublic = isPublic;
          }
          review = mockReview;
        }
      }

      if (!review) {
        const response: ApiResponse = {
          success: false,
          error: 'Review not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: review,
        message: 'Review approval status updated successfully'
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in updateReviewApproval controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * PATCH /api/reviews/bulk-approval
   * Bulk update review approvals
   */
  bulkUpdateApprovals = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reviewIds, isApproved, isPublic } = req.body;

      if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
        const response: ApiResponse = {
          success: false,
          error: 'reviewIds must be a non-empty array'
        };
        res.status(400).json(response);
        return;
      }

      if (typeof isApproved !== 'boolean') {
        const response: ApiResponse = {
          success: false,
          error: 'isApproved must be a boolean'
        };
        res.status(400).json(response);
        return;
      }

      let result = { success: false, updatedCount: 0, message: 'No updates made' };
      
      // Try to update in database first
      try {
        result = await this.reviewService.bulkUpdateApprovals(reviewIds, isApproved, isPublic);
      } catch (dbError) {
        // If database fails, update mock data
        logger.warn('Database bulk update failed, updating mock data:', dbError);
        let updatedCount = 0;
        for (const id of reviewIds) {
          const mockReview = mockReviews.find(r => r.id === id);
          if (mockReview) {
            mockReview.isApproved = isApproved;
            if (isPublic !== undefined) {
              mockReview.isPublic = isPublic;
            }
            updatedCount++;
          }
        }
        result = {
          success: true,
          updatedCount,
          message: `Successfully updated ${updatedCount} reviews`
        };
      }

      const response: ApiResponse = {
        success: result.success,
        data: { updatedCount: result.updatedCount },
        message: result.message
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in bulkUpdateApprovals controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * POST /api/reviews/:id/response
   * Add response to review
   */
  addReviewResponse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Review ID is required'
        };
        res.status(400).json(response);
        return;
      }
      const { response: responseText } = req.body;

      if (!responseText || typeof responseText !== 'string') {
        const response: ApiResponse = {
          success: false,
          error: 'Response text is required'
        };
        res.status(400).json(response);
        return;
      }

      let review = null;
      
      // Try to update in database first
      try {
        review = await this.reviewService.addReviewResponse(id, responseText);
      } catch (dbError) {
        // If database fails, update mock data
        logger.warn('Database update failed, updating mock data:', dbError);
        const mockReview = mockReviews.find(r => r.id === id);
        if (mockReview) {
          mockReview.response = responseText;
          review = mockReview;
        }
      }

      if (!review) {
        const errorResponse: ApiResponse = {
          success: false,
          error: 'Review not found'
        };
        res.status(404).json(errorResponse);
        return;
      }

      const successResponse: ApiResponse = {
        success: true,
        data: review,
        message: 'Review response added successfully'
      };

      res.json(successResponse);
    } catch (error) {
      logger.error('Error in addReviewResponse controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * GET /api/reviews/stats
   * Get review statistics
   */
  getReviewStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      // For now, return mock stats to test frontend
      const stats = {
        totalReviews: mockReviews.length,
        averageRating: mockReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / mockReviews.length,
        ratingDistribution: {
          5: mockReviews.filter(r => r.rating === 5).length,
          4: mockReviews.filter(r => r.rating === 4).length,
          3: mockReviews.filter(r => r.rating === 3).length,
          2: mockReviews.filter(r => r.rating === 2).length,
          1: mockReviews.filter(r => r.rating === 1).length
        },
        categoryAverages: {
          cleanliness: 4.0,
          communication: 4.5,
          'check-in': 4.0,
          accuracy: 4.0,
          location: 4.5,
          value: 4.0
        },
        recentTrends: {
          last30Days: 2,
          last7Days: 1
        }
      };

      const response: ApiResponse = {
        success: true,
        data: stats
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in getReviewStats controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * GET /api/reviews/hostaway
   * Fetch reviews from Hostaway API
   */
  fetchHostawayReviews = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.hostawayService.syncReviews();

      const response: ApiResponse = {
        success: result.success,
        data: { count: result.count },
        message: result.message
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in fetchHostawayReviews controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * GET /api/reviews/google
   * Fetch reviews from Google Places API
   */
  fetchGoogleReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const { propertyName } = req.query;

      if (!propertyName || typeof propertyName !== 'string') {
        const response: ApiResponse = {
          success: false,
          error: 'Property name is required'
        };
        res.status(400).json(response);
        return;
      }

      const reviews = await this.googleReviewsService.fetchReviewsForProperty(propertyName);

      const response: ApiResponse = {
        success: true,
        data: reviews,
        message: `Successfully fetched ${reviews.length} Google reviews for ${propertyName}`
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in fetchGoogleReviews controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  /**
   * POST /api/reviews/google/sync-all
   * Sync Google reviews for all properties
   */
  syncAllGoogleReviews = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.googleReviewsService.syncAllProperties();

      const response: ApiResponse = {
        success: result.success,
        data: { count: result.count },
        message: result.message
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in syncAllGoogleReviews controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };
}
