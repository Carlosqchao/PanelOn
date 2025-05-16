import express from 'express';
import {
  createSubscription,
  cancelSubscription,
  getSubscription
} from './controllers/suscription';

const router = express.Router();

router.post('/api/subscriptions', createSubscription);
router.delete('/api/subscriptions/:subscriptionId', cancelSubscription);
router.get('/api/subscriptions/:subscriptionId', getSubscription);

export default router;
