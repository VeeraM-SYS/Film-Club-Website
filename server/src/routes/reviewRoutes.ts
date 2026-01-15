import express from 'express';
const router = express.Router();
import { submitReview, getReviews, updateReviewStatus, deleteReview } from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';

router.post('/submit', submitReview); // Public
router.get('/', authenticate, getReviews);
router.patch('/:id', authenticate, authorize(['admin']), updateReviewStatus);
router.delete('/:id', authenticate, authorize(['admin']), deleteReview);

export default router;
