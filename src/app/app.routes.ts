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
import { UploadFormComponent } from './pages/upload-form/upload-form.component';
import {UserPageComponent} from './pages/user-page/user-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';


export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'upload-form', component: UploadFormComponent, data: { hideHeader: true } },
  { path: 'character/:id', component: CharacterPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'comic/:id', component: ComicPageComponent },
  { path: 'news', component: ArticlePageComponent },
  { path: 'subscription-plans', component: SubscriptionPlansComponent},
  { path: 'payment', component: PaymentPageComponent},
  {path: 'comic-reader/:id', component: ComicReaderComponent},
  { path: 'modalTest', component: ModalTestingComponent},
  { path: 'user-page', component: UserPageComponent },
  {path: 'upload-form', component: UploadFormComponent, data: { hideHeader: true } },
  {path: 'search-page', component: SearchPageComponent},
  { path: '**', redirectTo: '' }
];
