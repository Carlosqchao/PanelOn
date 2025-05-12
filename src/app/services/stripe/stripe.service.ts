import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Subscription} from '../../models/subscription';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = 'http://localhost:3001/api/subscriptions';

  constructor(private http: HttpClient) {}

  createCustomer(email: string, paymentMethodId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/customers`, {
      email,
      paymentMethodId,
      userId,
    });
  }

  createSubscription(customerId: string, planType: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscriptions`, {
      customerId,
      planType,
    });
  }

  cancelSubscription(subscriptionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${subscriptionId}`);
  }

  getSubscription(subscriptionId: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/${subscriptionId}`);
  }
}
