import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
  @Input() imageUrl: string = '';
  @Input() superheroName: string = '';
  @Input() characterName: string = '';
}
