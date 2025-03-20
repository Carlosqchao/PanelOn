import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {ComicReaderComponent} from "./pages/comic-reader/comic-reader.component";

export const routes: Routes = [
  {path: 'comic-reader', component: ComicReaderComponent},
];
