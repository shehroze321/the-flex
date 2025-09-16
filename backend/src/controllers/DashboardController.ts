import { Request, Response } from 'express';
// import { ReviewService } from '@/services/ReviewService';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';
import { mockReviews, mockProperties } from '@/data/mockData';

export class DashboardController {
  constructor() {
    // ReviewService will be used when implementing real data
  }

  /**
   * GET /api/dashboard
   * Get dashboard data
   */
  getDashboardData = async (_req: Request, res: Response): Promise<void> => {
    try {
      // For now, return mock dashboard data to test frontend
      const dashboardData = {
        totalReviews: mockReviews.length,
        totalProperties: mockProperties.length,
        averageRating: mockReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / mockReviews.length,
        recentReviews: mockReviews.slice(0, 5),
        topProperties: mockProperties.slice(0, 3),
        reviewTrends: {
          last7Days: 1,
          last30Days: 2
        }
      };

      const response: ApiResponse = {
        success: true,
        data: dashboardData
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in getDashboardData controller:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };
}
