import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {ComicCoverComponent} from '../../components/comic-cover/comic-cover.component';

@Component({
  selector: 'app-comic-page',
  imports: [
    HeaderComponent,
    ComicCoverComponent
  ],
  templateUrl: './comic-page.component.html',
  styleUrl: './comic-page.component.scss'
})
export class ComicPageComponent {

}
