import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {
  PremiumPlansComparisonComponent
} from './components/premium-plans-comparison/premium-plans-comparison.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'compare-plans', component: PremiumPlansComparisonComponent},
  { path: '**', redirectTo: '' }
];
