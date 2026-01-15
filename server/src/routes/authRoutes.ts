import express from 'express';
const router = express.Router();
import { login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;
