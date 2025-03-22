import { Component } from '@angular/core';
import {CharacterImageComponent} from '../../components/character-image/character-image.component';

@Component({
  selector: 'app-character-page',
  imports: [
    CharacterImageComponent
  ],
  templateUrl: './character-page.component.html',
  styleUrl: './character-page.component.scss'
})
export class CharacterPageComponent {

}
