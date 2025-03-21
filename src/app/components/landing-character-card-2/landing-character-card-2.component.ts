import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-landing-character-card-2',
  templateUrl: './landing-character-card-2.component.html',
  styleUrls: ['./landing-character-card-2.component.scss']
})
export class LandingCharacterCard2Component {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = 'Character image';
  @Input() backgroundColor: string = '#5CAAB4';
  @Input() brandName: string = 'MARVEL';
}
