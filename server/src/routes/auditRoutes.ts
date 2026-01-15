import express from 'express';
const router = express.Router();
import { getLogs, deleteLog, clearLogs, updateLog } from '../controllers/auditController';
import { authenticate, authorize } from '../middleware/auth';

router.get('/', authenticate, authorize(['admin']), getLogs);
router.delete('/:id', authenticate, authorize(['admin']), deleteLog);
router.delete('/', authenticate, authorize(['admin']), clearLogs);
router.put('/:id', authenticate, authorize(['admin']), updateLog);

export default router;
