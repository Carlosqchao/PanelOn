import { Injectable } from '@angular/core';
import {FirestoreServiceInteractable} from '../firestore-interactable.service';
import {Subscription} from '../../../models/subscription';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService extends FirestoreServiceInteractable<Subscription> {

  constructor() {
    super('subscriptions')
  }

  hasActiveSubscription(userId: string): Observable<boolean> {
    return this.getAll().pipe(
      map((subscriptions: Subscription[]) => {
        return subscriptions.some(sub => sub.userId === userId && sub.status === 'active');
      })
    );
  }
}
