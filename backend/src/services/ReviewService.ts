import { Review, ReviewFilters, ReviewStats, DashboardData } from '@/types';
import { ReviewModel } from '@/models/Review';
import { PropertyModel } from '@/models/Property';
import { logger } from '@/utils/logger';

export class ReviewService {
  /**
   * Get reviews with filtering and pagination
   */
  async getReviews(filters: ReviewFilters = {}): Promise<{
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const {
        propertyId,
        rating,
        category,
        channel,
        dateFrom,
        dateTo,
        status,
        isApproved,
        isPublic,
        search,
        page = 1,
        limit = 10
      } = filters;

      // Build query
      const query: any = {};

      if (propertyId) {
        query.listingId = propertyId;
      }

      if (rating) {
        query.rating = rating;
      }

      if (channel) {
        query.channel = channel;
      }

      if (status) {
        query.status = status;
      }

      if (isApproved !== undefined) {
        query.isApproved = isApproved;
      }

      if (isPublic !== undefined) {
        query.isPublic = isPublic;
      }

      if (dateFrom || dateTo) {
        query.submittedAt = {};
        if (dateFrom) {
          query.submittedAt.$gte = dateFrom;
        }
        if (dateTo) {
          query.submittedAt.$lte = dateTo;
        }
      }

      if (search) {
        query.$or = [
          { guestName: { $regex: search, $options: 'i' } },
          { publicReview: { $regex: search, $options: 'i' } },
          { listingName: { $regex: search, $options: 'i' } }
        ];
      }

      if (category) {
        query['reviewCategory.category'] = category;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const total = await ReviewModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      // Execute query
      const reviews = await ReviewModel.find(query)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return {
        reviews: reviews as Review[],
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      logger.error('Error fetching reviews:', error);
      throw new Error(`Failed to fetch reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get review by ID
   */
  async getReviewById(id: string): Promise<Review | null> {
    try {
      const review = await ReviewModel.findById(id).lean();
      return review as Review | null;
    } catch (error) {
      logger.error(`Error fetching review ${id}:`, error);
      throw new Error(`Failed to fetch review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update review approval status
   */
  async updateReviewApproval(id: string, isApproved: boolean, isPublic?: boolean): Promise<Review | null> {
    try {
      const updateData: any = { isApproved };
      if (isPublic !== undefined) {
        updateData.isPublic = isPublic;
      }

      const review = await ReviewModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).lean();

      if (review && review.listingId) {
        // Update property statistics
        await this.updatePropertyStatistics(review.listingId);
      }

      return review as Review | null;
    } catch (error) {
      logger.error(`Error updating review approval ${id}:`, error);
      throw new Error(`Failed to update review approval: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bulk update review approvals
   */
  async bulkUpdateApprovals(reviewIds: string[], isApproved: boolean, isPublic?: boolean): Promise<{
    success: boolean;
    updatedCount: number;
    message: string;
  }> {
    try {
      const updateData: any = { isApproved };
      if (isPublic !== undefined) {
        updateData.isPublic = isPublic;
      }

      const result = await ReviewModel.updateMany(
        { _id: { $in: reviewIds } },
        updateData
      );

      // Update property statistics for affected properties
      const reviews = await ReviewModel.find({ _id: { $in: reviewIds } }).select('listingId');
      const propertyIds = [...new Set(reviews.map(r => r.listingId).filter(Boolean))];
      
      for (const propertyId of propertyIds) {
        if (propertyId) {
          await this.updatePropertyStatistics(propertyId);
        }
      }

      return {
        success: true,
        updatedCount: result.modifiedCount,
        message: `Successfully updated ${result.modifiedCount} reviews`
      };
    } catch (error) {
      logger.error('Error bulk updating review approvals:', error);
      return {
        success: false,
        updatedCount: 0,
        message: `Failed to update reviews: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Add response to review
   */
  async addReviewResponse(id: string, response: string): Promise<Review | null> {
    try {
      const review = await ReviewModel.findByIdAndUpdate(
        id,
        { response },
        { new: true }
      ).lean();

      return review as Review | null;
    } catch (error) {
      logger.error(`Error adding review response ${id}:`, error);
      throw new Error(`Failed to add review response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get review statistics
   */
  async getReviewStats(propertyId?: string): Promise<ReviewStats> {
    try {
      const matchQuery = propertyId ? { listingId: propertyId } : {};

      // Get total reviews and average rating
      const totalStats = await ReviewModel.aggregate([
        { $match: { ...matchQuery, isApproved: true } },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }
        }
      ]);

      const totalReviews = totalStats[0]?.totalReviews || 0;
      const averageRating = totalStats[0]?.averageRating || 0;

      // Get rating distribution
      const ratingDistribution = await ReviewModel.aggregate([
        { $match: { ...matchQuery, isApproved: true, rating: { $ne: null } } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ]);

      const ratingDist: Record<number, number> = {};
      ratingDistribution.forEach(item => {
        ratingDist[item._id] = item.count;
      });

      // Get category averages
      const categoryAverages = await ReviewModel.aggregate([
        { $match: { ...matchQuery, isApproved: true } },
        { $unwind: '$reviewCategory' },
        {
          $group: {
            _id: '$reviewCategory.category',
            averageRating: { $avg: '$reviewCategory.rating' }
          }
        }
      ]);

      const categoryAvgs: Record<string, number> = {};
      categoryAverages.forEach(item => {
        categoryAvgs[item._id] = Math.round(item.averageRating * 10) / 10;
      });

      // Get channel breakdown
      const channelBreakdown = await ReviewModel.aggregate([
        { $match: { ...matchQuery, isApproved: true } },
        {
          $group: {
            _id: '$channel',
            count: { $sum: 1 }
          }
        }
      ]);

      const channelBreak: Record<string, number> = {};
      channelBreakdown.forEach(item => {
        channelBreak[item._id] = item.count;
      });

      // Get monthly trends (last 12 months)
      const monthlyTrends = await ReviewModel.aggregate([
        { $match: { ...matchQuery, isApproved: true } },
        {
          $group: {
            _id: {
              year: { $year: { $dateFromString: { dateString: '$submittedAt' } } },
              month: { $month: { $dateFromString: { dateString: '$submittedAt' } } }
            },
            count: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]);

      const monthlyTrendsData = monthlyTrends.map(item => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        count: item.count,
        averageRating: Math.round(item.averageRating * 10) / 10
      }));

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution: ratingDist,
        categoryAverages: categoryAvgs,
        channelBreakdown: channelBreak,
        monthlyTrends: monthlyTrendsData
      };
    } catch (error) {
      logger.error('Error calculating review statistics:', error);
      throw new Error(`Failed to calculate review statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Get all properties
      const properties = await PropertyModel.find({ isActive: true })
        .sort({ averageRating: -1 })
        .lean();

      // Get recent reviews
      const recentReviews = await ReviewModel.find({ isApproved: true })
        .sort({ submittedAt: -1 })
        .limit(10)
        .lean();

      // Get top performing properties
      const topPerformingProperties = properties.slice(0, 5);

      // Get issues to address (properties with low ratings or pending reviews)
      const issuesToAddress = await this.getIssuesToAddress();

      // Get overall statistics
      const stats = await this.getReviewStats();

      return {
        properties: properties as any[],
        reviews: recentReviews as Review[],
        stats,
        recentReviews: recentReviews as Review[],
        topPerformingProperties: topPerformingProperties as any[],
        issuesToAddress
      };
    } catch (error) {
      logger.error('Error fetching dashboard data:', error);
      throw new Error(`Failed to fetch dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get issues that need to be addressed
   */
  private async getIssuesToAddress(): Promise<Array<{
    propertyId: string;
    propertyName: string;
    issue: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
  }>> {
    const issues: Array<{
      propertyId: string;
      propertyName: string;
      issue: string;
      count: number;
      severity: 'low' | 'medium' | 'high';
    }> = [];

    try {
      // Get properties with low ratings
      const lowRatingProperties = await PropertyModel.find({
        isActive: true,
        averageRating: { $lt: 3.5 }
      }).lean();

      for (const property of lowRatingProperties) {
        issues.push({
          propertyId: property._id.toString(),
          propertyName: property.name,
          issue: 'Low average rating',
          count: 1,
          severity: property.averageRating < 2.5 ? 'high' : property.averageRating < 3 ? 'medium' : 'low'
        });
      }

      // Get properties with pending reviews
      const pendingReviews = await ReviewModel.aggregate([
        { $match: { isApproved: false } },
        {
          $group: {
            _id: '$listingId',
            count: { $sum: 1 }
          }
        }
      ]);

      for (const pending of pendingReviews) {
        const property = await PropertyModel.findById(pending._id).lean();
        if (property) {
          issues.push({
            propertyId: property._id.toString(),
            propertyName: property.name,
            issue: 'Pending reviews',
            count: pending.count,
            severity: pending.count > 10 ? 'high' : pending.count > 5 ? 'medium' : 'low'
          });
        }
      }

      return issues;
    } catch (error) {
      logger.error('Error getting issues to address:', error);
      return issues;
    }
  }

  /**
   * Update property statistics
   */
  private async updatePropertyStatistics(propertyId: string): Promise<void> {
    try {
      const reviews = await ReviewModel.find({
        listingId: propertyId,
        isApproved: true
      });

      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
        : 0;

      const lastReview = reviews
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];

      await PropertyModel.findByIdAndUpdate(propertyId, {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        lastReviewDate: lastReview?.submittedAt
      });
    } catch (error) {
      logger.error(`Error updating property statistics for ${propertyId}:`, error);
    }
  }
}
