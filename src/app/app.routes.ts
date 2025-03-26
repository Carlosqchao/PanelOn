import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {CharacterPageComponent} from './pages/character-page/character-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {ComicPageComponent} from './pages/comic-page/comic-page.component';
import {PremiumPlansComparisonComponent} from './components/premium-plans-comparison/premium-plans-comparison.component';
import {SubscriptionPlansComponent} from './pages/subscription-plans/subscription-plans.component';
import {PaymentPageComponent} from './pages/payment-page/payment-page.component';
import {ArticlePageComponent} from './pages/article-page/article-page.component';
import {ComicReaderComponent} from "./pages/comic-reader/comic-reader.component";
import {ModalTestingComponent} from './pages/modal-testing/modal-testing.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'character/:id', component: CharacterPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'comic/:id', component: ComicPageComponent },
  { path: 'news', component: ArticlePageComponent },
  { path: 'subscription-plans', component: SubscriptionPlansComponent},
  { path: 'payment', component: PaymentPageComponent},
  {path: 'comic-reader', component: ComicReaderComponent},
  { path: 'modalTest', component: ModalTestingComponent},
  { path: '**', redirectTo: '' }
];
