import { Router } from 'express';
import { createSubscription } from '../services/subscription-management';

const router = Router();
router.post('/pay', createSubscription);
export default router;
