import { Request, Response } from 'express';
import { stripe } from '../config/stripe';
import Stripe from 'stripe';
import { firstValueFrom } from 'rxjs';
import { AppService } from '../../../src/app/app.service';

const priceMap: Record<string, string> = {
  monthly: 'price_1R5cnREFPVbuZe1FMoJvWbph',
  annual: 'price_1R5dfnEFPVbuZe1FRTELKnSH'
};

const appService = new AppService();

export async function createSubscription(req: Request, res: Response) {
  const { paymentMethodId, planType, userId, email } = req.body;

  if (!paymentMethodId || !planType || !userId || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const priceId = priceMap[planType];
  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan type' });
  }

  try {
    const alreadyActive = await hasActiveSubscription(userId);
    if (alreadyActive) {
      return res.status(200).json({ message: 'Already subscribed' });
    }

    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId
      },
      metadata: { userId }
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent']
    });

    let clientSecret: string | undefined;
    const invoice = subscription.latest_invoice;

    if (invoice && typeof invoice !== 'string') {
      const expandedInvoice = invoice as Stripe.Invoice & {
        payment_intent?: Stripe.PaymentIntent;
      };

      if (
        expandedInvoice.payment_intent &&
        typeof expandedInvoice.payment_intent !== 'string'
      ) {
        clientSecret = expandedInvoice.payment_intent.client_secret ?? undefined;
      }
    }

    const subData = {
      subscriptionId: subscription.id,
      status: subscription.status,
      planType,
      priceId,
      createdAt: new Date(),
      stripeCustomerId: customer.id
    };

    await appService.updateSubscription(userId, subscription.id, subData);

    return res.status(200).json({
      message: 'Subscription created',
      subscriptionId: subscription.id,
      clientSecret,
      status: subscription.status
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create subscription' });
  }
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subs = await firstValueFrom(appService.getUserSubscription(userId));
  return subs.some((sub: any) => sub.status === 'active' || sub.status === 'trialing');
}

export async function getUserSubscription(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const subs = await firstValueFrom(appService.getUserSubscription(userId));
    const activeSub = subs.find(sub => sub.status === 'active' || sub.status === 'trialing');

    if (!activeSub) {
      return res.status(200).json({ isSubscribed: false });
    }

    return res.status(200).json({
      isSubscribed: true,
      subscription: activeSub
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error retrieving subscription' });
  }
}

export async function cancelSubscription(req: Request, res: Response) {
  const { userId, subscriptionId } = req.body;

  if (!userId || !subscriptionId) {
    return res.status(400).json({ error: 'Missing userId or subscriptionId' });
  }

  try {
    const cancelled = await stripe.subscriptions.cancel(subscriptionId);

    await appService.updateSubscription(userId, subscriptionId, {
      status: cancelled.status,
      canceledAt: new Date()
    });

    return res.status(200).json({ message: 'Subscription canceled', status: cancelled.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}
