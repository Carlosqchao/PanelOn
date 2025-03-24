import { Request, Response } from 'express';
import { stripe } from '../config/stripe';
import { db } from '../config/firebase'

export async function createSubscription(req: Request, res: Response) {
  const { paymentMethodId, planType, userId, email } = req.body;

  if (!paymentMethodId || !planType || !userId) {
    return res.status(400).json({ error: "Payment data not provided!" });
  }

  const subscriptionMap: Record<string, string> = {
    monthly: 'price_1R5cnREFPVbuZe1FMoJvWbph',
    annual: 'price_1R5dfnEFPVbuZe1FRTELKnSH'
  };

  const priceId = subscriptionMap[planType];

  if (!priceId) {
    return res.status(400).json({ error: "Type plan not valid!" });
  }

  try {
    const customer = await stripe.customers.create({
      email: email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId
      },
      metadata: {
        userId: userId || 'anon'
      }
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price : priceId }],
      expand: ['latest_invoice.payment_intent']
    });

    const paymentIntent = subscription.latest_invoice?.payment_intent;

    return res.status(200).json({
      message: 'Subscription created successfully!',
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      status: subscription.status
    });
  } catch (err) {
    console.error('Stripe subscription error:', err);
    return res.status(500).json({ error: 'Something went wrong creating the subscription.' });
  }
}

export async function getCurrentSubscription(req: Request, res: Response) {
  return;
}

export async function updateSubscription(req: Request, res: Response) {
  return;
}

export async function cancelSubscription(req: Request, res: Response) {
  return;
}
