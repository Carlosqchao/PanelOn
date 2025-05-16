
export interface Subscription {
  id?: string;
  userId: string;
  status: string;
  planType: string;
  priceId: string;
  createdAt: Date;
  stripeCustomerId: string;
}
