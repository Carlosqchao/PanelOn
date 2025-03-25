import { Component, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing-character-card-3',
  templateUrl: './landing-character-card-3.component.html',
  styleUrls: ['./landing-character-card-3.component.scss']
})
export class LandingCharacterCard3Component {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = 'Character image';
  @Input() backgroundColor: string = '#A01F29';
  @Input() brandName: string = 'MARVEL';

  constructor(private router: Router) {}

  onCardClick(): void {
    this.router.navigate(['character']).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
