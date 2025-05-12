import { Injectable } from '@angular/core';
import { StripeService } from './stripe.service';
import { SubscriptionsService } from '../firebase/interactable/subscriptions.service';
import { Subscription } from '../../models/subscription';
import { Observable} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionManagementService {
  constructor(
    private stripeService: StripeService,
    private subscriptionsService: SubscriptionsService
  ) {}

  create(userId: string, paymentMethodId: string, planType: string, email: string): Observable<Subscription> {
    return this.stripeService.createCustomer(email, paymentMethodId, userId).pipe(
      switchMap((customer: any) => {
        return this.stripeService.createSubscription(customer.id, planType).pipe(
          map((subscription: any) => {
            const subData: Subscription = {
              id: subscription.id,
              userId,
              stripeCustomerId: customer.id,
              status: subscription.status,
              planType,
              priceId: subscription.items.data[0].price.id,
              createdAt: new Date(),
            };

            this.subscriptionsService.add(subData).subscribe();

            return subData;
          })
        );
      })
    );
  }


  get(subscriptionId: string): Observable<Subscription | null> {
    return this.subscriptionsService.get(subscriptionId);
  }

  cancel(subscriptionId: string): Observable<void> {
    return this.stripeService.cancelSubscription(subscriptionId).pipe(
      switchMap(() => this.subscriptionsService.remove(subscriptionId))
    );
  }

  update(subscriptionId: string, data: Partial<Subscription>): Observable<void> {
    return this.subscriptionsService.get(subscriptionId).pipe(
      switchMap((existingSubscription) => {
        if (!existingSubscription) {
          throw new Error('Subscription not found');
        }
        const updatedData: Subscription = {
          id: subscriptionId,
          userId: existingSubscription.userId,
          status: data.status ?? existingSubscription.status,
          planType: data.planType ?? existingSubscription.planType,
          priceId: data.priceId ?? existingSubscription.priceId,
          createdAt: existingSubscription.createdAt,
          stripeCustomerId: existingSubscription.stripeCustomerId,
        };
        return this.subscriptionsService.update(updatedData);
      })
    );
  }
}
