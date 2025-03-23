import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {
  PremiumPlansComparisonComponent
} from './components/premium-plans-comparison/premium-plans-comparison.component';
import {SubscriptionPlansComponent} from './pages/subscription-plans/subscription-plans.component';
import {PaymentPageComponent} from './pages/payment-page/payment-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'subscription-plans', component: SubscriptionPlansComponent},
  { path: 'payment', component: PaymentPageComponent},
  { path: '**', redirectTo: '' }
];
