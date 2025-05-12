import { Request, Response } from 'express';
import { SubscriptionManagementService } from '../../../src/app/services/stripe/subscription-management.service';
import {StripeService} from '../../../src/app/services/stripe/stripe.service';
import {SubscriptionsService} from '../../../src/app/services/firebase/interactable/subscriptions.service';

const subscriptionService = new SubscriptionManagementService(new StripeService(), new SubscriptionsService());

export const createSubscription = async (req: Request, res: Response) => {
  const { userId, paymentMethodId, planType, email } = req.body;

  try {
    const subscription = subscriptionService.create(userId, paymentMethodId, planType, email);
    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  const { subscriptionId } = req.params;

  try {
    subscriptionService.cancel(subscriptionId);
    res.status(200).json({ message: 'Subscription canceled successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getSubscription = async (req: Request, res: Response) => {
  const { subscriptionId } = req.params;

  try {
    const subscription = subscriptionService.get(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found.' });
    }
    return res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: (error as Error).message });
  }
};
