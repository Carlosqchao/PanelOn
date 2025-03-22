import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-image',
  templateUrl: './character-image.component.html',
  styleUrls: ['./character-image.component.scss']
})
export class CharacterImageComponent {
  @Input() imageUrl: string = '';
  @Input() backgroundColor: string = '#5bbcd6';
  @Input() characterName: string = '';
}
