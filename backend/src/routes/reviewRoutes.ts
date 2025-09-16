import { Router } from 'express';
import { ReviewController } from '@/controllers/ReviewController';

const router = Router();
const reviewController = new ReviewController();

// Review management routes
router.get('/', reviewController.getReviews);
router.get('/stats', reviewController.getReviewStats);
router.get('/:id', reviewController.getReviewById);
router.patch('/:id/approval', reviewController.updateReviewApproval);
router.patch('/bulk-approval', reviewController.bulkUpdateApprovals);
router.post('/:id/response', reviewController.addReviewResponse);

// External API integration routes
router.get('/hostaway', reviewController.fetchHostawayReviews);
router.get('/google', reviewController.fetchGoogleReviews);
router.post('/google/sync-all', reviewController.syncAllGoogleReviews);

export default router;
