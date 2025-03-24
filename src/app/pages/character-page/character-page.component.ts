import { Component } from '@angular/core';
import {CharacterImageComponent} from '../../components/character-image/character-image.component';
import {SectionTitleComponent} from '../../components/section-title/section-title.component';
import {CharacterTextComponent} from '../../components/character-text/character-text.component';

@Component({
  selector: 'app-character-page',
  imports: [
    CharacterImageComponent,
    SectionTitleComponent,
    CharacterTextComponent
  ],
  templateUrl: './character-page.component.html',
  styleUrl: './character-page.component.scss'
})
export class CharacterPageComponent {

}
