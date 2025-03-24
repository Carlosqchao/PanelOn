import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {CharacterPageComponent} from './pages/character-page/character-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {ComicPageComponent} from './pages/comic-page/comic-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'character', component: CharacterPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'comic', component: ComicPageComponent },
  { path: '**', redirectTo: '' }
];
