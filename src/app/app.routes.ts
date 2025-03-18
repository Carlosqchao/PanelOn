import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { UploadFormComponent } from './pages/upload-form/upload-form.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'upload-form', component: UploadFormComponent, data: { hideHeader: true } },
  { path: '**', redirectTo: '' }
];
