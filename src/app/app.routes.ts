import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {CharacterPageComponent} from './pages/character-page/character-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'character', component: CharacterPageComponent },
  { path: '**', redirectTo: '' }
];
