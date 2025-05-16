import { stripe } from '../config/stripe';
import Stripe from 'stripe';

export class SubscriptionService {
  async createCustomer(email: string, paymentMethodId: string, userId: string): Promise<Stripe.Customer> {
    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
      metadata: { userId },
    });

    return customer;
  }

  async createSubscription(customerId: string, planType: string): Promise<Stripe.Subscription> {
    const priceMap: Record<string, string> = {
      monthly: 'price_1R5cnREFPVbuZe1FMoJvWbph',
      annual: 'price_1R5dfnEFPVbuZe1FRTELKnSH',
    };

    const priceId = priceMap[planType];
    if (!priceId) throw new Error('Invalid plan type');

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await stripe.subscriptions.cancel(subscriptionId);
  }
}


