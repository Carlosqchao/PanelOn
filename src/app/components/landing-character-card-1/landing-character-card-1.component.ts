import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-landing-character-card-1',
  templateUrl: './landing-character-card-1.component.html',
  styleUrls: ['./landing-character-card-1.component.scss']
})
export class LandingCharacterCard1Component {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = 'Character image';
  @Input() backgroundColor: string = '#FFDD33';
  @Input() brandName: string = 'MARVEL';
}
