import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16'
});
