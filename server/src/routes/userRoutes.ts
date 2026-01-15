import express from 'express';
const router = express.Router();
import { getUsers, createUser, deleteUser, toggleReviewAccess, updateUser } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

router.get('/', authenticate, authorize(['admin']), getUsers);
router.post('/', authenticate, authorize(['admin']), createUser);
router.put('/:id', authenticate, authorize(['admin']), updateUser);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);
router.patch('/:id/permissions', authenticate, authorize(['admin']), toggleReviewAccess);

export default router;
